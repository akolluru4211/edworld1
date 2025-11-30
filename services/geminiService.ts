import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const chatWithAI = async (
  prompt: string, 
  systemInstruction?: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key missing.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are a helpful AI tutor for students.",
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the EdWorld servers right now. Please check your API key.";
  }
};

export const chatWithTutor = async (
    prompt: string,
    subject: string
): Promise<{ text: string; suggestions: string[] }> => {
    const ai = getClient();
    if (!ai) return { text: "Error: API Key missing.", suggestions: [] };

    const systemInstruction = `You are an expert ${subject} teacher for K-12 students at EdWorld Academy. 
    Explain concepts clearly, use analogies, and be encouraging.
    
    IMPORTANT: In your JSON response, you MUST provide 3 "suggestions". 
    These suggestions should be short, intriguing follow-up questions (max 10 words) that the student might want to ask next to deepen their understanding of the topic.
    Encourage curiosity.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        text: {
                            type: Type.STRING,
                            description: "The main response to the student's question."
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            },
                            description: "3 short, relevant follow-up questions that the student might want to ask next."
                        }
                    },
                    required: ["text", "suggestions"]
                }
            }
        });

        const jsonStr = response.text || "{}";
        const result = JSON.parse(jsonStr);
        return {
            text: result.text || "No response generated.",
            suggestions: result.suggestions || []
        };

    } catch (error) {
        console.error("Gemini Tutor Error:", error);
        return { text: "I'm having trouble connecting to the class right now.", suggestions: [] };
    }
};

export const explainCode = async (code: string, language: string, isSnippet: boolean = false): Promise<string> => {
  const prompt = `Analyze this ${language} ${isSnippet ? 'code snippet' : 'code'}:\n\n${code}\n\n${isSnippet ? 'Explain specifically what this selected part does and how it fits into the logic.' : 'Explain what it does simply and point out any potential errors.'}`;
  return chatWithAI(prompt, "You are an expert coding instructor. Be concise and encouraging.");
};

export const simulateCodeExecution = async (code: string, language: string): Promise<string> => {
    // For languages we can't run in browser easily, we ask Gemini to simulate the output
    const prompt = `Act as a compiler/interpreter for ${language}.
    
    Code:
    ${code}
    
    Output ONLY the console output of this code. If there is an error, output the error message. Do not add markdown backticks.`;
    
    return chatWithAI(prompt, "You are a code execution engine. Strictly output only the result of the code.");
};

export const generateRobotMission = async (config: string): Promise<string> => {
    const prompt = `I have built a robot with these specs: ${config}. Generate a short, exciting 50-word mission scenario for this robot to test its capabilities in a 3D simulation.`;
    return chatWithAI(prompt, "You are a sci-fi mission control officer.");
};

// --- NEW RESUME FEATURES ---

export const analyzeResumeForATS = async (resumeText: string, jobDescription: string): Promise<{ score: number; missingKeywords: string[]; feedback: string }> => {
    const ai = getClient();
    if (!ai) return { score: 0, missingKeywords: [], feedback: "API Error" };

    const prompt = `Act as an advanced Applicant Tracking System (ATS) and Hiring Manager.
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RESUME CONTENT:
    ${resumeText}
    
    Analyze the resume against the job description.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.NUMBER,
                            description: "0-100 based on keyword match and relevance"
                        },
                        missingKeywords: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of top 5 important keywords found in JD but missing in Resume"
                        },
                        feedback: {
                            type: Type.STRING,
                            description: "A short, actionable paragraph on how to improve."
                        }
                    },
                    required: ["score", "missingKeywords", "feedback"]
                }
            }
        });
        
        const jsonStr = response.text || "{}";
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("ATS Analysis Error:", error);
        return { score: 50, missingKeywords: ["Error analyzing"], feedback: "Could not process request." };
    }
};

export const enhanceResumeContent = async (content: string, type: 'summary' | 'experience'): Promise<string> => {
    const prompt = `Rewrite the following resume ${type} to be more professional, impactful, and action-oriented. Use strong verbs and concise language.
    
    Original Text:
    "${content}"`;
    
    return chatWithAI(prompt, "You are a professional resume writer expert in ATS optimization.");
};