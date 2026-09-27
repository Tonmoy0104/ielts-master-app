import React, { useState, useEffect, useRef } from 'react';

// --- SVGs for Icons ---
const IconBookOpen = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IconBarChart = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
const IconMessageCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
const IconPenTool = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IconLoader = () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>;
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;

const WRITING_CRITERIA = `
IELTS WRITING BAND 9 CRITERIA:
Task Achievement/Response (Band 9): All requirements fully satisfied. Fully developed position, ideas fully extended and well-supported. For Task 1: Key features skillfully selected, presented, and illustrated. For Task 2: Explored in depth.
Coherence & Cohesion (Band 9): Message followed effortlessly. Cohesion attracts no attention. Skilfully managed paragraphing.
Lexical Resource (Band 9): Full flexibility and precise use. Wide range of vocabulary used accurately and naturally. Minor errors extremely rare.
Grammatical Range & Accuracy (Band 9): Wide range of structures with full flexibility. Error-free majority. Punctuation well managed.

EVALUATION GUIDELINES (Bands 1-8 summary):
Band 8: Well-developed, occasional minor omissions. Occasional errors in vocab/grammar.
Band 7: Clear position, main ideas extended but maybe over-generalized. Frequent error-free sentences.
Band 6: Relevant position, but conclusions may be unclear. Some inaccurate vocab/grammar that rarely impedes communication.
Band 5: Incomplete address of prompt, limited development, frequent grammatical errors.
`;

const SPEAKING_CRITERIA = `
IELTS SPEAKING BAND 9 CRITERIA:
Fluency and Coherence (Band 9): Fluent with rare repetition/self-correction (only to prepare next utterance, not for language). Situationally appropriate, fully coherent topic development.
Lexical Resource (Band 9): Total flexibility, precise use in all contexts. Sustained idiomatic language. Skilful use of less common items.
Grammatical Range (Band 9): Precise and accurate at all times, apart from native-like slips. Wide range.
Pronunciation (Band 9): (Evaluate based on phrasing and vocabulary choice indicating natural rhythm).

EVALUATION GUIDELINES (Bands 1-8 summary):
Band 8: Fluent, mostly content-related hesitation. Occasional inaccuracies.
Band 7: Keeps going without noticeable effort, some hesitation/correction. Error-free sentences frequent.
Band 6: Willing to speak at length, coherence occasionally lost. Mix of short/complex forms.
Band 5: Relies on slow speech/repetition. Limited flexibility.
`;

// API calls are handled by the Vercel server function.


// JSON Schemas for the LLM output
const generateSchema = {
    type: "OBJECT",
    properties: {
        "estimatedBandScore": { type: "STRING", description: "Format: 'X.X'. Only provide if evaluating user's draft." },
        "feedback": { type: "STRING", description: "Detailed explanation of the score or why the Band 9 version is effective." },
        "band9Version": { type: "STRING", description: "The Band 9 equivalent answer/essay/sentence." },
        "variations": { 
            type: "ARRAY", 
            items: { type: "STRING" }, 
            description: "Provide at least 5 variations. Only required for Sentence Maker." 
        }
    },
    required: ["feedback", "band9Version"]
};

const vocabSchema = {
    type: "ARRAY",
    items: {
        type: "OBJECT",
        properties: {
            "keyword": { type: "STRING", description: "The word from the text" },
            "synonyms": { type: "ARRAY", items: { type: "STRING" }, description: "3-4 advanced IELTS C1/C2 synonyms" },
            "explanation": { type: "STRING", description: "Brief context on how to use it" }
        }
    }
};

