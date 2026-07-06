import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { DemoPanel } from '../components/DemoPanel';
import { WelcomeTour } from '../components/WelcomeTour';
import { useBusinessState } from '../contexts/BusinessContext';
import { PageTransition } from '../components/PageTransition';
import { 
  LayoutDashboard, 
  Globe, 
  Sliders, 
  BarChart3, 
  Sparkles, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  User, 
  LogOut, 
  Activity,
  Sun,
  Moon,
  MessageSquare,
  Send,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Badge } from '../components/Badge';
import { useThemeState } from '../contexts/ThemeContext';
import { translate } from '../utils/translations';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { 
    alerts, 
    backendOnline, 
    aiInsight, 
    presentationMode,
    messages,
    askAICEO,
    isLoading,
    clearHistory,
    language
  } = useBusinessState();
  const { theme, toggleTheme } = useThemeState();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalChatOpen, setGlobalChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'world', path: '/business-world', label: 'Business World', icon: Globe },
    { id: 'simulation', path: '/simulation', label: 'Simulation', icon: Sliders },
    { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ceo', path: '/ai-ceo', label: 'AI CEO', icon: Sparkles },
    { id: 'reports', path: '/reports', label: 'Reports', icon: FileText },
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings }
  ] as const;

  const activeLink = sidebarLinks.find(link => link.path === location.pathname);
  const currentTab = activeLink ? translate(activeLink.id, language) : 'System';

  return (
    <div className="min-h-screen bg-[#080B14] text-text-white flex overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <motion.aside 
        animate={{ width: presentationMode ? 0 : sidebarExpanded ? 200 : 60 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`glass-panel flex flex-col h-screen shrink-0 z-30 select-none overflow-hidden ${
          presentationMode ? '' : 'border-r border-border-glass'
        } bg-[#0D1220]`}
      >
        {/* Sidebar Header Logo */}
        <div className="p-4 border-b border-border-glass flex items-center justify-between overflow-hidden">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-purple-600 border border-purple-500 text-text-white shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            {sidebarExpanded && (
              <span className="font-extrabold tracking-tight text-sm text-text-white truncate">
                BusinessVerse
              </span>
            )}
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.id}
                to={link.path}
                className={`w-full flex items-center p-2.5 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                  isActive 
                    ? 'bg-[#7C3AED]/10 text-purple-400 border-l-2 border-[#7C3AED] rounded-l-none' 
                    : 'text-text-muted hover:text-text-white hover:bg-gray-900/30'
                }`}
              >
                <LinkIcon className={`w-4 h-4 shrink-0 ${sidebarExpanded ? 'mr-3.5' : 'mx-auto'}`} />
                {sidebarExpanded && <span>{translate(link.id, language)}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-border-glass flex justify-between items-center">
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-lg hover:bg-gray-800 text-text-muted hover:text-text-white cursor-pointer mx-auto focus:outline-none"
          >
            {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Navbar */}
        {!presentationMode && (
          <header className="h-16 border-b border-border-glass bg-gray-950/40 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-text-muted bg-gray-900 border border-border-glass px-2.5 py-1 rounded-md">
              {currentTab}
            </span>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-1.5">
              <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-success-green animate-pulse' : 'bg-cyan-500'}`} />
              <span className="text-[10px] font-semibold text-text-muted">
                {backendOnline ? 'Live Connected' : 'Simulator Online'}
              </span>
            </div>

            {/* Vercel-style Search Bar */}
            <div className="relative hidden lg:block pl-6">
              <input
                type="text"
                placeholder="Search resources, simulation logs..."
                className="w-56 bg-gray-900/50 border border-border-glass rounded-xl px-3 py-1.5 text-[9px] text-text-white placeholder-text-muted focus:outline-none focus:border-purple-500/40 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-gray-900 border border-border-glass hover:border-purple-500/40 text-text-muted hover:text-text-white transition-colors cursor-pointer relative focus:outline-none"
              >
                <Bell className="w-4 h-4" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-red text-text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-bg-dark animate-bounce">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel border border-border-glass shadow-2xl p-4 space-y-3 z-50 bg-gray-950"
                  >
                    <h4 className="text-xs font-bold text-text-white border-b border-border-glass pb-2">Threat Inbox</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {alerts.map((a, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-gray-900/50 text-[10px] border border-border-glass">
                          <span className={`font-bold ${a.priority === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                            {a.title}
                          </span>
                          <p className="text-text-muted mt-0.5 leading-relaxed">{a.message}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="w-full text-center text-[10px] text-purple-400 hover:text-purple-300 font-bold block pt-1 border-t border-border-glass"
                    >
                      Close Alert Drawer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center space-x-2.5 border-l border-border-glass pl-4">
              <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-text-white">Admin Sandbox</p>
                <p className="text-[9px] text-text-muted">Enterprise Owner</p>
              </div>
            </div>

            {/* Exit CTA */}
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-gray-900 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-colors cursor-pointer focus:outline-none"
              title="Return to Landing"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        )}

        {/* Subpage View Outlet */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#030712] space-y-6">
          {/* Dynamic AI Insight Ticker Banner */}
          <div className="bg-purple-950/15 border border-purple-500/25 p-3 rounded-2xl flex items-center space-x-3 text-[11px] text-text-white select-none shrink-0">
            <span className="p-1 rounded-lg bg-purple-600 border border-purple-500 text-text-white flex items-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <span className="font-semibold">{aiInsight}</span>
          </div>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Floating HUD controls overlays */}
      <DemoPanel />
      <WelcomeTour />

      {/* Floating Global Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat window panel */}
        <AnimatePresence>
          {globalChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-80 sm:w-96 h-[480px] bg-slate-900 border border-purple-900/35 rounded-3xl shadow-2xl p-4 flex flex-col justify-between mb-4 backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border-glass pb-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-[#824C96] text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">AI Strategy Advisor</h3>
                    <span className="text-[8px] text-emerald-450 font-bold flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-450 mr-1 animate-pulse" />
                      Simulator Online
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={clearHistory}
                    className="p-1.5 hover:bg-gray-800 rounded-lg text-text-muted hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                    title="Clear Chat Log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setGlobalChatOpen(false)}
                    className="p-1.5 hover:bg-gray-800 rounded-lg text-text-muted hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Panel */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs scrollbar-thin">
                {messages.map((msg, index) => (
                  <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-[#824C96] text-white rounded-tr-none' 
                        : 'bg-slate-950 border border-border-glass text-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                      {msg.advice && (
                        <div className="space-y-2">
                          <p className="font-bold text-[#B692C2] text-[11px] uppercase tracking-wider">{msg.advice.summary}</p>
                          <p className="text-[10px] text-slate-350 leading-relaxed"><strong className="text-white">Situation:</strong> {msg.advice.situation}</p>
                          <p className="text-[10px] text-slate-350 leading-relaxed"><strong className="text-white">Recommendation:</strong> {msg.advice.recommendation}</p>
                          <p className="text-[10px] text-slate-350 leading-relaxed"><strong className="text-white">Expected Outcome:</strong> {msg.advice.expected_outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950 border border-border-glass p-3 rounded-2xl rounded-tl-none text-slate-400 flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!chatInput.trim() || isLoading) return;
                  const query = chatInput;
                  setChatInput('');
                  await askAICEO(query);
                }}
                className="flex items-center space-x-2 border-t border-border-glass pt-3 shrink-0"
              >
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask advisor..." 
                  disabled={isLoading}
                  className="flex-1 bg-slate-950 border border-border-glass rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#824C96]"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !chatInput.trim()}
                  className="p-2 bg-[#824C96] hover:bg-[#694F8E] disabled:bg-gray-800 text-white rounded-xl transition-all cursor-pointer border-none flex items-center justify-center shadow-lg shadow-purple-950/20"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating toggle button */}
        <button 
          onClick={() => setGlobalChatOpen(prev => !prev)}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-[#824C96] to-[#694F8E] hover:from-[#694F8E] hover:to-[#824C96] shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 border-none active:scale-95 text-white flex items-center justify-center"
          title="Toggle Strategy Advisor"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
