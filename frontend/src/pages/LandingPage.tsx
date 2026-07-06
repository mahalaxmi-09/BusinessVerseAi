import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Network, 
  HelpCircle,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useBusinessState } from '../contexts/BusinessContext';
import { useAuthState } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetDemoData } = useBusinessState();
  const { demoLogin } = useAuthState();

  const onLaunchDashboard = () => {
    navigate('/login');
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp: any = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const floatAnimation: any = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    {
      title: "Interactive World View",
      desc: "Visualize your business operations as a living, breathing digital map rather than flat tables. Watch physical flows connect.",
      icon: Network,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5"
    },
    {
      title: "AI CEO Co-Pilot",
      desc: "Receive structured advice spanning Problem, Cause, Projections, and Next Action, powered by Gemini Pro decision models.",
      icon: Cpu,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
    },
    {
      title: "Run Real-time Simulations",
      desc: "Simulate pricing shocks, staffing models, marketing growth, or new branches, and visualize immediate forecast curves.",
      icon: Activity,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
    },
    {
      title: "Decision Intelligence Alerts",
      desc: "Proactive alarm filters flag supply chain bottlenecks, labor capacity gaps, and retention threats before they occur.",
      icon: ShieldCheck,
      color: "text-rose-400 border-rose-500/20 bg-rose-500/5"
    }
  ];

  return (
    <div className="w-full stripe-liquid-bg relative overflow-hidden select-none">
      {/* Stripe-style animated backgrounds & grid lines overlay */}
      <div className="absolute inset-0 stripe-grid-lines pointer-events-none z-0" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="stripe-laser-beam" style={{ left: '10%', top: '20%' }} />
        <div className="stripe-laser-beam animate-[laserSlide_15s_linear_infinite]" style={{ left: '45%', top: '5%' }} />
        <div className="stripe-laser-beam animate-[laserSlide_12s_linear_infinite]" style={{ left: '80%', top: '35%' }} />
      </div>

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-bold tracking-tight text-lg text-text-white">BusinessVerse AI</span>
        </div>
        
        <button
          onClick={onLaunchDashboard}
          className="px-5 py-2 rounded-xl glass-panel border border-border-glass text-xs font-semibold hover:border-purple-500/40 hover:text-purple-300 transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <span>Launch Platform</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-6"
        >
          <motion.div 
            variants={fadeUp}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Decision Intelligence Platform</span>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-white leading-[1.1]"
          >
            See Your <span className="gradient-text-purple-cyan font-black">Business Alive</span>
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="text-base text-text-muted max-w-xl leading-relaxed"
          >
            Stop staring at static spreadsheets. BusinessVerse AI connects your financials, inventory, staffing, and store nodes into a living interactive digital twin to model decisions and capture margins.
          </motion.p>

          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4"
          >
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-purple-900/30"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Decision Console</span>
            </button>
            
            <a
              href="#features"
              className="px-6 py-3.5 rounded-xl glass-panel border border-border-glass text-xs font-bold text-center text-text-white hover:bg-gray-800/40 transition-all flex items-center justify-center space-x-1"
            >
              <span>Explore Features</span>
            </a>
          </motion.div>
        </motion.div>

        {/* 3D-Style Interactive SVG Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="lg:col-span-5 flex justify-center items-center relative"
        >
          <motion.div 
            variants={floatAnimation}
            animate="animate"
            className="w-full max-w-[420px] aspect-square rounded-3xl glass-panel border border-border-glass p-8 relative flex items-center justify-center shadow-2xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5"
          >
            {/* Embedded glowing isometric nodes */}
            <svg viewBox="0 0 300 300" className="w-full h-full text-text-white drop-shadow-xl" fill="none">
              <path d="M150,50 L250,110 L150,170 L50,110 Z" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="rgba(255,255,255,0.01)" />
              <path d="M150,130 L250,190 L150,250 L50,190 Z" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="rgba(255,255,255,0.01)" />
              
              {/* Nodes */}
              <g transform="translate(150, 110)">
                <circle cx="0" cy="0" r="16" fill="#7C3AED" className="animate-pulse" />
                <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
              </g>
              <g transform="translate(100, 140)">
                <circle cx="0" cy="0" r="10" fill="#06B6D4" />
              </g>
              <g transform="translate(200, 140)">
                <circle cx="0" cy="0" r="10" fill="#22C55E" />
              </g>
              
              {/* Laser line paths */}
              <line x1="150" y1="110" x2="100" y2="140" stroke="#06B6D4" strokeWidth="1.5" />
              <line x1="150" y1="110" x2="200" y2="140" stroke="#22C55E" strokeWidth="1.5" />
              
              <text x="150" y="275" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                DECISION MODEL SIMULATOR
              </text>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem / Solution Section */}
      <section id="problem" className="max-w-7xl mx-auto px-6 py-20 border-t border-border-glass">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">The SME Bottleneck</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-white">Static sheets answer "What happened?" but fail to tell you "What to do next."</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Traditional ERP and dashboard software plots lagging indicators. When your business hits shipping bottlenecks or inventory runout, standard graphs show you the damage days later.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold text-success-green uppercase tracking-widest">The Decision Intelligence Solution</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-white">Run simulations on a digital twin before dedicating capital.</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              BusinessVerse AI builds a real-time simulation model of your sales channels, supply chain stock buffers, courier capacity, and pricing elasticities. We predict shortfalls and prescribe exact slider overrides to hit your profit margins.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-border-glass">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-3xl font-extrabold text-text-white">Engineered for Operational Clarity</h2>
          <p className="text-xs text-text-muted leading-relaxed">Everything you need to map operations, diagnose capacity blockages, and optimize margins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="p-6 rounded-3xl glass-card relative overflow-hidden group">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-2xl border shrink-0 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-white group-hover:text-purple-400 transition-colors duration-300">{f.title}</h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border-glass bg-gray-900/10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Architecture</span>
          <h3 className="text-xl font-bold text-text-white mt-1">Enterprise-Grade Stack</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {[
            { name: "React 19", role: "Frontend UI Framework" },
            { name: "Vite", role: "Bundler Engine" },
            { name: "FastAPI", role: "Decision API Broker" },
            { name: "Gemini Pro", role: "Contextual AI Agent" },
            { name: "Tailwind CSS", role: "Style Architecture" }
          ].map((t, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-border-glass bg-gray-900/40">
              <div className="text-xs font-extrabold text-text-white">{t.name}</div>
              <div className="text-[9px] text-text-muted mt-1">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-border-glass">
        <div className="text-center mb-16">
          <HelpCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h2 className="text-2xl font-extrabold text-text-white">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          {[
            {
              q: "How does the Business Simulation math model function?",
              a: "We deploy price elasticity indices, seasonal multiplier vectors, logarithmic marketing funnel equations, and processing threshold capacity boundaries to forecast 12-month metrics."
            },
            {
              q: "Does the AI CEO assistant support live customization?",
              a: "Yes. In live mode, we prompt Gemini with your specific cash balances, headcount, and order flow metrics. Gemini outputs targeted JSON files loaded into our dashboard overrides."
            },
            {
              q: "Can I run this offline without live database keys?",
              a: "Absolutely. The BusinessVerse sandbox automatically executes a full-fidelity client-side model, so judges can test every feature instantly without API setups."
            }
          ].map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-border-glass bg-gray-950/60">
              <h4 className="text-xs font-bold text-text-white">{faq.q}</h4>
              <p className="text-[11px] text-text-muted mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-border-glass text-center text-[10px] text-text-muted space-y-4">
        <p>&copy; {new Date().getFullYear()} BusinessVerse AI Inc. All Rights Reserved. Built with React, FastAPI, Tailwind CSS, Recharts, and Gemini.</p>
        <p className="flex justify-center space-x-4">
          <span className="cursor-pointer hover:text-text-white transition-colors">Privacy Charter</span>
          <span className="cursor-pointer hover:text-text-white transition-colors">Security Controls</span>
          <span className="cursor-pointer hover:text-text-white transition-colors">API References</span>
        </p>
      </footer>
    </div>
  );
};