export default function App() {
    const [activeTab, setActiveTab] = useState('essay');
    const [inputType, setInputType] = useState('topic'); // 'topic' or 'draft'
    const [speakingPart, setSpeakingPart] = useState('part1');
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    
    // Image upload state for Graph Explainer
    const [imageFile, setImageFile] = useState(null);

    // Vocab state
    const [vocabLoading, setVocabLoading] = useState(false);
    const [vocabData, setVocabData] = useState(null);

    // Reset results when tab changes
    useEffect(() => {
        setResult(null);
        setVocabData(null);
        setError('');
        setInputText('');
        setImageFile(null);
    }, [activeTab]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            setImageFile({
                type: file.type,
                base64Data: base64String,
                previewUrl: URL.createObjectURL(file)
            });
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (inputType === 'draft' && !inputText.trim()) {
            setError("Please enter your draft to evaluate.");
            return;
        }
        if (inputType === 'topic' && !inputText.trim() && !(activeTab === 'graph' && imageFile)) {
            setError("Please enter a topic or upload a graph image.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        setVocabData(null);

        try {
            // Determine Context and Criteria
            let systemPrompt = "You are an expert IELTS examiner and tutor.";
            let taskDescription = "";
            let userPrompt = "";

            if (activeTab === 'essay') {
                systemPrompt += `\n${WRITING_CRITERIA}`;
                taskDescription = "You are working on IELTS Writing Task 2 (Essays).";
            } else if (activeTab === 'graph') {
                systemPrompt += `\n${WRITING_CRITERIA}`;
                taskDescription = "You are working on IELTS Writing Task 1 (Graph/Chart description).";
            } else if (activeTab === 'speaking') {
                systemPrompt += `\n${SPEAKING_CRITERIA}`;
                taskDescription = `You are working on IELTS Speaking, specifically ${speakingPart.replace('part', 'Part ')}.`;
            } else if (activeTab === 'sentence') {
                systemPrompt += `\n${SPEAKING_CRITERIA}`; // Based on user instructions
                taskDescription = "You are a Band 9 Sentence Maker. You must provide a highly advanced, idiomatic Band 9 version of the user's sentence, plus at least 5 variations.";
            }

            // Construct specific instructions based on input type
            if (inputType === 'draft') {
                systemPrompt += `\nThe user has provided their own draft/answer. You MUST evaluate it based on the IELTS criteria provided, estimate a Band Score, provide detailed feedback on WHY it received that score, and then write a perfect Band 9 version of their answer.`;
                userPrompt = `${taskDescription}\nHere is the user's draft to evaluate and improve:\n"${inputText}"`;
            } else {
                systemPrompt += `\nThe user has provided a topic or prompt. You MUST write a perfect Band 9 response to this topic, and provide an explanation of why this response achieves a Band 9 based on the criteria.`;
                userPrompt = `${taskDescription}\nHere is the topic/prompt to write about:\n"${inputText || '(No text provided, please analyze the attached image)'}"`;
            }

            if (activeTab === 'graph' && imageFile) {
                systemPrompt += `\nThe user has attached an image of the graph/chart. You MUST analyze the image closely to accurately describe its key features, trends, and data points in your response.`;
            }

            const requestParts = [{ text: userPrompt }];
            if (activeTab === 'graph' && imageFile) {
                requestParts.push({
                    inlineData: {
                        mimeType: imageFile.type,
                        data: imageFile.base64Data
                    }
                });
            }

            const payload = {
                contents: [{ parts: requestParts }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: generateSchema,
                    temperature: 0.7
                }
            };

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to connect to the AI service. Please try again.");
            
            const data = await response.json();
            const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (textResult) {
                setResult(JSON.parse(textResult));
            } else {
                throw new Error("Invalid response format from AI.");
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleGetVocab = async () => {
        if (!result || !result.band9Version) return;
        
        setVocabLoading(true);
        setError('');

        try {
            const systemPrompt = "You are an expert English lexicographer. Given a text, identify 5-8 key, advanced words used in the text. For each, provide 3-4 advanced, C1/C2 level synonyms suitable for an academic IELTS context, and a brief explanation of nuance.";
            const userPrompt = `Extract vocabulary from this text:\n"${result.band9Version}"`;

            const payload = {
                contents: [{ parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: vocabSchema,
                    temperature: 0.4
                }
            };

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to fetch vocabulary.");
            
            const data = await response.json();
            const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (textResult) {
                setVocabData(JSON.parse(textResult));
            }
        } catch (err) {
            console.error(err);
            setError("Could not load vocabulary suggestions.");
        } finally {
            setVocabLoading(false);
        }
    };

    const TabButton = ({ id, icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto ${
                activeTab === id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <header className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-3">
                        <IconSparkles /> IELTS Master Tool
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Your ultimate AI-powered companion for achieving a Band 9. Get instant essays, speaking practice, and vocabulary upgrades.
                    </p>
                </header>

                {/* Navigation */}
                <nav className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    <TabButton id="essay" icon={<IconPenTool />} label="Essay Writer" />
                    <TabButton id="graph" icon={<IconBarChart />} label="Graph Explainer" />
                    <TabButton id="speaking" icon={<IconMessageCircle />} label="Conversation" />
                    <TabButton id="sentence" icon={<IconBookOpen />} label="Sentence Maker" />
                </nav>

                {/* Main Content Area */}
                <main className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    
                    {/* Controls Section */}
                    <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1 space-y-1">
                            <label className="text-sm font-semibold text-slate-700 block">I want to provide:</label>
                            <div className="relative">
                                <select 
                                    value={inputType}
                                    onChange={(e) => setInputType(e.target.value)}
                                    className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow font-medium"
                                >
                                    <option value="topic">A Topic / Prompt (Generate Band 9)</option>
                                    <option value="draft">My Own Answer (Evaluate & Improve)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <IconChevronDown />
                                </div>
                            </div>
                        </div>

                        {activeTab === 'speaking' && (
                            <div className="flex-1 space-y-1 w-full">
                                <label className="text-sm font-semibold text-slate-700 block">Speaking Part:</label>
                                <div className="relative">
                                    <select 
                                        value={speakingPart}
                                        onChange={(e) => setSpeakingPart(e.target.value)}
                                        className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow font-medium"
                                    >
                                        <option value="part1">Part 1 (Introduction & Interview)</option>
                                        <option value="part2">Part 2 (Long Turn)</option>
                                        <option value="part3">Part 3 (Discussion)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                        <IconChevronDown />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Section */}
                    <div className="p-6 space-y-4">
                        {                        activeTab === 'graph' && (
                            <div className="mb-4">
                                <label className="text-sm font-semibold text-slate-700 block mb-2">
                                    Upload Graph/Chart Image (Optional):
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                                        <IconUpload /> Choose Image
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                    {imageFile && (
                                        <div className="relative">
                                            <img src={imageFile.previewUrl} alt="Graph Preview" className="h-14 w-auto rounded-md border border-slate-300 object-cover" />
                                            <button onClick={() => setImageFile(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-sm">×</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2">
                                {inputType === 'topic' ? (activeTab === 'graph' ? 'Enter the Prompt / Topic (Optional if image uploaded):' : 'Enter the Prompt / Topic:') : 'Enter your Draft / Answer:'}
                            </label>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={
                                    activeTab === 'essay' ? "e.g., Some people think that in the modern world we are more dependent on each other, while others think that people have become more independent..." :
                                    activeTab === 'graph' ? "e.g., The bar chart shows the percentage of people who used the internet in three countries between 2000 and 2010... (Or just upload an image above)" :
                                    activeTab === 'speaking' ? "e.g., Describe a book that had a major influence on you..." :
                                    "e.g., The weather is very nice today so we should go outside."
                                }
                                className="w-full h-40 p-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-slate-800 placeholder-slate-400 transition-shadow"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-sm transition-all ${
                                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-95'
                                }`}
                            >
                                {loading ? <><IconLoader /> Processing...</> : <><IconSparkles /> Process Input</>}
                            </button>
                        </div>
                    </div>
                </main>

                {/* Results Section */}
                {                result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Score Card (Only if evaluating a draft) */}
                        {inputType === 'draft' && result.estimatedBandScore && (
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex-shrink-0 text-center bg-white rounded-full h-24 w-24 flex items-center justify-center border-4 border-indigo-200 shadow-sm text-indigo-700">
                                    <span className="text-3xl font-black">{result.estimatedBandScore}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-900 mb-2">Estimated Band Score</h3>
                                    <p className="text-indigo-800 text-sm leading-relaxed">{result.feedback}</p>
                                </div>
                            </div>
                        )}

                        {/* Explanation/Feedback (If topic generated) */}
                        {inputType === 'topic' && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <IconBookOpen /> Examiner Notes
                                </h3>
                                <p className="text-amber-800 text-sm leading-relaxed whitespace-pre-wrap">{result.feedback}</p>
                            </div>
                        )}

                        {/* Band 9 Output */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                    <IconSparkles /> Band 9 Masterpiece
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-lg">
                                    {result.band9Version}
                                </p>
                            </div>
                        </div>

                        {/* Variations (For Sentence Maker) */}
                        {activeTab === 'sentence' && result.variations && result.variations.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200 p-4">
                                    <h3 className="text-lg font-bold text-slate-800">Alternative Band 9 Variations</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3">
                                        {result.variations.map((variant, idx) => (
                                            <li key={idx} className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-slate-700 leading-relaxed">{variant}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Vocabulary Add-on Section */}
                        {}
                        <div className="flex flex-col items-center pt-4">
                            {!vocabData && !vocabLoading && (
                                <button
                                    onClick={handleGetVocab}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    <IconBookOpen /> Extract Advanced Vocabulary
                                </button>
                            )}

                            {vocabLoading && (
                                <div className="flex items-center gap-3 text-slate-600 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200">
                                    <IconLoader /> Scanning for C1/C2 vocabulary...
                                </div>
                            )}

                            {vocabData && (
                                <div className="w-full mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4">
                                    <div className="bg-indigo-50 border-b border-indigo-100 p-4">
                                        <h3 className="text-lg font-bold text-indigo-900">Vocabulary Power-Ups</h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vocabData.map((item, idx) => (
                                            <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                                <div className="font-bold text-lg text-slate-800 mb-1">{item.keyword}</div>
                                                <div className="text-sm text-slate-600 mb-3">{item.explanation}</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.synonyms?.map((syn, sIdx) => (
                                                        <span key={sIdx} className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-md shadow-sm">
                                                            {syn}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}