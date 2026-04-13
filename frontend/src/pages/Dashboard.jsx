import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, ComposedChart, 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  LayoutDashboard, Briefcase, Users, Bot, Settings, MessageSquare, HelpCircle,
  LogOut, Clock, CheckCircle2, Zap, Activity, ChevronRight, BrainCircuit, Mic, Sparkles, Play, StopCircle, UserCheck, X, FileText, Loader2, Upload
} from 'lucide-react';
import api, { uploadResumeFile } from '../services/api';

const WebcamPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    let mediaStream = null;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        mediaStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera access denied or unavailable.", err);
      });

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <video 
      ref={videoRef}
      className="w-full h-full object-cover opacity-80 transform -scale-x-100" // Mirror local video
      autoPlay 
      playsInline
      muted // Mute local preview to prevent audio feedback loop
    />
  );
};

const InteractiveSessionModal = ({ session, onClose, customQuestions }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const roleQuestions = {
    'Frontend Eng.': [
      `Welcome to your Frontend Engineering interview, ${session?.candidate}. Let's start with a brief introduction.`,
      "Can you explain the differences between Client-Side Rendering and Server-Side Rendering?",
      "How do you approach managing state in a complex React application? Do you prefer Redux, Context API, or Zustand?",
      "Describe your process for building a fully responsive and accessible web component.",
      "Thank you. Your frontend responses have been successfully recorded."
    ],
    'UX Designer': [
      `Welcome to your UX Design interview, ${session?.candidate}. Please tell us about yourself.`,
      "Walk us through your typical design process from ideation to high-fidelity wireframes.",
      "How do you incorporate user feedback and analytics into your design iterations?",
      "Can you describe a time you had to compromise on a design due to technical constraints?",
      "Thank you. Your design responses have been successfully recorded."
    ],
    'Backend Eng.': [
      `Welcome to your Backend Engineering interview, ${session?.candidate}. Please introduce yourself.`,
      "How do you design a scalable RESTful API? What are the key principles you follow?",
      "Explain your approach to database optimization and handling complex queries under high load.",
      "Describe a situation where you had to debug a severe memory leak or performance bottleneck.",
      "Thank you. Your backend responses have been successfully recorded."
    ]
  };

  const defaultQuestions = [
    `Welcome, ${session?.candidate}. Let's begin the interview. Could you start by introducing yourself?`,
    "What is the most challenging problem you've faced recently, and how did you resolve it?",
    "Can you walk us through your typical workflow for a major project?",
    "Where do you see yourself in the next 5 years in terms of your career?",
    "Thank you. This concludes our mock session. Your responses have been successfully recorded."
  ];

  const questions = customQuestions 
    ? [
        `Welcome, ${session?.candidate}. I have reviewed your resume and prepared some questions tailored to your experience. Let's begin.`,
        ...customQuestions,
        "Thank you. This concludes our personalized mock session. Your responses have been successfully recorded."
      ] 
    : (session?.role ? (roleQuestions[session.role] || defaultQuestions) : defaultQuestions);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (questionIndex >= questions.length || !session) return;

    let answerTimer;
    const initialDelay = setTimeout(() => {
      setIsSpeaking(true);
      setIsListening(false);
      const utterance = new SpeechSynthesisUtterance(questions[questionIndex]);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsListening(true);
        if (questionIndex < questions.length - 1) {
          answerTimer = setTimeout(() => {
            setQuestionIndex(prev => prev + 1);
          }, 8000); // 8 second wait time for candidate response simulation
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }, 1500);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(answerTimer);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [questionIndex, session]);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#18181b] to-[#09090b] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 items-center bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Live REC</span>
            </div>
            <span className="font-semibold text-white tracking-wide">
              {session.candidate} - AI Interview
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 hover:text-white text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-[#050505] flex items-center justify-center overflow-hidden">
           {/* Live Webcam Stream */}
           <WebcamPlayer />
           
           {/* AI Overlay Mockup */}
           <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 {/* Face Tracking Graphic Mock */}
                 <div className="border border-cyan-500/40 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded text-[10px] font-mono text-cyan-400 tracking-widest flex items-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                   <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                   [FACE_TRACKING] ACTIVE
                 </div>
                 
                 <div className="flex flex-col items-end gap-2">
                   <div className={`border ${isSpeaking ? 'border-violet-500/40 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'border-slate-500/40 text-slate-400'} bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded text-[10px] font-mono tracking-widest flex items-center gap-2 transition-colors`}>
                     AI MIC: {isSpeaking ? 'ACTIVE' : 'IDLE'}
                   </div>
                   <div className={`border ${isListening ? 'border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-slate-500/40 text-slate-400'} bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded text-[10px] font-mono tracking-widest flex items-center gap-2 transition-colors`}>
                     USER MIC: {isListening ? 'LISTENING' : 'MUTED'}
                   </div>
                 </div>
              </div>
              
              {/* Live Captioning */}
              <div className="w-full max-w-xl self-center mb-6 transition-all duration-500">
                 <div className={`w-full bg-black/60 backdrop-blur-md p-4 rounded-xl border ${isSpeaking ? 'border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]' : 'border-white/10 shadow-2xl'} flex items-start gap-4 transition-all duration-500`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isSpeaking ? 'bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white animate-pulse' : 'bg-white/10 text-slate-400'}`}>
                      AI
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium leading-relaxed italic ${isSpeaking ? 'text-white' : 'text-slate-400'}`}>
                        "{questions[questionIndex]}"
                      </p>
                      {isListening && (
                        <p className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-2 animate-pulse">
                          <span>[Listening to candidate response...]</span>
                        </p>
                      )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || 'Guest';
  const [activeSidebar, setActiveSidebar] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState('Jobs');
  const [mounted, setMounted] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('upload');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [myInterviewSession, setMyInterviewSession] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSessions = [
    { id: '1', candidate: 'Alex Chen', role: 'Frontend Eng.', duration: '14:20', status: 'Live', score: 85 },
    { id: '2', candidate: 'Sarah Miller', role: 'UX Designer', duration: '08:45', status: 'Live', score: 92 },
    { id: '3', candidate: 'James Wilson', role: 'Backend Eng.', duration: '22:10', status: 'Wrapping Up', score: 78 },
  ];

  // Synthetic Data for demonstration
  const screeningData = [
    { name: 'Mon', value: 40, line: 30 },
    { name: 'Tue', value: 60, line: 55 },
    { name: 'Wed', value: 45, line: 50 },
    { name: 'Thu', value: 80, line: 65 },
    { name: 'Fri', value: 65, line: 70 },
    { name: 'Sat', value: 90, line: 85 },
  ];
  const scheduledData = [
    { name: 'W1', value: 20 },
    { name: 'W2', value: 40 },
    { name: 'W3', value: 35 },
    { name: 'W4', value: 80 },
    { name: 'W5', value: 60 },
    { name: 'W6', value: 95 },
  ];
  const engagementData = [
    { name: 'A', bar: 30, line: 40 },
    { name: 'B', bar: 50, line: 60 },
    { name: 'C', bar: 40, line: 45 },
    { name: 'D', bar: 70, line: 80 },
  ];
  const pieData = [
    { name: 'Tech', value: 40 },
    { name: 'Sales', value: 30 },
    { name: 'HR', value: 20 },
    { name: 'Legal', value: 10 }
  ];
  
  const pieColors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="text-white/80 font-medium mb-1">{label || 'Metric'}</p>
          {payload.map((p, i) => (
             <p key={i} className="font-bold flex items-center gap-2" style={{ color: p.color || p.stroke || p.fill }}>
               <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke || p.fill }}></span>
               {p.value}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const SidebarIcon = ({ icon: Icon, label, active, onClick }) => (
    <div className="relative group flex items-center justify-center w-12 h-12 mb-4">
      <button 
        onClick={onClick}
        className={`relative z-10 p-3 rounded-2xl transition-all duration-300 flex items-center justify-center 
          ${active ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-500/30' : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'}
        `}
      >
        <Icon className="w-6 h-6" />
      </button>
      {/* Tooltip */}
      <div className="absolute left-16 px-3 py-1.5 bg-[#18181b] border border-white/10 text-white text-sm rounded-lg opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl z-50 whitespace-nowrap">
        {label}
      </div>
    </div>
  );

  const TopTab = ({ label, active }) => (
    <button 
      onClick={() => setActiveTab(label)}
      className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 relative overflow-hidden ${
        active 
          ? 'text-white' 
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-full border border-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.05)]"></div>
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Ambient Background Grid & Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none z-0"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Glass Sidebar */}
      <div className="w-24 z-20 flex flex-col justify-between py-8 items-center bg-[#09090b]/40 backdrop-blur-2xl border-r border-white/5 shrink-0 relative">
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        
        <div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center font-bold text-xl mb-10 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-float">
            AI
          </div>
          
          <div className="flex flex-col items-center">
            <SidebarIcon icon={LayoutDashboard} label="Dashboard" active={activeSidebar === 'Dashboard'} onClick={() => setActiveSidebar('Dashboard')} />
            <SidebarIcon icon={Briefcase} label="Jobs" active={activeSidebar === 'Jobs'} onClick={() => setActiveSidebar('Jobs')} />
            <SidebarIcon icon={Users} label="Candidates" active={activeSidebar === 'Candidates'} onClick={() => setActiveSidebar('Candidates')} />
            <SidebarIcon icon={Bot} label="AI Recruiter" active={activeSidebar === 'AI Recruiter'} onClick={() => setActiveSidebar('AI Recruiter')} />
            <SidebarIcon icon={Settings} label="Settings" active={activeSidebar === 'Settings'} onClick={() => setActiveSidebar('Settings')} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <SidebarIcon icon={MessageSquare} label="Chat" active={activeSidebar === 'Chat'} onClick={() => setActiveSidebar('Chat')} />
          <SidebarIcon icon={HelpCircle} label="Support" active={activeSidebar === 'Support'} onClick={() => setActiveSidebar('Support')} />
          <div className="w-8 h-[1px] bg-white/10 my-4"></div>
          <SidebarIcon icon={LogOut} label="Log Out" onClick={() => navigate('/login')} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-6 lg:p-10">
        
        <div className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Top Navbar Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
             <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/5 shadow-xl">
               <TopTab label="Jobs" active={activeTab === 'Jobs'} />
               <TopTab label="Candidates" active={activeTab === 'Candidates'} />
               <TopTab label="My Interview" active={activeTab === 'My Interview'} />
               <TopTab label="AI Recruiter" active={activeTab === 'AI Recruiter'} />
               <TopTab label="Settings" active={activeTab === 'Settings'} />
             </div>
             
             {/* User Profile Mini */}
             <div className="flex items-center gap-4 glass-panel px-4 py-2 rounded-full cursor-pointer">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-cyan-400">Pro Account</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {userName.charAt(0).toUpperCase()}
                </div>
             </div>
          </div>

          {/* Hero Greeting Panel */}
          <div className="glass-panel p-8 mb-8 relative overflow-hidden group">
             {/* Inner Glow Hover Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-violet-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"></div>
             
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
               <div>
                 <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                   Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 animate-pulse">{userName}</span>
                 </h1>
                 <p className="text-slate-400 text-lg">Your AI recruitment command center is running smoothly.</p>
               </div>
               
               <div className="flex gap-4">
                 <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap className="w-6 h-6 animate-pulse-glow rounded-full" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">42</p>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Active Agents</p>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Bento Box Grid Layout */}
          {activeSidebar === 'Dashboard' && activeTab === 'My Interview' ? (
            <div className="glass-panel p-8 w-full max-w-4xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6 relative group">
                <div className="absolute inset-0 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <FileText className="w-8 h-8 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Customize Your Interview</h2>
              <p className="text-slate-400 text-center mb-8 max-w-2xl text-sm leading-relaxed">
                Provide your resume below. Our expert AI model will parse your experience and generate a customized mock interview tailored specifically to your background and skills.
              </p>

              <div className="flex gap-4 mb-6 relative z-10">
                <button 
                  onClick={() => setInputMethod('upload')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${inputMethod === 'upload' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}
                >
                  Upload Document
                </button>
                <button 
                  onClick={() => setInputMethod('paste')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${inputMethod === 'paste' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}
                >
                  Paste Text
                </button>
              </div>

              {inputMethod === 'paste' ? (
                <textarea
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-5 text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none placeholder-slate-600 font-mono text-sm shadow-inner"
                  placeholder="Paste your resume text here...&#10;&#10;E.g., Senior Full Stack Developer with 5+ years experience building scalable applications using React, Node.js, and MongoDB. Led teams of 4 to deliver modular microservices architecture..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                ></textarea>
              ) : (
                <div className="w-full h-48 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 transition-all group relative">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-white font-medium mb-1">{resumeFile ? resumeFile.name : 'Click or drag file to upload'}</p>
                  <p className="text-xs text-slate-500">Supports PDF, DOCX, TXT</p>
                </div>
              )}

              <button
                onClick={async () => {
                  if (inputMethod === 'paste' && !resumeText.trim()) return;
                  if (inputMethod === 'upload' && !resumeFile) return;
                  
                  setIsGeneratingQuestions(true);
                  try {
                    let generated = [];
                    if (inputMethod === 'paste') {
                      const res = await api.post('/ai/generate-resume-questions', { resumeText });
                      generated = res.data.questions;
                    } else {
                      const res = await uploadResumeFile(resumeFile);
                      generated = res.questions;
                    }
                    
                    setCustomQuestions(generated);
                    setMyInterviewSession({ id: 'my-interview', candidate: userName, role: 'Your Resume Profile' });
                    setPlayingVideoId('my-interview');
                  } catch (err) {
                    console.error("Failed to generate", err);
                    alert("Failed to generate interview questions. The API request was rejected (Please check your Gemini API key in the backend .env).");
                  } finally {
                    setIsGeneratingQuestions(false);
                  }
                }}
                disabled={isGeneratingQuestions || (inputMethod === 'paste' ? !resumeText.trim() : !resumeFile)}
                className="mt-8 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {isGeneratingQuestions ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                {isGeneratingQuestions ? 'AI is Analyzing Resume...' : 'Start Personalized Interview'}
              </button>
            </div>
          ) : activeSidebar === 'Dashboard' && activeTab === 'Jobs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[240px]">
              
              {/* Screening & Growth - Large Box */}
              <div className="glass-panel xl:col-span-2 row-span-2 p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[60px] rounded-full group-hover:bg-violet-500/20 transition-colors duration-700"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><Activity className="w-5 h-5 text-violet-400"/> Screening Flow</h3>
                  <button className="text-xs text-slate-400 hover:text-white flex items-center transition-colors">View Details <ChevronRight className="w-4 h-4 ml-1"/></button>
                </div>
                <div className="flex-1 w-full min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={screeningData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="value" fill="url(#barGlow)" radius={[6, 6, 0, 0]} barSize={30} />
                      <Line type="basis" dataKey="line" stroke="#06b6d4" strokeWidth={4} dot={false} style={{ filter: 'drop-shadow(0px 4px 6px rgba(6,182,212,0.5))' }}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Placements Donut - Tall Box */}
              <div className="glass-panel row-span-2 p-6 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute -inset-4 bg-gradient-to-b from-cyan-500/5 to-transparent blur-xl pointer-events-none group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-xl font-semibold w-full text-left mb-8 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-400"/> Placements Focus</h3>
                
                <div className="flex-1 w-full relative flex items-center justify-center min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="90%"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={8}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} style={{ filter: `drop-shadow(0px 0px 8px ${pieColors[index % pieColors.length]}80)` }} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-5xl font-bold text-white tracking-tighter">100<span className="text-lg text-slate-400">%</span></span>
                     <span className="text-xs text-cyan-400 font-medium tracking-wide mt-1">TOTAL FILL</span>
                  </div>
                </div>

                <div className="w-full mt-6 space-y-3">
                   {pieData.slice(0, 2).map((item, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: pieColors[i], boxShadow: `0 0 10px ${pieColors[i]}` }}></div>
                         <span className="text-slate-300">{item.name}</span>
                       </div>
                       <span className="font-semibold">{item.value}%</span>
                     </div>
                   ))}
                </div>
              </div>

              {/* Scheduled Activity - Wide Box */}
              <div className="glass-panel xl:col-span-2 p-6 flex flex-col relative group">
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-400"/> Scheduled Activity</h3>
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">Live</div>
                </div>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scheduledData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#areaGlow)" dot={false} style={{ filter: 'drop-shadow(0px 4px 10px rgba(16,185,129,0.3))' }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mini Stats Box */}
              <div className="glass-panel p-6 flex flex-col justify-between group">
                <div>
                   <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Bot className="w-5 h-5 text-pink-400"/> AI Efficiency</h3>
                   <div className="space-y-4">
                     <div>
                       <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Processing Time</span><span className="text-white font-medium">-24%</span></div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-pink-500 w-3/4 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Match Accuracy</span><span className="text-white font-medium">94%</span></div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[94%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div></div>
                     </div>
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs uppercase tracking-wider">System Status</span>
                  <span className="flex items-center text-emerald-400 font-medium gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Optimal</span>
                </div>
              </div>

            </div>
          ) : activeSidebar === 'AI Recruiter' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
              {/* Active Sessions List */}
              <div className="glass-panel lg:col-span-2 row-span-2 p-6 flex flex-col relative group">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><Mic className="w-5 h-5 text-cyan-400"/> Live Interview Sessions</h3>
                  <div className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div> 3 Connected</div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  {activeSessions.map((session, idx) => (
                    <div key={session.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group/session">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-white uppercase shadow-lg shadow-violet-500/20">
                          {session.candidate.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover/session:text-cyan-300 transition-colors">{session.candidate}</p>
                          <p className="text-xs text-slate-400">{session.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium text-white flex items-center gap-1.5 justify-end"><Clock className="w-3.5 h-3.5 text-slate-400"/> {session.duration}</p>
                          <p className={`text-xs mt-0.5 ${session.status === 'Live' ? 'text-emerald-400' : 'text-amber-400'}`}>{session.status}</p>
                        </div>
                        <div className="relative w-12 h-12 flex items-center justify-center group-hover/session:scale-105 transition-transform">
                          <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" viewBox="0 0 44 44">
                            <circle cx="22" cy="22" r="20" className="stroke-white/10" strokeWidth="3" fill="none" />
                            <circle 
                              cx="22" cy="22" r="20" 
                              className="stroke-cyan-400 transition-all duration-1000 ease-out" 
                              strokeWidth="3" fill="none" 
                              strokeDasharray="125.6" 
                              strokeDashoffset={125.6 - (session.score / 100) * 125.6} 
                              strokeLinecap="round" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-bold text-sm text-cyan-400">{session.score}</span>
                          </div>
                          <div className="absolute inset-0 rounded-full border border-cyan-500/30 -m-1 group-hover/session:animate-ping opacity-0 group-hover/session:opacity-100 pointer-events-none"></div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPlayingVideoId(session.id); }}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"
                        >
                          <Play className="w-4 h-4 ml-0.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Agent Personas */}
              <div className="glass-panel row-span-2 p-6 flex flex-col relative group">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-400"/> AI Personas</h3>
                </div>
                <div className="flex-1 space-y-4">
                  {[
                    {name: 'Tech Lead AI', type: 'Technical', load: '85%', color: 'violet'},
                    {name: 'Culture Fit AI', type: 'Behavioral', load: '40%', color: 'cyan'},
                    {name: 'Executive AI', type: 'Strategic', load: '10%', color: 'emerald'},
                  ].map((persona, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{persona.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${persona.color === 'violet' ? 'text-violet-400 bg-violet-400/10' : persona.color === 'cyan' ? 'text-cyan-400 bg-cyan-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>{persona.type}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${persona.color === 'violet' ? 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : persona.color === 'cyan' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} style={{width: persona.load}}></div>
                      </div>
                      <span className="text-[10px] text-slate-500 text-right font-medium">System Load: {persona.load}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Insights / Logs */}
              <div className="glass-panel lg:col-span-3 p-6 flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-semibold flex items-center gap-2"><UserCheck className="w-5 h-5 text-emerald-400"/> Live AI Insights</h3>
                   <button className="text-xs font-semibold text-slate-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">View Full Logs</button>
                 </div>
                 <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                   {[
                     { candidate: 'Alex Chen', insight: "Strong foundational knowledge of React Hooks. Struggled slightly with advanced Context API patterns.", sentiment: "Positive", time: "2 min ago" },
                     { candidate: 'Sarah Miller', insight: "Excellent communication skills. Portfolio matches real-world problem-solving abilities.", sentiment: "Outstanding", time: "5 min ago" },
                     { candidate: 'James Wilson', insight: "Good backend concepts, but needs prompting for system design border cases.", sentiment: "Average", time: "12 min ago" },
                     { candidate: 'Emily Davis', insight: "Exceptional algorithm execution. Wrote heavily optimized Python solutions immediately.", sentiment: "Outstanding", time: "18 min ago" },
                   ].map((log, i) => (
                     <div key={i} className="min-w-[320px] max-w-[320px] flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group/log">
                       <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            <span className="text-sm font-bold text-white group-hover/log:text-emerald-300 transition-colors">{log.candidate}</span>
                         </div>
                         <span className="text-xs font-medium text-slate-500">{log.time}</span>
                       </div>
                       <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-2">{log.insight}</p>
                       <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${log.sentiment === 'Outstanding' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : log.sentiment === 'Positive' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                         {log.sentiment} Match
                       </span>
                     </div>
                   ))}
                 </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] glass-panel border border-white/5 rounded-[40px]">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                <BrainCircuit className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 mb-3">{activeSidebar} {activeSidebar === 'Dashboard' ? activeTab : ''}</h2>
              <p className="text-slate-500 text-center max-w-md">This powerful bento module is currently being configured by your AI integration team.</p>
            </div>
          )}

        </div>
      </div>

      {/* Video Modal Overlay */}
      {playingVideoId && (
        <InteractiveSessionModal 
          session={playingVideoId === 'my-interview' ? myInterviewSession : activeSessions.find(s => s.id === playingVideoId)}
          customQuestions={playingVideoId === 'my-interview' ? customQuestions : null}
          onClose={() => {
            setPlayingVideoId(null);
            setCustomQuestions(null);
            setMyInterviewSession(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
