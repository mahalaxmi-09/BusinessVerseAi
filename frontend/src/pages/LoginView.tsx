import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../contexts/AuthContext';
import { 
  Activity, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  User, 
  LogIn, 
  HelpCircle,
  Shield,
  X,
  Code,
  FileCheck,
  TrendingUp,
  Cpu,
  Fingerprint,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuthState();

  const [email, setEmail] = useState('admin@businessverse.ai');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');

  // Hover-to-open state for the credentials form card
  const [isOpen, setIsOpen] = useState(false);

  // Footer modals states
  const [aboutOpen, setAboutOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [apiOpen, setApiOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg('Invalid credentials. Hint: use admin@businessverse.ai / password123');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const success = await register(fullName, email, password);
      setIsLoading(false);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMsg('Sign up failed. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('Server connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B17] relative overflow-y-auto flex flex-col font-sans select-none text-text-white">
      {/* Custom Styles Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        @property --a {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes rotating {
          0% {
            --a: 0deg;
          }
          100% {
            --a: 360deg;
          }
        }

        .tpl-box {
          position: relative;
          width: 400px;
          height: 200px;
          background: repeating-conic-gradient(from var(--a),
                  #824C96 0%,
                  #824C96 5%,
                  transparent 5%,
                  transparent 40%,
                  #824C96 50%);
          filter: drop-shadow(0 15px 50px #000);
          animation: rotating 4s linear infinite;
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.5s;
          box-sizing: border-box;
        }

        .tpl-box * {
          font-family: "Poppins", sans-serif;
          box-sizing: border-box;
        }

        .tpl-box.is-open {
          width: 450px;
          height: 500px;
        }

        .tpl-box::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-conic-gradient(from var(--a),
                  #06B6D4 0%,
                  #06B6D4 5%,
                  transparent 5%,
                  transparent 40%,
                  #06B6D4 50%);
          filter: drop-shadow(0 15px 50px #000);
          border-radius: 20px;
          animation: rotating 4s linear infinite;
          animation-delay: -1s;
        }

        .tpl-box::after {
          content: "";
          position: absolute;
          inset: 4px;
          background: #101828;
          border-radius: 15px;
          border: 8px solid #151B2D;
        }

        .tpl-login {
          position: absolute;
          inset: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.2);
          z-index: 10;
          box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.5);
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          transition: 0.5s;
          color: #fff;
          overflow: hidden;
        }

        .tpl-box.is-open .tpl-login {
          inset: 40px;
        }

        .tpl-loginBx {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          transform: translateY(126px);
          gap: 20px;
          width: 70%;
          transition: 0.5s;
        }

        .tpl-box.is-open .tpl-loginBx {
          transform: translateY(0px);
        }

        .tpl-loginBx h2 {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          font-size: 1.25rem;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          margin-bottom: 5px;
          color: #fff !important;
        }

        .tpl-loginBx h2 svg, .tpl-loginBx h2 i {
          color: #824C96 !important;
          filter: drop-shadow(0 0 5px #824C96) drop-shadow(0 0 30px #824C96) !important;
        }

        .tpl-loginBx input {
          width: 100%;
          padding: 10px 20px;
          outline: none;
          font-size: 1em;
          color: #fff !important;
          background: rgba(0, 0, 0, 0.15) !important;
          border: 2px solid #fff !important;
          border-radius: 30px !important;
          transition: all 0.3s;
        }

        .tpl-loginBx input:focus {
          border-color: #06B6D4 !important;
          background: rgba(0, 0, 0, 0.3) !important;
        }

        .tpl-loginBx input::placeholder {
          color: #999 !important;
        }

        .tpl-submit-btn {
          background: #06B6D4 !important;
          border: none !important;
          font-weight: 600 !important;
          color: #111 !important;
          cursor: pointer;
          transition: 0.5s;
          border-radius: 30px !important;
          width: 100%;
          padding: 12px 20px;
          font-size: 1em;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 10px;
        }

        .tpl-submit-btn:hover {
          box-shadow: 0 0 10px #06B6D4, 0 0 40px #06B6D4 !important;
          transform: scale(1.01);
        }

        .tpl-group {
          display: flex;
          width: 100%;
          justify-content: space-between;
          font-size: 0.85em;
          padding: 0 5px;
          margin-top: 5px;
        }

        .tpl-group a, .tpl-group button {
          color: #fff !important;
          text-decoration: none !important;
          transition: color 0.3s;
          background: transparent !important;
          border: none !important;
          cursor: pointer;
        }

        .tpl-group a:hover, .tpl-group button:hover {
          color: #06B6D4 !important;
        }

        .tpl-group button.tpl-signup-link {
          color: #824C96 !important;
          font-weight: 600 !important;
        }

        .tpl-group button.tpl-signup-link:hover {
          color: #9E6FB1 !important;
        }
      `}} />
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Animated Startup Ecosystem Showcase (60% width on large screens) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-[#090D1A]/40 border-r border-white/5 relative overflow-hidden">
          {/* Animated dot grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#151B2D_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-650/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="flex items-center space-x-2.5 z-10 relative">
            <div className="p-2 rounded-xl bg-purple-650/15 border border-purple-500/20 text-purple-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">BusinessVerse <span className="text-[#06B6D4]">AI</span></span>
          </div>

          {/* Center Content: Animated Nodes Ecosystem Map */}
          <div className="my-auto space-y-8 z-10 relative">
            <div className="space-y-3 max-w-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#06B6D4] bg-cyan-950/40 border border-cyan-800/30 px-3.5 py-1.5 rounded-full">
                Contextual Twin Active
              </span>
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                Simulate transactional pipelines on a living digital twin.
              </h2>
              <p className="text-xs text-text-muted max-w-md leading-relaxed">
                Connect finance records, supplier lead times, and retail order logs directly to Gemini predictive strategy agents.
              </p>
            </div>

            {/* Glowing Digital Twin Showcase Box */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.02, y: -10, boxShadow: '0 20px 50px rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)' }}
              className="w-full max-w-[400px] p-6 rounded-3xl border border-white/5 bg-[#101828]/60 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300"
            >
              {/* Connected lines simulation (SVG) */}
              <div className="absolute inset-0 z-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 350 160">
                  <path d="M 50 40 Q 175 10 300 40" fill="none" stroke="#7C3AED" strokeWidth="1.5" />
                  <path d="M 50 120 Q 175 150 300 120" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
                  <path d="M 175 80 L 50 40 M 175 80 L 300 40 M 175 80 L 50 120 M 175 80 L 300 120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </svg>
              </div>

              {/* Header metrics */}
              <div className="flex justify-between items-center z-10 relative mb-4">
                <div className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] text-white font-black uppercase tracking-wider">TechNova Pipeline</span>
                </div>
                <span className="flex items-center space-x-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /><span className="text-[8px] text-emerald-400 font-extrabold uppercase">Live Feed</span></span>
              </div>

              {/* Data numbers row */}
              <div className="grid grid-cols-2 gap-4 z-10 relative mb-4">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-3 bg-black/40 border border-white/5 rounded-xl transition-all cursor-default"
                >
                  <span className="text-[8px] text-text-muted font-bold block uppercase tracking-wider">Estimated Revenue</span>
                  <span className="text-sm font-black text-white mt-1 block">$52,800/mo</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-3 bg-black/40 border border-white/5 rounded-xl transition-all cursor-default"
                >
                  <span className="text-[8px] text-text-muted font-bold block uppercase tracking-wider">Operational Health</span>
                  <span className="text-sm font-black text-purple-400 mt-1 block">94/100</span>
                </motion.div>
              </div>

              {/* AI Strategy Log */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl z-10 relative text-[9px] text-purple-200/90 leading-relaxed font-semibold cursor-default transition-all"
              >
                "Gemini: Low stock in inventory warehouse B; recommending 40 units marketing shift."
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Copyright details */}
          <div className="text-[10px] text-text-muted z-10 relative">
            BusinessVerse Twin Console v1.1.0 • secure sandboxed architecture.
          </div>
        </div>

        {/* Right Side: Glass Login Panel (40% width) */}
        <div style={{ perspective: 1000 }} className="lg:col-span-5 flex flex-col justify-center p-6 md:p-12 relative bg-[#070B17] py-24 border-l border-white/5">
          <div className="w-full max-w-sm mx-auto space-y-6 my-auto z-10 relative">
            
            {/* Logo for mobile view */}
            <div className="lg:hidden text-center space-y-2 mb-6">
              <div className="inline-flex p-2.5 rounded-xl bg-purple-650/15 border border-purple-500/20 text-purple-400">
                <Cpu className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <h2 className="text-lg font-black text-white">BusinessVerse AI</h2>
              <p className="text-xs text-text-muted">Decision cockpit authentication gateway</p>
            </div>

            <div 
              onMouseEnter={() => setIsOpen(true)}
              className={`tpl-box ${isOpen ? 'is-open' : ''}`}
            >
              <div className="tpl-login">
                <div className="tpl-loginBx">
                  <h2>
                    <LogIn className="w-4.5 h-4.5 text-[#ff2770] drop-shadow-[0_0_5px_#ff2770]" />
                    <span>{isSignUp ? 'REGISTER' : 'LOGIN'}</span>
                    <Heart className="w-4.5 h-4.5 text-[#ff2770] drop-shadow-[0_0_5px_#ff2770] fill-current" />
                  </h2>

                  <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="w-full space-y-4">
                    {errorMsg && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-[10px] text-center font-bold">
                        {errorMsg}
                      </div>
                    )}

                    {isSignUp && (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-black/10 border-2 border-white rounded-[30px] px-5 py-2.5 text-xs text-white outline-none focus:border-[#45f3ff] transition-all"
                        placeholder="Full Name"
                        required
                      />
                    )}

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/10 border-2 border-white rounded-[30px] px-5 py-2.5 text-xs text-white outline-none focus:border-[#45f3ff] transition-all"
                      placeholder="Username"
                      required
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/10 border-2 border-white rounded-[30px] px-5 py-2.5 text-xs text-white outline-none focus:border-[#45f3ff] transition-all"
                      placeholder="Password"
                      required
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="tpl-submit-btn border-none"
                    >
                      {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>

                    <div className="tpl-group">
                      <span className="cursor-pointer hover:text-[#45f3ff] transition-colors">Forgot Password?</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const nextMode = !isSignUp;
                          setIsSignUp(nextMode);
                          if (nextMode) {
                            if (email === 'admin@businessverse.ai') setEmail('');
                            if (password === 'password123') setPassword('');
                          } else {
                            if (!email) setEmail('admin@businessverse.ai');
                            if (!password) setPassword('password123');
                          }
                        }}
                        className="tpl-signup-link cursor-pointer border-none"
                      >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
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
      <footer className="w-full border-t border-white/5 bg-slate-950/60 backdrop-blur-md py-12 px-6 lg:px-16 z-10 relative shrink-0 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-purple-650/15 border border-purple-500/20 text-purple-400 shrink-0">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">BusinessVerse <span className="text-[#06B6D4]">AI</span></span>
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
            <ul className="space-y-2 text-[11px] list-none p-0">
              {['Digital Twin Hub', 'Scenario Modeler', 'EBITDA Projections', 'Flow Telemetry'].map((l) => (
                <li key={l}>
                  <span className="text-text-muted hover:text-white transition-colors cursor-pointer group relative py-1 block w-fit">
                    <span>{l}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-white tracking-wider">Resources</h4>
            <ul className="space-y-2 text-[11px] list-none p-0">
              <li>
                <button onClick={() => setAboutOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none p-0">
                  <span>About Us</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
              <li>
                <button onClick={() => setApiOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none p-0">
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
            <ul className="space-y-2 text-[11px] list-none p-0">
              <li>
                <button onClick={() => setSecurityOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none p-0">
                  <span>Security Sandbox</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
              <li>
                <button onClick={() => setTermsOpen(true)} className="text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer group relative py-1 block w-fit text-left focus:outline-none p-0">
                  <span>Terms of Service</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1200px] mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-text-muted space-y-2 md:space-y-0">
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
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
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
              <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
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
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
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
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
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
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
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
              <pre className="bg-slate-950 border border-white/5 rounded-xl p-3 text-[10px] text-emerald-400 font-mono overflow-x-auto select-all">
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
