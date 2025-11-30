
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Connection details - Supports Next.js, Standard, and Expo env naming conventions
const supabaseUrl = 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.SUPABASE_URL || 
    process.env.EXPO_PUBLIC_SUPABASE_URL || 
    'https://idfpmuvuifxcmiacoxpz.supabase.co';

const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.SUPABASE_ANON_KEY || 
    process.env.EXPO_PUBLIC_SUPABASE_KEY;

let supabaseInstance: any;

// Simple event bus for auth state changes in mock mode
const authListeners:  ((event: string, session: any) => void)[] = [];

if (supabaseUrl && supabaseAnonKey && supabaseAnonKey !== '<prefer publishable key instead of anon key for mobile and desktop apps>') {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn("Supabase Init Failed, falling back to mock:", e);
    supabaseInstance = createLocalMockClient();
  }
} else {
  // No keys provided - Activate Functional Local Mock
  // console.log("Running in Offline Demo Mode (No Supabase Keys found)");
  supabaseInstance = createLocalMockClient();
}

function createLocalMockClient() {
  const STORAGE_KEY_PROFILES = 'eden_mock_profiles';
  const STORAGE_KEY_CERTS = 'eden_mock_certs';
  const STORAGE_KEY_SESSION = 'eden_mock_session';

  // Helper to simulate DB delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- MOCK AUTH ---
  const auth = {
    getSession: async () => {
        const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
        return { data: { session: sessionStr ? JSON.parse(sessionStr) : null }, error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        authListeners.push(callback);
        // Fire immediately with current state
        const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
        return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async ({ email }: any) => {
        await delay(500);
        const user = { id: 'mock-user-123', email, role: 'authenticated' };
        const session = { user, access_token: 'mock-token' };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        authListeners.forEach(cb => cb('SIGNED_IN', session));
        return { data: { user, session }, error: null };
    },
    signUp: async ({ email }: any) => {
        await delay(800);
        const user = { id: 'mock-user-123', email, role: 'authenticated' };
        const session = { user, access_token: 'mock-token' };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        authListeners.forEach(cb => cb('SIGNED_IN', session));
        return { data: { user, session }, error: null };
    },
    signOut: async () => {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        authListeners.forEach(cb => cb('SIGNED_OUT', null));
        return { error: null };
    }
  };

  // --- MOCK DB CHAIN ---
  const from = (table: string) => {
    let queryType = 'select';
    let filters: any[] = [];
    let payload: any = null;

    const chain = {
      select: (columns: string = '*') => {
        // Fix: Do not overwrite mutation types if select is chained (e.g. insert().select())
        if (queryType !== 'insert' && queryType !== 'update' && queryType !== 'upsert') {
            queryType = 'select';
        }
        return chain;
      },
      insert: (data: any) => {
        queryType = 'insert';
        payload = data;
        return chain;
      },
      update: (data: any) => {
        queryType = 'update';
        payload = data;
        return chain;
      },
      upsert: (data: any) => {
        queryType = 'upsert';
        payload = data;
        return chain;
      },
      eq: (column: string, value: any) => {
        filters.push({ column, value });
        return chain;
      },
      single: async () => {
        const res = await execute();
        return { data: res.data ? res.data[0] : null, error: res.error };
      },
      then: (resolve: any, reject: any) => {
        execute().then(resolve).catch(reject);
      }
    };

    const execute = async () => {
        await delay(200);
        const storageKey = table === 'profiles' ? STORAGE_KEY_PROFILES : STORAGE_KEY_CERTS;
        let storedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 1. INSERT
        if (queryType === 'insert') {
            const newData = Array.isArray(payload) ? payload : [payload];
            // Add IDs if missing
            const dataWithIds = newData.map((item: any) => ({ ...item, id: item.id || crypto.randomUUID() }));
            storedData = [...storedData, ...dataWithIds];
            localStorage.setItem(storageKey, JSON.stringify(storedData));
            return { data: dataWithIds, error: null };
        }

        // 2. UPDATE
        if (queryType === 'update') {
             // Find items matching filters
             let updatedCount = 0;
             storedData = storedData.map((item: any) => {
                 const matches = filters.every(f => item[f.column] === f.value);
                 if (matches) {
                     updatedCount++;
                     return { ...item, ...payload };
                 }
                 return item;
             });
             localStorage.setItem(storageKey, JSON.stringify(storedData));
             return { data: payload, error: null, count: updatedCount };
        }

        // 3. UPSERT
        if (queryType === 'upsert') {
             const newData = Array.isArray(payload) ? payload : [payload];
             const responseData: any[] = [];
             
             newData.forEach((item: any) => {
                 // Assume 'id' is the primary key for matching
                 const existingIdx = storedData.findIndex((d: any) => d.id === item.id);
                 if (existingIdx > -1) {
                     // Update existing
                     storedData[existingIdx] = { ...storedData[existingIdx], ...item };
                     responseData.push(storedData[existingIdx]);
                 } else {
                     // Insert new
                     const newItem = { ...item, id: item.id || crypto.randomUUID() };
                     storedData.push(newItem);
                     responseData.push(newItem);
                 }
             });
             
             localStorage.setItem(storageKey, JSON.stringify(storedData));
             return { data: responseData, error: null };
        }

        // 4. SELECT
        let result = storedData;
        // Apply filters
        if (filters.length > 0) {
            result = result.filter((item: any) => filters.every(f => item[f.column] === f.value));
        }
        
        // Mock default profile if not found
        if (table === 'profiles' && result.length === 0 && filters.some(f => f.column === 'id')) {
            // Return null so App.tsx can handle "new user" logic or insert a mock one
            return { data: [], error: { message: "Not found", code: "PGRST116" } };
        }

        return { data: result, error: null };
    };

    return chain;
  };

  return { auth, from } as any;
}

export const supabase = supabaseInstance;
