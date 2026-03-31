import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart 
} from 'recharts';
import { 
  LayoutDashboard, Briefcase, Users, Bot, Settings, MessageSquare, HelpCircle,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, LogOut
} from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || 'Guest';
  const [activeSidebar, setActiveSidebar] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState('Jobs');

  // Real data state will replace these empty arrays when backend is connected
  const screeningData = [];
  const scheduledData = [];
  const engagementData = [];
  const pieData = [];
  
  const pieColors = ['#A855F7', '#D946EF', '#8B5CF6', '#6366F1'];

  const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </div>
  );

  const TopTab = ({ label, active }) => (
    <button 
      onClick={() => setActiveTab(label)}
      className={`px-8 py-4 rounded-2xl font-medium text-lg transition-all ${
        active 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
          : 'bg-[#1A162D] text-slate-300 hover:bg-[#221C3A]'
      }`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    if (activeSidebar !== 'Dashboard') {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-[#1A162D] rounded-3xl border border-white/5 opacity-90">
             <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-500 mb-4">{activeSidebar}</h2>
             <p className="text-slate-400 text-lg">Detailed analytical views for {activeSidebar} are coming soon.</p>
        </div>
      );
    }

    if (activeTab !== 'Jobs') {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-[#1A162D] rounded-3xl border border-white/5 opacity-90 backdrop-blur-sm">
             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400 mb-4">{activeTab} View</h2>
             <p className="text-slate-400">Content specific to {activeTab} is currently under construction.</p>
        </div>
      );
    }

    // Main Dashboard view (Jobs tab) showing empty states
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Row Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Screening Card */}
              <div className="bg-[#1A162D] rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full"></div>
                <h3 className="text-xl font-medium mb-6">Screening</h3>
                <div className="flex-1 flex items-center justify-center text-slate-500 font-medium h-48">
                  {screeningData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={screeningData}>
                        <Bar dataKey="value" fill="#4C1D95" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="line" stroke="#D946EF" strokeWidth={3} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <span>No screening data available</span>
                  )}
                </div>
              </div>

              {/* Scheduled Card */}
              <div className="bg-[#1A162D] rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] rounded-full"></div>
                <h3 className="text-xl font-medium mb-6">Scheduled</h3>
                <div className="flex-1 flex items-center justify-center text-slate-500 font-medium h-48">
                  {scheduledData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={scheduledData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D946EF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#D946EF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#D946EF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <span>No schedules logged yet</span>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Row Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Analytics Card */}
              <div className="bg-[#1A162D] rounded-3xl p-6 border border-white/5 text-sm">
                <h3 className="text-xl font-medium mb-6">Analytics</h3>
                
                <div className="grid grid-cols-4 gap-2 mb-6 text-xs font-semibold">
                  <div className="bg-white/5 text-slate-400 py-2 px-3 rounded-lg flex items-center justify-center">0%</div>
                  <div className="bg-white/5 text-slate-400 py-2 px-3 rounded-lg flex items-center justify-center">0%</div>
                  <div className="bg-white/5 text-slate-400 py-2 px-3 rounded-lg flex items-center justify-center">0%</div>
                  <div className="bg-white/5 text-slate-400 py-2 px-3 rounded-lg flex items-center justify-center">0%</div>
                </div>

                <div className="space-y-4 text-slate-400">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-indigo-400 opacity-50"/> Last Week</div>
                    <span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-purple-400 opacity-50"/> Small Team</div>
                    <span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-pink-400 opacity-50"/> Onboarding</div>
                    <span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>
                  </div>
                </div>
              </div>

              {/* AI Agents Card */}
              <div className="bg-[#1A162D] rounded-3xl p-6 border border-white/5">
                <h3 className="text-xl font-medium mb-4">Ai Agents</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1 bg-white/5 rounded-xl p-3 flex justify-between items-center opacity-50">
                    <span className="text-indigo-400 text-sm flex items-center"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div> Waiting</span>
                    <span className="font-bold">0/0</span>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-3 flex justify-between items-center opacity-50">
                    <span className="text-pink-400 text-sm flex items-center"><div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div> Processing</span>
                    <span className="font-bold">0/0</span>
                  </div>
                </div>
                <div className="h-24 w-full flex items-center justify-center text-slate-500 font-medium">
                  {scheduledData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scheduledData.slice(0, 6)}>
                        <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <span>No agent activity</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Takes 1/3 width on LG) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Placements Donut Chart */}
            <div className="bg-[#1A162D] rounded-3xl p-6 border border-white/5 flex flex-col xl:-mt-[88px] h-full lg:h-[calc(100%-250px)] min-h-[400px]">
              <h3 className="text-2xl font-medium mb-2 text-center">Placements</h3>
              
              <div className="flex-1 relative flex items-center justify-center">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 bg-fuchsia-500/10 blur-[60px] rounded-full"></div>
                 </div>
                 
                 {pieData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                 ) : (
                    <div className="w-48 h-48 rounded-full border-[20px] border-white/5 flex items-center justify-center">
                    </div>
                 )}
                
                {/* Center Value */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                    0
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 opacity-50">
                <div className="bg-white/5 text-slate-300 px-4 py-1.5 rounded-full text-xs font-semibold">
                  Valid Today 0/0
                </div>
                <div className="bg-white/5 text-slate-300 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-slate-500"/> Out: 0 (ROI)
                </div>
              </div>
            </div>

            {/* Engagement Card */}
            <div className="bg-[#1A162D] rounded-3xl p-6 border border-white/5 h-[300px] flex flex-col">
              <h3 className="text-xl font-medium mb-6">Engagement</h3>
              <div className="flex-1 w-full pb-8 flex items-center justify-center text-slate-500 font-medium">
                {engagementData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={engagementData}>
                      <Bar dataKey="bar" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="line" stroke="#D946EF" strokeWidth={3} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <span>No engagement metrics available</span>
                )}
              </div>
            </div>

          </div>

        </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0C0A15] text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#0F0C1B] border-r border-white/5 flex flex-col justify-between py-6 px-4 shrink-0">
        <div>
          <div className="flex items-center justify-center mb-10">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500">
              AI Mock
            </div>
          </div>
          
          <div className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeSidebar === 'Dashboard'} onClick={() => setActiveSidebar('Dashboard')} />
            <SidebarItem icon={Briefcase} label="Jobs" active={activeSidebar === 'Jobs'} onClick={() => setActiveSidebar('Jobs')} />
            <SidebarItem icon={Users} label="Candidates" active={activeSidebar === 'Candidates'} onClick={() => setActiveSidebar('Candidates')} />
            <SidebarItem icon={Bot} label="AI Recruiter" active={activeSidebar === 'AI Recruiter'} onClick={() => setActiveSidebar('AI Recruiter')} />
            <SidebarItem icon={Settings} label="Settings" active={activeSidebar === 'Settings'} onClick={() => setActiveSidebar('Settings')} />
          </div>
        </div>

        <div className="space-y-2">
          <SidebarItem icon={MessageSquare} label="Chat" active={activeSidebar === 'Chat'} onClick={() => setActiveSidebar('Chat')} />
          <SidebarItem icon={HelpCircle} label="Support" active={activeSidebar === 'Support'} onClick={() => setActiveSidebar('Support')} />
          
          <div className="pt-4 mt-4 border-t border-white/5">
            <SidebarItem icon={LogOut} label="Log Out" onClick={() => navigate('/login')} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* User Greeting */}
        <div className="flex justify-between items-center mb-8 bg-[#1A162D] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
           <div className="absolute right-0 top-0 w-64 h-full bg-indigo-500/10 blur-[50px] pointer-events-none"></div>
           <div className="z-10">
             <h1 className="text-2xl font-bold text-white">Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.3)]">{userName}</span>!</h1>
             <p className="text-sm text-slate-400 mt-1">Here is what's happening with your interviews today.</p>
           </div>
           <div className="z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-white/10">
               {userName.charAt(0).toUpperCase()}
           </div>
        </div>

        {/* Top Header Row (Only show if on Dashboard Sidebar to maintain nested routing feel) */}
        {activeSidebar === 'Dashboard' && (
          <div className="flex flex-col xl:flex-row gap-6 mb-6">
            <div className="flex-1 flex gap-4">
              <TopTab label="Jobs" active={activeTab === 'Jobs'} />
              <TopTab label="Candidates" active={activeTab === 'Candidates'} />
              <TopTab label="AI Recruiter" active={activeTab === 'AI Recruiter'} />
              <TopTab label="Settings" active={activeTab === 'Settings'} />
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        {renderContent()}

      </div>
    </div>
  );
};

export default Dashboard;
