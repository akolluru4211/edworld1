
import React, { useState, useEffect } from 'react';
import { CodeLanguage } from '../types';
import { simulateCodeExecution, explainCode } from '../services/geminiService';
import { Play, Bug, BookOpen, Terminal, MousePointerClick, X, Sparkles, Save, ChevronDown } from 'lucide-react';

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
    [CodeLanguage.PYTHON]: 'Python',
    [CodeLanguage.JAVASCRIPT]: 'JavaScript',
    [CodeLanguage.CPP]: 'C++',
    [CodeLanguage.C]: 'C',
    [CodeLanguage.HTML]: 'HTML',
    [CodeLanguage.JAVA]: 'Java',
    [CodeLanguage.CSHARP]: 'C#',
    [CodeLanguage.KOTLIN]: 'Kotlin'
};

function CodeLanguageSelector({ current, onChange }: { current: CodeLanguage, onChange: (l: CodeLanguage) => void }) {
    return (
        <div className="relative">
            <select 
                value={current}
                onChange={(e) => onChange(e.target.value as CodeLanguage)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm hover:bg-slate-50 cursor-pointer"
            >
                {Object.values(CodeLanguage).map(lang => (
                    <option key={lang} value={lang}>
                        {LANGUAGE_LABELS[lang]}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronDown className="h-4 w-4" />
            </div>
        </div>
    );
}

export default function Compiler() {
  const defaultCode: Record<CodeLanguage, string> = {
    [CodeLanguage.PYTHON]: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Student"))',
    [CodeLanguage.JAVASCRIPT]: 'function greet(name) {\n    return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Student"));',
    [CodeLanguage.C]: '#include <stdio.h>\n\nint main() {\n    // Welcome to EdWorld C Compiler\n    printf("Hello, EdWorld!\\n");\n    return 0;\n}',
    [CodeLanguage.CPP]: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    [CodeLanguage.HTML]: '<h1>Hello World</h1>\n<p>This is a preview.</p>',
    [CodeLanguage.JAVA]: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    [CodeLanguage.CSHARP]: 'using System;\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
    [CodeLanguage.KOTLIN]: 'fun main() {\n    println("Hello, World!")\n}'
  };

  // Load language from local storage or default to PYTHON
  const [language, setLanguage] = useState<CodeLanguage>(() => {
      const saved = localStorage.getItem('edworld_compiler_lang');
      return (Object.values(CodeLanguage).includes(saved as CodeLanguage)) 
        ? (saved as CodeLanguage) 
        : CodeLanguage.PYTHON;
  });

  // Load code from local storage for the specific language, or use default
  const [code, setCode] = useState<string>(() => {
      const saved = localStorage.getItem(`edworld_compiler_code_${language}`);
      return saved !== null ? saved : defaultCode[language];
  });

  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [selection, setSelection] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...'>('Saved');

  // Auto-save effect
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
        localStorage.setItem(`edworld_compiler_code_${language}`, code);
        localStorage.setItem('edworld_compiler_lang', language);
        setSaveStatus('Saved');
    }, 1000); // Debounce save by 1s

    return () => clearTimeout(timer);
  }, [code, language]);

  const handleLanguageChange = (lang: CodeLanguage) => {
    // Save current work before switching to ensure no loss if debounce hasn't fired
    localStorage.setItem(`edworld_compiler_code_${language}`, code);

    setLanguage(lang);
    const saved = localStorage.getItem(`edworld_compiler_code_${lang}`);
    setCode(saved !== null ? saved : defaultCode[lang]);
    setOutput('');
    setAiAnalysis('');
    setSelection('');
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (target.selectionStart !== target.selectionEnd) {
      setSelection(target.value.substring(target.selectionStart, target.selectionEnd));
    } else {
      setSelection('');
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Compiling/Interpreting...');
    
    try {
        if (language === CodeLanguage.JAVASCRIPT) {
            // Safe(ish) eval for JS demo
            const logCapture: string[] = [];
            const originalLog = console.log;
            console.log = (...args) => logCapture.push(args.join(' '));
            
            try {
                // eslint-disable-next-line no-new-func
                new Function(code)(); 
                setOutput(logCapture.join('\n') || 'Code ran successfully (No output)');
            } catch (e: any) {
                setOutput(`Error: ${e.message}`);
            } finally {
                console.log = originalLog;
            }
        } else {
            // Use Gemini to simulate other languages
            const result = await simulateCodeExecution(code, language);
            setOutput(result);
        }
    } catch (err) {
        setOutput("System Error.");
    } finally {
        setIsRunning(false);
    }
  };

  const handleExplain = async (isSnippet: boolean = false) => {
      const codeToExplain = isSnippet ? selection : code;
      
      setAiAnalysis(`Analyzing ${isSnippet ? "selection" : "full code"}...`);
      const explanation = await explainCode(codeToExplain, language, isSnippet);
      setAiAnalysis(explanation);
  };

  return (
    <div className="h-full flex flex-col gap-4 bg-slate-50 p-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <CodeLanguageSelector current={language} onChange={handleLanguageChange} />
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">EdWorld Cloud Compiler</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Save className="w-3 h-3" /> {saveStatus} locally
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => handleExplain(false)}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-50 text-brand-600 rounded-lg border border-brand-200 hover:bg-brand-100 transition-colors text-sm font-bold"
                >
                    <BookOpen className="w-4 h-4" />
                    Explain Code
                </button>
                <button 
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-md shadow-orange-500/20 transition-all font-bold text-sm"
                >
                    <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Running...' : 'Run Code'}
                </button>
            </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Editor */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-1 flex flex-col shadow-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700 justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs text-slate-400 font-mono">editor.main</span>
                    </div>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onSelect={handleSelect}
                    spellCheck="false"
                    className="flex-1 w-full bg-transparent text-slate-300 font-mono text-sm p-4 pt-10 resize-none focus:outline-none leading-relaxed selection:bg-brand-500/40 selection:text-white"
                    placeholder="Type your code here..."
                />
            </div>

            {/* Output & AI */}
            <div className="flex flex-col gap-4 min-h-0">
                {/* Snippet View - Only visible when text is selected */}
                {selection && (
                    <div className="bg-white border border-orange-200 p-4 rounded-xl animate-in slide-in-from-right-2 fade-in shadow-lg shadow-orange-500/10">
                         <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                                <MousePointerClick className="w-3 h-3" /> Selected Snippet
                             </span>
                             <button onClick={() => setSelection('')} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-3 h-3"/></button>
                         </div>
                         <div className="bg-slate-50 p-2 rounded border border-slate-200 mb-3 max-h-24 overflow-y-auto custom-scrollbar">
                             <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap break-all">
                                 {selection}
                             </pre>
                         </div>
                         <button
                            onClick={() => handleExplain(true)}
                            className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20"
                        >
                            <Sparkles className="w-3 h-3" /> Explain This Snippet
                        </button>
                    </div>
                )}

                <div className="flex-1 bg-white rounded-xl border border-slate-200 p-0 overflow-hidden flex flex-col shadow-sm">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <Terminal className="w-4 h-4" /> Console Output
                    </div>
                    <div className="flex-1 p-4 overflow-auto bg-slate-900">
                         <pre className="text-brand-300 font-mono text-sm whitespace-pre-wrap">{output || "// Console ready..."}</pre>
                    </div>
                </div>
                
                {aiAnalysis && (
                    <div className="h-1/3 bg-white rounded-xl border border-brand-200 p-4 overflow-auto animate-in fade-in slide-in-from-bottom-4 shadow-sm">
                         <div className="flex items-center gap-2 text-brand-600 font-bold mb-2">
                            <Bug className="w-4 h-4" /> AI Analysis
                        </div>
                        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{aiAnalysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
