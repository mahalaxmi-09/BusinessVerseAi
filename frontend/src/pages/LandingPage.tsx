import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Network, 
  HelpCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Users,
  ShoppingBag,
  TrendingUp,
  Package,
  BarChart3,
  FileText,
  Brain,
  DollarSign,
  Layers,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Check,
  Mail,
  Code,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeClip, setActiveClip] = useState<'clip1' | 'clip2'>('clip1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force autoplay trigger on mount / load / clip swap
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.log("Autoplay check:", err);
      });
    }
  }, [activeClip, videoLoaded]);

  // Play/Pause scroll threshold observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          // Pause only if it goes completely offscreen
          if (entry.isIntersecting && isPlaying) {
            videoRef.current.play().catch(() => {});
          } else if (!entry.isIntersecting) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.05 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeClip, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCardClick = () => {
    if (videoRef.current) {
      const nextMuteState = !isMuted;
      videoRef.current.muted = nextMuteState;
      setIsMuted(nextMuteState);
      if (!isPlaying) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Redirect to credential login
  const onLaunchDashboard = () => {
    navigate('/login');
  };

  // State for interactive simulation showcase
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1.2);
  const [marketingBudget, setMarketingBudget] = useState<number>(2000);
  const [simProfit, setSimProfit] = useState<number>(2350);
  const [simHealth, setSimHealth] = useState<number>(76);
  const [simAdvice, setSimAdvice] = useState<string>("Optimal profit balance. Healthy user retention active.");

  // Recalculate simulation values on slider changes
  useEffect(() => {
    // Basic business equations for the preview interaction
    const calculatedRevenue = Math.round(15000 + (marketingBudget * 3.5) - (priceMultiplier - 1.2) * 8000);
    const calculatedProfit = Math.round(calculatedRevenue * 0.45 - (marketingBudget * 0.8));
    const calculatedHealth = Math.min(100, Math.max(30, Math.round(85 - (priceMultiplier - 1.0) * 35 + (marketingBudget / 1000) * 4)));
    
    setSimProfit(calculatedProfit);
    setSimHealth(calculatedHealth);

    if (priceMultiplier > 1.8) {
      setSimAdvice("WARNING: Pricing is high. Customer churn risk increases; consider scaling marketing budget to protect sales.");
    } else if (marketingBudget < 1000) {
      setSimAdvice("CRITICAL: Low brand awareness. Competitors are capturing search indexes. Increase budget above $1,500.");
    } else {
      setSimAdvice("EXCELLENT: Stable growth metrics. Margin is balanced against customer satisfaction scoring.");
    }
  }, [priceMultiplier, marketingBudget]);

  // State for Interactive AI CEO Chatbot simulator
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Hello! I am your AI CEO advisor. Ask me anything about your digital twin's current operations." }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const triggerChatResponse = (prompt: string, responseText: string) => {
    if (isTyping) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: prompt }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 1500);
  };

  // State for active hovered node in ecosystem animation
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Nodes position setup
  const nodes = [
    { id: 'CEO', label: 'AI CEO', x: 250, y: 150, details: 'Advising Optimization', color: '#7C3AED' },
    { id: 'Finance', label: 'Finance', x: 120, y: 80, details: 'Net Cash Flow: $18,200', color: '#06B6D4' },
    { id: 'Marketing', label: 'Marketing', x: 380, y: 80, details: 'Conversion: 4.8%', color: '#3b82f6' },
    { id: 'Store', label: 'Digital Store', x: 250, y: 50, details: 'Orders: 156 Units', color: '#10b981' },
    { id: 'Warehouse', label: 'Warehouse', x: 120, y: 220, details: 'Capacity: 74%', color: '#f59e0b' },
    { id: 'Inventory', label: 'Inventory', x: 250, y: 250, details: 'Valuation: $8,420', color: '#a855f7' },
    { id: 'Suppliers', label: 'Suppliers', x: 380, y: 220, details: 'Lead Time: 2.1 days', color: '#ec4899' },
    { id: 'Employees', label: 'Employees', x: 80, y: 150, details: 'Productivity: 96%', color: '#14b8a6' },
    { id: 'Customers', label: 'Customers', x: 420, y: 150, details: 'Retention: 92%', color: '#84cc16' }
  ];

  // Connections map
  const connections = [
    { from: 'Store', to: 'CEO' },
    { from: 'Finance', to: 'CEO' },
    { from: 'Marketing', to: 'CEO' },
    { from: 'Warehouse', to: 'CEO' },
    { from: 'Inventory', to: 'CEO' },
    { from: 'Suppliers', to: 'Warehouse' },
    { from: 'Employees', to: 'Warehouse' },
    { from: 'Customers', to: 'Store' },
    { from: 'Marketing', to: 'Customers' }
  ];

  return (
    <div className="w-full bg-[#070B17] text-text-white relative overflow-hidden select-none font-sans min-h-screen">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-10 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Laser Light Rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute w-[2px] h-[400px] bg-gradient-to-b from-purple-500/0 via-purple-500/25 to-purple-500/0 blur-[1px] rotate-45 left-[20%] top-[-10%] animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute w-[2px] h-[500px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 blur-[1px] -rotate-45 right-[20%] top-[10%] animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      {/* Modern Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-20 border-b border-white/5 bg-[#070B17]/60 backdrop-blur-md sticky top-0">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="p-1.5 rounded-lg bg-purple-650/15 border border-purple-500/20 text-purple-400">
            <Cpu className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <span className="font-extrabold tracking-tight text-lg text-white">BusinessVerse <span className="text-[#06B6D4]">AI</span></span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-text-muted">
          <a href="#ecosystem" className="hover:text-text-white transition-colors">Ecosystem</a>
          <a href="#problem" className="hover:text-text-white transition-colors">Digital Twin</a>
          <a href="#simulation" className="hover:text-text-white transition-colors">Simulations</a>
          <a href="#ceo-showcase" className="hover:text-text-white transition-colors">AI CEO</a>
          <a href="#roadmap" className="hover:text-text-white transition-colors">Roadmap</a>
        </nav>
        
        <button
          onClick={onLaunchDashboard}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-550 hover:to-indigo-550 text-white text-xs font-black transition-all duration-300 hover:scale-[1.03] shadow-md shadow-indigo-950/40 cursor-pointer flex items-center space-x-2 border-none"
        >
          <span>Launch Platform</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-7">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-extrabold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>Enterprise Decision Intelligence Engine</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
            See Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Business Alive.</span>
          </h1>

          <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">
            An AI-powered Decision Intelligence Platform that transforms business data into a living digital ecosystem. Connect store nodes, supply routes, and cashflow in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-3">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-550 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2.5 transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-indigo-950/50 cursor-pointer border-none"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Platform</span>
            </button>
            
            <a
              href="#ecosystem"
              className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-black text-center text-white flex items-center justify-center space-x-1.5"
            >
              <span>Explore Ecosystem</span>
            </a>
          </div>

          {/* Counts metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/5">
            <div>
              <div className="text-2xl font-black text-white">$1.2M+</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">Simulated Profits</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">10 Nodes</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">Ecosystem Grid</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">50+ Models</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">Decision Levers</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">98% Accuracy</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">AI Projections</div>
            </div>
          </div>
        </div>

        {/* Premium AI Presenter Video Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 w-full flex justify-center items-center relative z-10"
        >
          {/* Card Container with custom border radius, glass background, purple glow border, and soft shadows */}
          <div 
            onClick={handleCardClick}
            className="w-full aspect-[16/9] rounded-[28px] bg-gradient-to-br from-[#101828]/95 to-[#070B17]/95 border border-purple-500/30 p-[1px] shadow-[0_0_30px_rgba(124,58,237,0.25)] relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] group cursor-pointer flex flex-col justify-between"
          >
            
            {/* Ambient background glow inside the card */}
            <div className="absolute inset-0 bg-[#070B17] rounded-[28px] overflow-hidden">
              {/* Animated light rays/mesh */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-cyan-950/10 to-transparent opacity-60 z-0" />
              {/* Subtle grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(#151B2D_1px,transparent_1px)] [background-size:16px_16px] opacity-30 z-0" />
              {/* Subtle loading shimmer */}
              {!videoLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] z-0" />
              )}
            </div>

            {/* HTML5 video element with activeClip source */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden z-1 bg-black">
              <video
                ref={videoRef}
                key={activeClip}
                src={activeClip === 'clip1' ? '/videos/clip1.mp4' : '/videos/clip2.mp4'}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                className="w-full h-full object-cover rounded-[28px] transition-all duration-500"
              />
            </div>

            {/* Content Overlays */}
            {/* Top Left Label */}
            <div className="absolute top-4 left-5 z-10 flex items-center space-x-1.5 bg-black/40 border border-white/5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-white tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span>BusinessVerse AI Live Demo</span>
            </div>

            {/* Clip Swapping Badge */}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveClip(activeClip === 'clip1' ? 'clip2' : 'clip1'); }}
              className="absolute top-4 right-28 z-10 flex items-center space-x-1 bg-purple-650/30 border border-purple-500/30 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-purple-300 hover:bg-purple-500/40 transition-all cursor-pointer pointer-events-auto focus:outline-none"
            >
              <span>Swap to {activeClip === 'clip1' ? 'Demo Clip' : 'Intro Clip'}</span>
            </button>

            {/* Top Right Live badge */}
            <div className="absolute top-4 right-5 z-10 flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-rose-400 tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Live Presentation</span>
            </div>

            {/* Center Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 space-y-3 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                  <Play className="w-5 h-5 fill-current text-white translate-x-[2px]" />
                </div>
              </div>
            )}

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-4 left-5 right-5 z-10 flex justify-between items-end pointer-events-none">
              <div className="space-y-0.5">
                <div className="text-[11px] font-black text-white tracking-wide">Meet Ava – AI Business Consultant</div>
                <div className="text-[9px] text-text-muted">Watch a 30-second introduction to BusinessVerse AI</div>
              </div>
              
              {/* Custom Controls (Play/Pause & Mute/Unmute) */}
              <div className="flex items-center space-x-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Hover overlay text block */}
            <div className="absolute inset-0 bg-[#070B17]/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-20 rounded-[28px]">
              <div className="space-y-1 max-w-xs">
                <h4 className="text-sm font-black text-white">Meet Ava</h4>
                <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Your AI Business Consultant</p>
                <p className="text-[9px] text-text-muted mt-2 leading-relaxed">
                  Click anywhere on the card to unmute/mute audio
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Trusted Companies Marquee */}
      <section className="w-full border-t border-b border-white/5 py-8 bg-[#080D1D]/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden relative">
          {/* Gradient fade edge masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070B17] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070B17] to-transparent z-10 pointer-events-none" />
          
          <div className="flex items-center justify-center space-x-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
            {[
              "ACME CORPORATE", "GLOBEX SOLUTIONS", "INITECH INDUSTRIES", "UMBRELLA LABS", 
              "STARK INDUSTRIES", "WAYNE ENTERPRISES", "CYBERDYNE INC", "TYRELL BIOTECH"
            ].map((company, idx) => (
              <span key={idx} className="text-xs font-black tracking-widest text-text-muted hover:text-white transition-colors cursor-default select-none mx-6">
                ⚡ {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">BusinessVerse Map</span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Living Digital Ecosystem</h2>
          <p className="text-xs text-text-muted max-w-lg mx-auto">
            Hover over any ecosystem node to inspect real-time transaction updates, system capacity, and connected path animations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Canvas: SVG interactive connections map */}
          <div className="lg:col-span-7 flex justify-center items-center bg-[#0C1224]/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden h-[400px]">
            {/* SVG connections drawer */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 500 300">
              {/* Draw connected lines */}
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const isPathActive = hoveredNode === fromNode.id || hoveredNode === toNode.id;

                return (
                  <g key={idx}>
                    {/* Curved line path */}
                    <path
                      d={`M ${fromNode.x} ${fromNode.y} C ${(fromNode.x + toNode.x)/2} ${fromNode.y}, ${(fromNode.x + toNode.x)/2} ${toNode.y}, ${toNode.x} ${toNode.y}`}
                      fill="none"
                      stroke={isPathActive ? '#7C3AED' : '#1e293b'}
                      strokeWidth={isPathActive ? '2' : '1'}
                      className="transition-all duration-300"
                    />
                    {/* Flowing particle packets */}
                    <path
                      d={`M ${fromNode.x} ${fromNode.y} C ${(fromNode.x + toNode.x)/2} ${fromNode.y}, ${(fromNode.x + toNode.x)/2} ${toNode.y}, ${toNode.x} ${toNode.y}`}
                      fill="none"
                      stroke={fromNode.color}
                      strokeWidth="2"
                      strokeDasharray="4, 12"
                      className="animate-[dash_4s_linear_infinite]"
                      opacity={isPathActive ? "0.9" : "0.3"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Node capsules */}
            {nodes.map((node) => {
              const isActive = hoveredNode === node.id;
              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x - 55}px`, top: `${node.y - 18}px` }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`absolute w-[110px] py-1 px-2.5 rounded-full border text-center cursor-pointer transition-all duration-300 select-none z-10 flex flex-col items-center justify-center ${
                    isActive 
                      ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.3)] scale-105' 
                      : 'bg-[#151B2D]/80 border-white/10'
                  }`}
                >
                  <span className="text-[9px] font-black text-white tracking-wider">{node.label}</span>
                </div>
              );
            })}

            {/* Floating details banner */}
            <div className="absolute bottom-4 left-4 p-3 rounded-xl border border-white/5 bg-[#070B17]/80 backdrop-blur-md text-[10px] text-text-muted z-20 pointer-events-none max-w-[200px]">
              {hoveredNode ? (
                <>
                  <div className="font-extrabold text-white mb-0.5">{nodes.find(n => n.id === hoveredNode)?.label} Node</div>
                  <div>{nodes.find(n => n.id === hoveredNode)?.details}</div>
                </>
              ) : (
                <span>Hover over any department node to fetch telemetry streams.</span>
              )}
            </div>
          </div>

          {/* Right Text: Ecosystem description */}
          <div className="lg:col-span-5 space-y-5">
            <h3 className="text-xl font-bold text-white">Full-Fidelity Operational Twin</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              BusinessVerse AI integrates all your department endpoints. Data packets stream from digital stores to warehouse inventories, ledger entries update pricing lists, and the AI CEO parses variables constantly to recommend optimizations.
            </p>
            <div className="space-y-2.5">
              {[
                { title: "Dynamic Line Particles", desc: "Curved visual flows animate data transfers and logistics operations." },
                { title: "Point-of-Sale Nodes", desc: "Digital stores capture consumer traffic inputs instantly." },
                { title: "Autonomous Routing", desc: "Warehouses and couriers feed supply chain constraints into cash projections." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Comparison (Storytelling) */}
      <section id="problem" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">The Paradigm Shift</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">The Living Digital Twin</h2>
          <p className="text-xs text-text-muted leading-relaxed">How we translate static, flat numbers into interactive decision intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Static Past Card */}
          <div className="p-8 rounded-3xl border border-rose-500/10 bg-gradient-to-b from-rose-950/5 to-rose-950/10 space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">The Static Past</h3>
            <p className="text-xs text-rose-200/60 leading-relaxed">
              Standard spreadsheets and dashboards only look backwards, telling you "what happened" days after shipping bottle-necks or inventory runouts occur. No forecasting context means delayed overrides and lost capital margins.
            </p>
            <div className="space-y-3 pt-4 border-t border-rose-900/10 text-[10px] text-rose-300">
              <div className="flex items-center space-x-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>Lagging spreadsheet reports</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>No forward predictive simulations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>Siloed, disconnected department operations</span>
              </div>
            </div>
          </div>

          {/* Living Digital Twin Card */}
          <div className="p-8 rounded-3xl border border-emerald-500/10 bg-gradient-to-b from-emerald-950/5 to-emerald-950/10 space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">The Living Digital Twin</h3>
            <p className="text-xs text-emerald-200/60 leading-relaxed">
              BusinessVerse AI builds a real-time predictive sandbox. Run elasticity pricing shocks, modify ad budgets, and project inventory curves. Let your AI CEO formulate targeted prescriptions before capital is committed.
            </p>
            <div className="space-y-3 pt-4 border-t border-emerald-900/10 text-[10px] text-emerald-300">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Active SVG logistic connecting maps</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Interactive budget and margin simulators</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Prescriptive AI CEO text advisory reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-widest">Platform Core</span>
          <h2 className="text-3xl font-black text-white">How BusinessVerse AI Operates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: "01", name: "Collect", desc: "Integrate POS stores, courier speeds, and warehouse stock inputs." },
            { step: "02", name: "Analyze", desc: "Synthesize operational overhead, logistics speeds, and ad conversions." },
            { step: "03", name: "Predict", desc: "Generate 12-month projections curves for profits and stock availability." },
            { step: "04", name: "Recommend", desc: "Gemini AI parses performance parameters to recommend budget overrides." },
            { step: "05", name: "Grow", desc: "Unlock optimized pricing elasticities and expand client footprints." }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#0A1021]/80 hover:border-purple-500/30 transition-all duration-300 relative group">
              <div className="text-2xl font-black text-purple-500/30 group-hover:text-purple-400 transition-colors duration-300">{item.step}</div>
              <h4 className="text-xs font-bold text-white mt-3 uppercase tracking-wider">{item.name}</h4>
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Business Simulation Preview */}
      <section id="simulation" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Live Preview</span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Business Simulation Sandbox</h2>
          <p className="text-xs text-text-muted max-w-lg mx-auto">
            Test the decision core. Drag the sliders to see profit projections, digital twin health, and AI recommendations update.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Controls & Visual Live Output */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 backdrop-blur-md space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider pb-3 border-b border-white/5 flex items-center space-x-2">
                <SlidersIcon className="w-4 h-4 text-purple-400" />
                <span>Simulation Controls</span>
              </h3>

              {/* Slider 1: Price Multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-muted">Price Multiplier (Elasticity)</span>
                  <span className="text-purple-400 font-extrabold">{priceMultiplier.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="2.5" 
                  step="0.1" 
                  value={priceMultiplier}
                  onChange={(e) => setPriceMultiplier(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                />
                <div className="flex justify-between text-[9px] text-text-muted">
                  <span>1.0x (Baseline)</span>
                  <span>2.5x (Premium pricing)</span>
                </div>
              </div>

              {/* Slider 2: Marketing Budget */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-muted">Monthly Marketing Budget</span>
                  <span className="text-[#06B6D4] font-extrabold">${marketingBudget.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="5000" 
                  step="100" 
                  value={marketingBudget}
                  onChange={(e) => setMarketingBudget(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                />
                <div className="flex justify-between text-[9px] text-text-muted">
                  <span>$500 (Muted)</span>
                  <span>$5,000 (Aggressive expansion)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Metrics Display Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl border border-white/5 bg-[#151B2D]/40 space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Simulated Outcomes</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Net Profit Metric */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-text-muted font-bold uppercase">Projected Net Profit</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">${simProfit.toLocaleString()}</div>
                </div>

                {/* Health Metric */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-text-muted font-bold uppercase">Customer Health</div>
                  <div className="text-xl font-black text-white mt-1">{simHealth}/100</div>
                </div>
              </div>

              {/* Live AI CEO commentary */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider">AI Advisor Live Feed</span>
                </div>
                <p className="text-[10px] text-purple-100/80 leading-relaxed font-semibold transition-all duration-300">
                  {simAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI CEO Showcase Section */}
      <section id="ceo-showcase" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text: CEO Info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Co-Pilot Advisory</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Your Autonomous AI CEO</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              BusinessVerse AI integrates directly with conversational decision intelligence. Select a prompt on the right console to watch the AI parse cash metrics and generate dynamic operational strategies.
            </p>
            <div className="space-y-3">
              {[
                { prompt: "Analyze current inventory risk.", response: "Suggesting $2,000 marketing shift to release 120 units of wireless stocks." },
                { prompt: "Formulate margins pricing shocks.", response: "Price elasticity simulations show maximum yield is at 1.4x baseline costings." }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerChatResponse(item.prompt, item.response)}
                  className="w-full p-3 rounded-xl border border-white/5 bg-[#151B2D]/40 text-[10px] text-left hover:border-purple-500/40 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>"{item.prompt}"</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Console: Typing Chatbot Simulator */}
          <div className="lg:col-span-7">
            <div className="p-5 rounded-3xl border border-white/5 bg-[#0C1224]/60 backdrop-blur-md space-y-4 max-h-[350px] overflow-y-auto flex flex-col justify-between h-[320px]">
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                <AnimatePresence>
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-3 rounded-2xl max-w-[80%] text-[10px] leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-purple-650 text-white rounded-br-none' 
                          : 'bg-[#151B2D] text-text-muted rounded-bl-none border border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-[#151B2D] text-text-muted rounded-bl-none border border-white/5 text-[9px] flex items-center space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 text-[9px] text-text-muted flex justify-between items-center">
                <span>AI CEO Engine: Gemini Pro active node.</span>
                <span className="flex items-center space-x-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /><span>Online</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Vector Analytics SVG Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-widest">Financial Yields</span>
          <h2 className="text-3xl font-black text-white">Visual Analytics Sandbox</h2>
          <p className="text-xs text-text-muted">Continuous 12-month projections of revenue yields and satisfaction indices.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Revenue Chart Box */}
          <div className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs font-black text-white uppercase tracking-wider">Gross Sales Velocity</span>
              <span className="text-[10px] text-emerald-400 font-extrabold">↑ 18.5% YoY</span>
            </div>
            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d="M 0,38 Q 15,10 30,28 T 60,12 T 90,32 T 100,5"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2"
                />
                <path
                  d="M 0,38 Q 15,10 30,28 T 60,12 T 90,32 T 100,5 L 100,40 L 0,40 Z"
                  fill="url(#revGrad)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Business Health Chart Box */}
          <div className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs font-black text-white uppercase tracking-wider">Satisfaction Index Tracker</span>
              <span className="text-[10px] text-amber-500 font-extrabold">Stable (94/100)</span>
            </div>
            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d="M 0,22 Q 25,12 50,30 T 100,8"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2"
                />
                <path
                  d="M 0,22 Q 25,12 50,30 T 100,8 L 100,40 L 0,40 Z"
                  fill="url(#healthGrad)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Capabilities Matrix</span>
          <h2 className="text-3xl font-black text-white">Engineered for Operational Clarity</h2>
          <p className="text-xs text-text-muted leading-relaxed">Everything you need to diagnose capacity limits and optimize budget allocations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "AI CEO Co-Pilot", desc: "Streaming strategies spanning Problems, Root Causes, and Next Actions.", icon: Brain, color: "text-purple-400 bg-purple-500/5 border-purple-500/10" },
            { title: "Decision Simulations", desc: "Sliders that model prices, ad budgets, and logistics capacity speeds.", icon: SlidersIcon, color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10" },
            { title: "Interactive World Twin", desc: "Watch physical inventory supply chain packets flow dynamically on a NYC grid.", icon: Network, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
            { title: "12-Month Projections", desc: "Generate predictive forecasts curves mapping sales conversions to costs.", icon: TrendingUp, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
            { title: "Structured PDF Reports", desc: "Compile full transaction statements and overhead breakdowns instantly.", icon: FileText, color: "text-[#ec4899] bg-[#ec4899]/5 border-[#ec4899]/10" },
            { title: "Logistics Flow Alerts", desc: "Automatic triggers call out stocks runouts and courier retention lags.", icon: ShieldCheck, color: "text-rose-400 bg-rose-500/5 border-rose-500/10" },
            { title: "Multi-Currency Ledger", desc: "Localized lookups handle USD, Rupee, and Euro exchange valuations.", icon: DollarSign, color: "text-teal-400 bg-teal-500/5 border-teal-500/10" },
            { title: "Modern Design Grid", desc: "Enjoy premium glassmorphic overlays and custom cursor draw paths.", icon: Layers, color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" }
          ].map((feat, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 hover:border-purple-500/30 transition-all duration-300 group hover:scale-[1.02] cursor-pointer">
              <div className={`p-3 rounded-2xl border w-11 shrink-0 ${feat.color} group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider mt-4 group-hover:text-purple-400 transition-colors">{feat.title}</h3>
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us (Storytelling) */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center border-b border-white/5 relative z-10">
        <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-widest">Our Mission</span>
        <blockquote className="text-xl md:text-3xl font-black italic text-white mt-6 leading-snug">
          "Businesses have always relied on numbers. Numbers explain the past. BusinessVerse AI lets you experience your business as a living ecosystem. Every department becomes interactive. Every decision becomes visual. Every prediction becomes actionable."
        </blockquote>
        <p className="text-xs text-text-muted mt-6 max-w-lg mx-auto leading-relaxed">
          BusinessVerse AI isn't another dashboard. It is your company's Digital Twin. We connect physical bottlenecks to profit margins so you can simulate growth limits before committing cash reserves.
        </p>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Milestones</span>
          <h2 className="text-3xl font-black text-white">Project Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { phase: "PHASE 1", name: "Real-time twin monitoring", status: "Completed", desc: "Construct digital maps and link active transactions of warehouses and stores." },
            { phase: "PHASE 2", name: "AI Decision Intelligence", status: "Active", desc: "Integrate Gemini API models to output structured root cause prescriptions." },
            { phase: "PHASE 3", name: "Simulation Sandbox", status: "In Progress", desc: "Allow slider overrides for pricing factors, margins, and courier routing speed." },
            { phase: "PHASE 4", name: "Autonomous Business AI", status: "Future", desc: "Automate supply orders and ad budget allocations via AI agents." }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#0C1224]/50 relative space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-purple-400 tracking-wider">{item.phase}</span>
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  item.status === 'Active' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                  'bg-white/5 text-text-muted'
                }`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.name}</h4>
              <p className="text-[10px] text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full border-t border-white/5 bg-[#050811] relative z-10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Newsletter */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-purple-650/15 border border-purple-500/20 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-extrabold tracking-tight text-white">BusinessVerse <span className="text-[#06B6D4]">AI</span></span>
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed max-w-sm">
              The living operational twin engine. Map data to physical systems and model growth metrics dynamically.
            </p>
            <div className="pt-2">
              <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-2">Subscribe to Twin Updates</div>
              <div className="flex items-center space-x-2 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-purple-500 w-full"
                />
                <button className="p-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white cursor-pointer border-none flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 2-5: Directory Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-3">Product</div>
              <ul className="space-y-2 text-[10px] text-text-muted list-none p-0">
                <li><a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem Mapping</a></li>
                <li><a href="#simulation" className="hover:text-white transition-colors">Sandbox Simulator</a></li>
                <li><a href="#ceo-showcase" className="hover:text-white transition-colors">AI CEO Engine</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-3">Resources</div>
              <ul className="space-y-2 text-[10px] text-text-muted list-none p-0">
                <li><span className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1"><FileCode className="w-3 h-3" /><span>API Registry</span></span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1"><Code className="w-3 h-3" /><span>Developer Docs</span></span></li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-3">Company</div>
              <ul className="space-y-2 text-[10px] text-text-muted list-none p-0">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Mission</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Security Sandbox</span></li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-3">Legal</div>
              <ul className="space-y-2 text-[10px] text-text-muted list-none p-0">
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Charter</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[9px] text-text-muted space-y-3 sm:space-y-0">
          <span>&copy; {new Date().getFullYear()} BusinessVerse AI Inc. All Rights Reserved. Built with React, FastAPI, Tailwind CSS, Recharts, and Gemini.</span>
          <div className="flex items-center space-x-4">
            <span className="cursor-pointer hover:text-white">GitHub Ledger</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-white font-bold text-[#06B6D4] flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Operational Twin v1.1.0</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple SlidersIcon fallback
const SlidersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="2" y1="14" x2="6" y2="14" />
    <line x1="10" y1="8" x2="14" y2="8" />
    <line x1="18" y1="16" x2="22" y2="16" />
  </svg>
);
