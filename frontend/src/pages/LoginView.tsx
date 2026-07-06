import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../contexts/AuthContext';
import { useBusinessState } from '../contexts/BusinessContext';
import { 
  Activity, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Fingerprint,
  Eye,
  EyeOff,
  Terminal,
  User,
  LogIn,
  Heart,
  Maximize2,
  HelpCircle,
  Shield,
  X,
  Code,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuthState();
  const { resetDemoData } = useBusinessState();

  const [email, setEmail] = useState('admin@businessverse.ai');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [apiOpen, setApiOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Password Show/Hide state
  
  // Interactive Login / Sign Up states
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg('Invalid login credentials. Please check and try again.');
    }
  };

  const handleDemoMode = async () => {
    setIsLoading(true);
    await demoLogin();
    resetDemoData();
    navigate('/dashboard');
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-y-auto flex flex-col font-sans select-none text-text-white">

      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left side: Premium Animated Showcase Preview (60% width) */}
        <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-center p-12 bg-[#090d16] overflow-hidden border-r border-border-glass py-24">
          
          {/* Top brand header */}
          <div className="flex items-center space-x-2.5 z-10 relative">
            <div className="p-2 rounded-xl bg-purple-650 border border-purple-500/30 text-text-white shadow-lg shadow-purple-950/25">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-text-white">BusinessVerse AI</span>
          </div>

          {/* Center: Headline & Interactive Agentic Commerce Card */}
          <div className="z-10 relative my-auto flex flex-col items-center justify-center space-y-6 w-full">
            <div className="text-center space-y-2 max-w-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 bg-purple-950/40 border border-purple-800/30 px-3 py-1 rounded-full">
                Next-Gen Agentic Commerce
              </span>
              <h1 className="text-3xl font-black text-text-white leading-tight tracking-tight">
                Simulate transactional <span className="text-purple-300 font-black">Agentic Commerce</span> pipelines.
              </h1>
            </div>

            {/* High-Fidelity Simulator Operations Console Card */}
            <div className="w-full max-w-[340px] bg-slate-900/90 text-white border border-purple-900/30 rounded-[32px] p-5 shadow-[0_25px_60px_-15px_rgba(130,76,150,0.45)] relative overflow-hidden flex flex-col justify-between float-card backdrop-blur-xl">
              
              {/* Card Header */}
              <div className="flex justify-between items-center mb-3.5 z-10 relative">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Operations Console
                  </h3>
                  <span className="text-[8px] text-purple-300 font-bold bg-purple-950/50 border border-purple-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    TechNova Digital Twin
                  </span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-450 animate-ping" />
              </div>

              {/* Console Metrics */}
              <div className="grid grid-cols-2 gap-2.5 mb-3.5 z-10 relative">
                <div className="bg-slate-950 border border-border-glass rounded-[20px] p-2.5">
                  <span className="text-[8px] text-text-muted font-bold block uppercase tracking-wider">Net Profit</span>
                  <span className="text-xs font-black text-emerald-400 block mt-0.5">
                    ₹52,800/mo
                  </span>
                  <span className="text-[7.5px] text-text-muted mt-0.5 block">Target: ₹45k/mo</span>
                </div>

                <div className="bg-slate-950 border border-border-glass rounded-[20px] p-2.5">
                  <span className="text-[8px] text-text-muted font-bold block uppercase tracking-wider">Operational Health</span>
                  <span className="text-xs font-black text-purple-400 block mt-0.5">
                    76%
                  </span>
                  <span className="text-[7.5px] text-text-muted mt-0.5 block">Health Index stable</span>
                </div>
              </div>

              {/* AI Advisor Chatbot Feed */}
              <div className="flex flex-col space-y-2 mb-3.5 z-10 relative">
                {/* User Message */}
                <div className="bg-slate-950 border border-border-glass text-slate-300 text-[8.5px] font-medium p-2 rounded-xl rounded-tr-none max-w-[85%] self-end">
                  How is our profit affected if we open 2 more branches?
                </div>

                {/* AI CEO Message */}
                <div className="bg-[#824C96]/20 border border-purple-800/40 text-purple-200 text-[8.5px] font-medium p-2 rounded-xl rounded-tl-none max-w-[90%] self-start">
                  Simulation projects revenue climbing to ₹5,12,000, but payroll will increase by ₹7,600/mo, narrowing net margin by 2.4%.
                </div>
              </div>

              {/* Sparkline Graphic (SVG Wave) */}
              <div className="h-14 w-full bg-slate-950 border border-border-glass rounded-xl p-2 mb-3.5 z-10 relative overflow-hidden flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="glow-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#824C96" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#824C96" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0 25 C15 28, 30 10, 45 15 C60 20, 75 5, 100 2" 
                    fill="none" 
                    stroke="#824C96" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M0 25 C15 28, 30 10, 45 15 C60 20, 75 5, 100 2 L100 30 L0 30 Z" 
                    fill="url(#glow-grad)"
                  />
                </svg>
              </div>

              {/* Console Action Button */}
              <div className="w-full py-2 bg-gradient-to-r from-[#824C96] to-[#694F8E] text-white font-extrabold rounded-xl text-[9px] text-center tracking-wider uppercase z-10 relative shadow-lg shadow-purple-950/20">
                Simulator Active
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Premium Login Panel (40% width) */}
        <div className="lg:col-span-5 flex flex-col justify-center p-12 relative bg-[#080B14] py-24">
          <div className="w-full max-w-sm mx-auto space-y-6 my-auto z-10 relative">
            
            {/* Mobile header view */}
            <div className="lg:hidden text-center space-y-2 mb-6">
              <div className="inline-flex p-2.5 rounded-xl bg-purple-600 text-text-white mb-1 shadow-lg shadow-purple-950/20">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-lg font-black text-text-white">BusinessVerse AI</h2>
              <p className="text-xs text-text-muted">Sign in to your decision cockpit</p>
            </div>

            <div className="glowing-box">
              <div className="glowing-login">
                <div className="glowing-login-bx">
                  <h3 className="text-xs font-bold text-text-white uppercase tracking-[0.2em] text-center flex items-center justify-center gap-1.5 mb-1 select-none">
                    <LogIn className="w-4 h-4 text-[#7C3AED] drop-shadow-[0_0_5px_#7C3AED]" />
                    <span>{isSignUp ? 'REGISTER' : 'LOGIN'}</span>
                    <Heart className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED] drop-shadow-[0_0_5px_#7C3AED]" />
                  </h3>

                  {errorMsg && (
                    <div className="w-full p-2 bg-danger-red/10 border border-danger-red/20 text-danger-red rounded-xl text-[9px] text-center font-semibold shrink-0">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3.5 w-full">
                    {isSignUp && (
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-[#080B14] border border-border-glass rounded-xl pl-9 pr-4 py-2 text-xs text-text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#080B14] border border-border-glass rounded-xl pl-9 pr-4 py-2 text-xs text-text-white focus:outline-none focus:border-purple-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Password</label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#080B14] border border-border-glass rounded-xl pl-9 pr-10 py-2 text-xs text-text-white focus:outline-none focus:border-purple-500 transition-colors"
                          required
                        />
                        
                        {/* Password Show / Hide Toggler */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-text-muted hover:text-text-white cursor-pointer focus:outline-none flex items-center justify-center"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 bg-[#7C3AED] hover:bg-purple-700 text-text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-purple-950/25 focus:outline-none disabled:opacity-50"
                    >
                      <span>{isLoading ? 'Verifying...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex justify-between items-center w-full text-[9px] text-text-muted pt-1">
                      <a href="#forgot" className="hover:text-text-white transition-colors">Forgot Password</a>
                      <button 
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer focus:outline-none"
                      >
                        {isSignUp ? 'Sign in' : 'Sign up'}
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Stripe-Style Full-Width Landing Footer */}
      <footer className="w-full border-t border-border-glass bg-slate-950/60 backdrop-blur-md py-12 px-6 lg:px-16 z-10 relative shrink-0 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-purple-600 border border-purple-500 text-white shrink-0">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <span className="font-black text-sm text-white tracking-tight">BusinessVerse AI</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed max-w-xs">
              Simulate transactional pipelines, test pricing elasticity, and forecast EBITDA margins with interactive digital twin models.
            </p>
            <div className="flex items-center space-x-1.5 text-[9px] text-[#22c55e] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span>System Live Connected</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-white tracking-wider">Simulations</h4>
            <ul className="space-y-2 text-[11px]">
              {['Digital Twin Hub', 'Scenario Modeler', 'EBITDA Projections', 'Flow Telemetry'].map((l) => (
                <li key={l}>
                  <a href="#features" className="text-text-muted hover:text-white transition-colors group relative py-1 block w-fit">
                    <span>{l}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-white tracking-wider">Resources</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setAboutOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none">
                  <span>About Us</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
              <li>
                <button onClick={() => setApiOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none">
                  <span>Developer API</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-white transition-colors group relative py-1 block w-fit">
                  <span>Repository Ledger</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Security & Compliance */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-white tracking-wider">Compliance</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setSecurityOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none">
                  <span>Security Sandbox</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
              <li>
                <button onClick={() => setTermsOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none">
                  <span>Terms of Service</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1200px] mx-auto border-t border-border-glass mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-text-muted space-y-2 md:space-y-0">
          <span>© 2026 BusinessVerse AI Inc. All rights reserved.</span>
          <div className="flex space-x-6">
            <span className="flex items-center text-text-muted">
              <Fingerprint className="w-3.5 h-3.5 mr-1 text-purple-400" />
              ISO 27001 Secure
            </span>
          </div>
        </div>
      </footer>

      {/* Animated About Modal */}
      <AnimatePresence>
        {aboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md bg-slate-900 border border-purple-900/35 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-border-glass pb-3 mb-4">
                <h3 className="text-sm font-black text-white flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                  About BusinessVerse AI
                </h3>
                <button onClick={() => setAboutOpen(false)} className="text-text-muted hover:text-white cursor-pointer bg-transparent border-none focus:outline-none">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                BusinessVerse is an enterprise-grade digital twin sandbox workspace. It simulates transactional pipelines, tests pricing lever elasticity, and optimizes supply-chain operations using automated AI Strategy agents.
              </p>
              <div className="flex flex-wrap gap-1.5 border-t border-border-glass pt-4">
                {['Digital Twin', 'What-If Simulation', 'AI Advisory', 'ISO 27001'].map(t => (
                  <span key={t} className="text-[8px] font-bold text-purple-300 bg-purple-950/50 border border-purple-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Animated Security Modal */}
      <AnimatePresence>
        {securityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md bg-slate-900 border border-purple-900/35 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-border-glass pb-3 mb-4">
                <h3 className="text-sm font-black text-white flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-purple-400" />
                  Security & Compliance
                </h3>
                <button onClick={() => setSecurityOpen(false)} className="text-text-muted hover:text-white cursor-pointer bg-transparent border-none focus:outline-none">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                BusinessVerse meets ISO 27001 compliance standards. All database tables, lever configurations, and projections histories are securely sandboxed inside encrypted browser storage vaults.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Animated Terms Modal */}
      <AnimatePresence>
        {termsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md bg-slate-900 border border-purple-900/35 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-border-glass pb-3 mb-4">
                <h3 className="text-sm font-black text-white flex items-center">
                  <FileCheck className="w-4 h-4 mr-2 text-purple-400" />
                  Sandbox Terms of Service
                </h3>
                <button onClick={() => setTermsOpen(false)} className="text-text-muted hover:text-white cursor-pointer bg-transparent border-none focus:outline-none">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                BusinessVerse is a sandbox demo simulation environment. Operations simulated inside this digital twin do not constitute real-world financial agreements, and all transactional ledgers are for corporate planning and intelligence projections only.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Animated Developer API Modal */}
      <AnimatePresence>
        {apiOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md bg-slate-900 border border-purple-900/35 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-border-glass pb-3 mb-4">
                <h3 className="text-sm font-black text-white flex items-center">
                  <Code className="w-4 h-4 mr-2 text-purple-400" />
                  Developer Sandbox Payload
                </h3>
                <button onClick={() => setApiOpen(false)} className="text-text-muted hover:text-white cursor-pointer bg-transparent border-none focus:outline-none">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Integrate BusinessVerse telemetry with your CRM or ERP endpoint logs. Example payload structure:
              </p>
              <pre className="bg-slate-950 border border-border-glass rounded-xl p-3 text-[10px] text-emerald-400 font-mono overflow-x-auto select-all">
{`{
  "twin_id": "nyc_retail_01",
  "operational_health": 0.76,
  "currency": "INR",
  "monthly_net_profit": 52800
}`}
              </pre>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
