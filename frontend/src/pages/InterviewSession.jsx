import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const InterviewSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([{ sender: 'system', content: "Welcome! Please enter the Role and Experience Level to start." }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({ role: '', experience: '', topic: '' });
    const [started, setStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleStart = async () => {
        if (!config.role || !config.experience) {
            setMessages(prev => [...prev, { sender: 'system', content: 'Please fill in Role and Experience.' }]);
            return;
        }

        setLoading(true);
        setMessages(prev => [...prev, { sender: 'user', content: `Start interview for ${config.role} (${config.experience} years)` }]);

        try {
            const res = await api.post('/ai/generate-questions', {
                role: config.role,
                experienceLevel: config.experience,
                topic: config.topic
            });

            if (res.data.questions && res.data.questions.length > 0) {
                setQuestions(res.data.questions);
                setStarted(true);
                setCurrentQuestionIndex(0);
                setMessages(prev => [...prev, { sender: 'ai', content: `Great! Let's begin. Question 1: ${res.data.questions[0]}` }]);
            } else {
                setMessages(prev => [...prev, { sender: 'system', content: 'Failed to generate questions. Please try again.' }]);
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender: 'system', content: 'Error connecting to AI service.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const answer = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', content: answer }]);

        if (!started) {
            // Config phase handling if needed, or just ignore
            return;
        }

        setLoading(true);

        try {
            // Evaluate answer
            const currentQ = questions[currentQuestionIndex];
            const res = await api.post('/ai/evaluate-answer', {
                question: currentQ,
                answer: answer,
                role: config.role
            });

            const feedback = res.data;
            const feedbackMsg = `Feedback (Score: ${feedback.score}/10): ${feedback.feedback}`;
            setMessages(prev => [...prev, { sender: 'ai', content: feedbackMsg }]);

            // Next question
            if (currentQuestionIndex < questions.length - 1) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: 'ai', content: `Question ${nextIndex + 1}: ${questions[nextIndex]}` }]);
                }, 1000);
            } else {
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: 'system', content: 'Interview Complete! Check your dashboard for the report.' }]);
                }, 1000);
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender: 'system', content: 'Error evaluating answer.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl h-screen flex flex-col">
            <header className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mock Interview Session</h1>
                {!started && (
                    <div className="flex gap-2">
                        <input placeholder="Role (e.g. Frontend Dev)" className="border p-2 rounded" value={config.role} onChange={e => setConfig({ ...config, role: e.target.value })} />
                        <input placeholder="Exp (years)" className="border p-2 rounded w-24" value={config.experience} onChange={e => setConfig({ ...config, experience: e.target.value })} />
                        <button onClick={handleStart} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            {loading ? 'Generating...' : 'Start'}
                        </button>
                    </div>
                )}
            </header>

            <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col overflow-hidden">
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' :
                                    msg.sender === 'ai' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                                        'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {loading && <div className="text-center text-gray-500 italic">AI is thinking...</div>}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={started ? "Type your answer..." : "Configure above to start..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={!started || loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!started || loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewSession;
