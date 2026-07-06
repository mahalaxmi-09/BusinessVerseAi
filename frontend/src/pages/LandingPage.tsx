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
  FileCode,
  Globe,
  Sliders,
  TrendingDown,
  LineChart
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface WorldCity {
  id: string;
  name: string;
  x: number;
  y: number;
  revenue: string;
  health: number;
  satisfaction: number;
}

interface ConfettiConf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Loading Screen State
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Digital Twin Core...');

  // Confetti Canvas & Easter Egg State
  const [logoClicks, setLogoClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiListRef = useRef<ConfettiConf[]>([]);

  // Background Constellation Canvas
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Presenter video playlist configs
  const [activeClip, setActiveClip] = useState<'clip1' | 'clip2'>('clip1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax Hero Mouse Movement Offset
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Time-of-day state for interactive sunburst canvas
  const [timeOfDay, setTimeOfDay] = useState<'predawn' | 'sunrise' | 'daytime' | 'dusk' | 'sunset' | 'night'>('dusk');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sunburstCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroMousePosRef = useRef({ x: -1000, y: -1000 });

  // Simulation Sliders
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1.2);
  const [marketingBudget, setMarketingBudget] = useState<number>(2000);
  const [simProfit, setSimProfit] = useState<number>(2350);
  const [simHealth, setSimHealth] = useState<number>(76);
  const [simAdvice, setSimAdvice] = useState<string>("Optimal profit balance. Healthy user retention active.");

  // AI CEO Chat Timeline States
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I am your AI CEO advisor. Ask me anything about your digital twin's current operations." }
  ]);
  const [ceoStatus, setCeoStatus] = useState<'idle' | 'thinking' | 'analyzing' | 'ready' | 'typing'>('idle');
  const [typedMessage, setTypedMessage] = useState('');
  const [pendingAdviceCard, setPendingAdviceCard] = useState<boolean>(false);

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

  // Ecosystem Nodes Connections
  const connections = [
    { from: 'CEO', to: 'Finance' },
    { from: 'CEO', to: 'Marketing' },
    { from: 'CEO', to: 'Store' },
    { from: 'CEO', to: 'Warehouse' },
    { from: 'CEO', to: 'Inventory' },
    { from: 'CEO', to: 'Suppliers' },
    { from: 'CEO', to: 'Employees' },
    { from: 'CEO', to: 'Customers' },
    { from: 'Finance', to: 'Store' },
    { from: 'Marketing', to: 'Store' },
    { from: 'Warehouse', to: 'Inventory' },
    { from: 'Suppliers', to: 'Warehouse' }
  ];

  // Scroll Timeline Tracker for Roadmap
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const roadmapSectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: roadmapSectionRef,
    offset: ["start end", "end start"]
  });
  
  const roadmapProgressSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 1. Initial Page Loading Timeline simulation
  useEffect(() => {
    const intervals = [
      { progress: 25, text: 'Mapping transaction pipelines...', delay: 600 },
      { progress: 50, text: 'Synchronizing warehouse stock telemetry...', delay: 1200 },
      { progress: 75, text: 'Instantiating Gemini AI Strategy Core...', delay: 1800 },
      { progress: 100, text: 'Ecosystem twin online ✓', delay: 2400 }
    ];

    intervals.forEach(item => {
      setTimeout(() => {
        setLoadingProgress(item.progress);
        setLoadingText(item.text);
      }, item.delay);
    });

    const completionTimer = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 2800);

    return () => {
      clearTimeout(completionTimer);
    };
  }, []);

  // 2. Parallax mouse tracking hook
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * 0.015;
      const y = (e.clientY - window.innerHeight / 2) * 0.015;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Background Constellation Network Simulation Canvas
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    let animationId: number;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
    const nodeCount = 45;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fill();
      });

      // Draw faint connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 3.5. Interactive Sunburst Canvas Emitter Effect
  useEffect(() => {
    const canvas = sunburstCanvasRef.current;
    if (!canvas) return;

    let animationId: number;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize 180 fiber optic strands fanning out in a semi-circle
    const strandCount = 180;
    const strands: Array<{
      baseAngle: number;
      length: number;
      speed: number;
      phase: number;
      width: number;
    }> = [];

    for (let i = 0; i < strandCount; i++) {
      const percent = i / (strandCount - 1);
      const angle = Math.PI * (0.12 + percent * 0.76); 
      strands.push({
        baseAngle: angle,
        length: Math.random() * 220 + 160,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        width: Math.random() * 1.2 + 0.6
      });
    }

    const getColors = (theme: typeof timeOfDay) => {
      switch (theme) {
        case 'predawn':
          return { line: 'rgba(13, 148, 136, 0.25)', dot: '#0D9488' };
        case 'sunrise':
          return { line: 'rgba(219, 39, 119, 0.3)', dot: '#F59E0B' };
        case 'daytime':
          return { line: 'rgba(6, 182, 212, 0.3)', dot: '#2563EB' };
        case 'dusk':
          return { line: 'rgba(249, 115, 22, 0.35)', dot: '#0891B2' };
        case 'sunset':
          return { line: 'rgba(239, 68, 68, 0.3)', dot: '#8B5CF6' };
        case 'night':
          return { line: 'rgba(109, 40, 217, 0.2)', dot: '#ffffff' };
        default:
          return { line: 'rgba(124, 58, 237, 0.3)', dot: '#06B6D4' };
      }
    };

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height;
      const themeColors = getColors(timeOfDay);

      const mouseX = heroMousePosRef.current.x;
      const mouseY = heroMousePosRef.current.y;

      strands.forEach((s) => {
        s.phase += s.speed;
        
        const swayAngle = s.baseAngle + Math.sin(s.phase) * 0.02;
        const defaultTipX = centerX + Math.cos(swayAngle) * s.length;
        const defaultTipY = centerY - Math.sin(swayAngle) * s.length;

        let tipX = defaultTipX;
        let tipY = defaultTipY;

        if (mouseX > -500 && mouseY > -500) {
          const dx = mouseX - defaultTipX;
          const dy = mouseY - defaultTipY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            const force = (220 - dist) / 220;
            tipX += dx * force * 0.45;
            tipY += dy * force * 0.45;
          }
        }

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const ctrlX = centerX + Math.cos(swayAngle) * (s.length * 0.4);
        const ctrlY = centerY - Math.sin(swayAngle) * (s.length * 0.4);
        
        ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        ctx.strokeStyle = themeColors.line;
        ctx.lineWidth = s.width;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(tipX, tipY, s.width * 2 + 1, 0, Math.PI * 2);
        ctx.fillStyle = themeColors.dot;
        ctx.shadowBlur = 10;
        ctx.shadowColor = themeColors.dot;
        ctx.fill();
        ctx.restore();
      });

      if (timeOfDay === 'night') {
        for (let i = 0; i < 15; i++) {
          const sx = (Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5) * canvas.width;
          const sy = (Math.cos(Date.now() * 0.0007 + i * 2) * 0.4 + 0.4) * canvas.height;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.random() * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [timeOfDay]);

  // 4. Logo Confetti Easter Egg Engine
  const handleLogoClick = () => {
    setLogoClicks(prev => {
      if (prev + 1 === 5) {
        setShowEasterEgg(true);
        triggerConfettiExplosion();
        setTimeout(() => setShowEasterEgg(false), 3000);
        return 0;
      }
      return prev + 1;
    });
  };

  const triggerConfettiExplosion = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const colors = ['#7C3AED', '#06B6D4', '#a855f7', '#0891b2', '#c084fc', '#67e8f9'];
    confettiListRef.current = [];

    // Spawn 120 confetti fragments
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 4;
      confettiListRef.current.push({
        x: window.innerWidth / 2,
        y: 80, // Logo y-position roughly
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // blast vector
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    let animationId: number;
    const updateConfetti = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;
      confettiListRef.current.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.15; // gravity pulls down
        c.vx *= 0.98; // air drag resistance
        c.rotation += c.rotationSpeed;

        if (c.y < canvas.height && c.x > 0 && c.x < canvas.width) {
          activeParticles++;
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((c.rotation * Math.PI) / 180);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(updateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    updateConfetti();
  };

  // 5. Presenter Video autoplay and observations
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.log("Autoplay check:", err);
      });
    }
  }, [activeClip, videoLoaded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
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

  const handleVideoEnded = () => {
    if (activeClip === 'clip1') {
      setActiveClip('clip2');
    }
  };

  // Synchronize the video element's muted property to the React state when activeClip or isMuted changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [activeClip, isMuted]);

  const onLaunchDashboard = () => {
    navigate('/login');
  };

  // 6. Simulation Sandbox state calculations
  useEffect(() => {
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

  // 7. AI CEO Multi-state thinking simulator
  const triggerChatResponse = (prompt: string, responseText: string) => {
    if (ceoStatus !== 'idle') return;
    
    // Add user prompt
    setChatMessages(prev => [...prev, { sender: 'user', text: prompt }]);
    setPendingAdviceCard(false);
    setCeoStatus('thinking');

    // State 1: Thinking...
    setTimeout(() => {
      setCeoStatus('analyzing');
      
      // State 2: Analyzing...
      setTimeout(() => {
        setCeoStatus('ready');
        
        // State 3: Ready! Type reply out letter-by-letter
        setTimeout(() => {
          setCeoStatus('typing');
          let currentText = '';
          let charIndex = 0;
          
          const typingInterval = setInterval(() => {
            currentText += responseText[charIndex];
            setTypedMessage(currentText);
            charIndex++;
            
            if (charIndex >= responseText.length) {
              clearInterval(typingInterval);
              setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
              setTypedMessage('');
              setCeoStatus('idle');
              setPendingAdviceCard(true); // display slide-in advice button override card
            }
          }, 25); // Speed of typing letters
          
        }, 1000);
      }, 1400);
    }, 1200);
  };

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#09090B] relative overflow-x-hidden text-text-white select-none font-sans">
      
      {/* 1. Custom AI Loading Screen Overlay */}
      <AnimatePresence>
        {isLoadingScreen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#09090B] z-[9999] flex flex-col items-center justify-center space-y-6"
          >
            {/* Spinning CPU Grid Logo */}
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="h-16 w-16 rounded-2xl border border-purple-500/25 flex items-center justify-center text-purple-400 bg-purple-950/10 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
              >
                <Cpu className="w-8 h-8" />
              </motion.div>
              <div className="absolute inset-0 rounded-2xl border border-cyan-400/20 animate-ping scale-110" />
            </div>

            {/* Title */}
            <div className="text-center space-y-2 max-w-xs">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">BusinessVerse AI</h3>
              <p className="text-[9px] text-[#06B6D4] font-bold uppercase tracking-wider h-4 animate-pulse">
                {loadingText}
              </p>
            </div>

            {/* Glowing progress meter */}
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                style={{ width: `${loadingProgress}%` }}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_8px_#06B6D4]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Confetti Canvas Overlay (Easter Egg) */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-[9990]"
      />

      {/* Easter Egg floating indicator popup */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full border border-purple-500 bg-purple-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] z-[9980]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>🚀 AI Mode Activated</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Nebula Constellation Canvas Background */}
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Soft floating background light beams (aurora) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px] animate-[pulse_10s_infinite_alternate]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-900/10 rounded-full blur-[140px] animate-[pulse_8s_infinite_alternate]" />
      </div>

      {/* Slow-Panning Animated Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:45px_45px] opacity-60 z-0 animate-[shimmer_15s_linear_infinite]" />

      {/* Header bar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-20 relative select-none">
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-transform"
          title="Click 5 times for a secret mode!"
        >
          <div className="p-1.5 rounded-lg bg-purple-650/15 border border-purple-500/20 text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">BusinessVerse <span className="text-[#06B6D4]">AI</span></span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-[10px] uppercase font-black tracking-wider text-text-muted">
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
        
        {/* Left Side: Parallax Typography and Button Slides */}
        <motion.div 
          style={{ x: mouseOffset.x, y: mouseOffset.y }}
          className="lg:col-span-7 space-y-7"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-extrabold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>Enterprise Decision Intelligence Engine</span>
          </div>

          {/* Staggered Line-by-Line Title Reveal */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="block"
            >
              See Your
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400"
            >
              Business Alive.
            </motion.span>
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
            <motion.div whileHover={{ y: -4, scale: 1.05 }} className="cursor-default transition-all duration-200">
              <div className="text-2xl font-black text-white">$1.2M+</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">Simulated Profits</div>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.05 }} className="cursor-default transition-all duration-200">
              <div className="text-2xl font-black text-white">10 Nodes</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">Ecosystem Grid</div>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.05 }} className="cursor-default transition-all duration-200">
              <div className="text-2xl font-black text-white">50+ Models</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">Decision Levers</div>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.05 }} className="cursor-default transition-all duration-200">
              <div className="text-2xl font-black text-white">98% Accuracy</div>
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">AI Projections</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side: Widescreen Presenter Video Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ rotateY: mouseOffset.x * 0.8, rotateX: -mouseOffset.y * 0.8 }}
          className="lg:col-span-5 w-full flex justify-center items-center relative z-10"
        >
          {/* Card Container */}
          <div 
            onClick={handleCardClick}
            className="w-full aspect-[16/9] rounded-[28px] bg-gradient-to-br from-[#101828]/95 to-[#070B17]/95 border border-purple-500/30 p-[1px] shadow-[0_0_30px_rgba(124,58,237,0.25)] relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] group cursor-pointer flex flex-col justify-between"
          >
            
            {/* Shimmer loading container */}
            <div className="absolute inset-0 bg-[#070B17] rounded-[28px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-cyan-950/10 to-transparent opacity-60 z-0" />
              {!videoLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] z-0" />
              )}
            </div>

            {/* Video component */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden z-1 bg-black">
              <video
                ref={videoRef}
                key={activeClip}
                src={activeClip === 'clip1' ? '/videos/clip1.mp4' : '/videos/clip2.mp4'}
                autoPlay
                muted={isMuted}
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover rounded-[28px] transition-all duration-500 scale-[1.01] group-hover:scale-105"
              />
            </div>

            {/* Overlays */}
            {/* Top Left Label */}
            <div className="absolute top-4 left-5 z-30 flex items-center space-x-1.5 bg-black/40 border border-white/5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-white tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span>BusinessVerse AI Live Demo</span>
            </div>

            {/* Clip Swapper */}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveClip(activeClip === 'clip1' ? 'clip2' : 'clip1'); }}
              className="absolute top-4 right-28 z-30 flex items-center space-x-1 bg-purple-650/30 border border-purple-500/30 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-purple-300 hover:bg-purple-500/40 transition-all cursor-pointer pointer-events-auto focus:outline-none"
            >
              <span>Swap to {activeClip === 'clip1' ? 'Demo Clip' : 'Intro Clip'}</span>
            </button>

            {/* Live Presentation badge */}
            <div className="absolute top-4 right-5 z-30 flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-rose-400 tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Live Presentation</span>
            </div>

            {/* Custom controls */}
            <div className="absolute bottom-4 left-5 right-5 z-30 flex justify-between items-end pointer-events-none">
              <div className="space-y-0.5">
                <div className="text-[11px] font-black text-white tracking-wide">Meet Ava – AI Business Consultant</div>
                <div className="text-[9px] text-text-muted">Watch a 30-second introduction to BusinessVerse AI</div>
              </div>
              
              <div className="flex items-center space-x-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Hover overlay text block */}
            <div className="absolute inset-0 bg-[#070B17]/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-20 rounded-[28px]">
              <div className="space-y-1 max-w-xs text-center pointer-events-none">
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
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070B17] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070B17] to-transparent z-10 pointer-events-none" />
          
          <div className="flex items-center justify-center space-x-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
            {[
              "ACME CORPORATE", "GLOBEX SOLUTIONS", "INITECH INDUSTRIES", "UMBRELLA LABS", 
              "STARK INDUSTRIES", "WAYNE ENTERPRISES", "CYBERDYNE INC", "TYRELL BIOTECH"
            ].map((company, idx) => (
              <span key={idx} className="text-xs font-black tracking-widest text-text-muted hover:text-purple-400 transition-colors duration-250 cursor-default select-none mx-6">
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
                      strokeWidth={isPathActive ? '1.5' : '1'}
                      className={isPathActive ? 'animate-[dash_10s_linear_infinite]' : ''}
                      strokeDasharray={isPathActive ? '4 4' : 'none'}
                    />
                    {/* Pulsing data packets traveling along paths */}
                    {isPathActive && (
                      <circle r="2.5" fill="#06B6D4">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={`M ${fromNode.x} ${fromNode.y} C ${(fromNode.x + toNode.x)/2} ${fromNode.y}, ${(fromNode.x + toNode.x)/2} ${toNode.y}, ${toNode.x} ${toNode.y}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render nodes */}
            {nodes.map((node) => {
              const isActive = hoveredNode === node.id;
              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase transition-all duration-300 cursor-pointer z-10 ${
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

          {/* Right Text */}
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

      {/* Problem & Solution Comparison */}
      <section id="problem" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">The Paradigm Shift</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">The Living Digital Twin</h2>
          <p className="text-xs text-text-muted leading-relaxed">How we translate static, flat numbers into interactive decision intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Static Past Card */}
          <motion.div 
            whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.3)', boxShadow: '0 20px 45px rgba(239, 68, 68, 0.1)' }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="p-8 rounded-3xl border border-rose-500/10 bg-gradient-to-b from-rose-950/5 to-rose-950/10 space-y-6 transition-all duration-300 cursor-default"
          >
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
          </motion.div>

          {/* Living Digital Twin Card */}
          <motion.div 
            whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(16, 185, 129, 0.3)', boxShadow: '0 20px 45px rgba(16, 185, 129, 0.1)' }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="p-8 rounded-3xl border border-emerald-500/10 bg-gradient-to-b from-emerald-950/5 to-emerald-950/10 space-y-6 transition-all duration-300 cursor-default"
          >
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
          </motion.div>
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
            <motion.div 
              key={idx} 
              whileHover={{ y: -6, scale: 1.03, borderColor: 'rgba(168, 85, 247, 0.3)', boxShadow: '0 15px 30px rgba(168, 85, 247, 0.1)' }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="p-6 rounded-2xl border border-white/5 bg-[#0A1021]/80 transition-all duration-300 relative group cursor-default"
            >
              <div className="text-2xl font-black text-purple-500/30 group-hover:text-purple-400 transition-colors duration-300">{item.step}</div>
              <h4 className="text-xs font-bold text-white mt-3 uppercase tracking-wider">{item.name}</h4>
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed">{item.desc}</p>
            </motion.div>
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
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 15px 30px rgba(12, 18, 36, 0.3)' }}
              className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 backdrop-blur-md space-y-6 transition-all duration-300"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-wider pb-3 border-b border-white/5 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-purple-400" />
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
            </motion.div>
          </div>

          {/* Right Metrics Display Card */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              className="p-6 rounded-3xl border border-white/5 bg-[#151B2D]/40 space-y-5 transition-all duration-300"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Simulated Outcomes</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Net Profit Metric */}
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 transition-all cursor-default"
                >
                  <div className="text-[10px] text-text-muted font-bold uppercase">Projected Net Profit</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">${simProfit.toLocaleString()}</div>
                </motion.div>

                {/* Health Metric */}
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 transition-all cursor-default"
                >
                  <div className="text-[10px] text-text-muted font-bold uppercase">Customer Health</div>
                  <div className="text-xl font-black text-white mt-1">{simHealth}/100</div>
                </motion.div>
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
            </motion.div>
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
                  className="w-full p-3.5 rounded-xl border border-white/5 bg-[#151B2D]/40 text-[10px] text-left hover:border-purple-500/40 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>"{item.prompt}"</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Console: Typing Chatbot Simulator */}
          <div className="lg:col-span-7">
            <div className="p-5 rounded-3xl border border-white/5 bg-[#0C1224]/60 backdrop-blur-md space-y-4 max-h-[380px] overflow-y-auto flex flex-col justify-between h-[340px] relative">
              
              {/* Inner messaging logs */}
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

                {/* Simulated Multistate thinking overlay */}
                {ceoStatus === 'thinking' && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-[#151B2D] text-[#a855f7] rounded-bl-none border border-white/5 text-[9px] flex items-center space-x-2 font-bold uppercase tracking-wider animate-pulse">
                      <Brain className="w-3.5 h-3.5 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}

                {ceoStatus === 'analyzing' && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-[#151B2D] text-[#06B6D4] rounded-bl-none border border-white/5 text-[9px] flex items-center space-x-2 font-bold uppercase tracking-wider animate-pulse">
                      <Activity className="w-3.5 h-3.5 animate-bounce" />
                      <span>Analyzing telemetry...</span>
                    </div>
                  </div>
                )}

                {ceoStatus === 'ready' && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-[#151B2D] text-emerald-400 rounded-bl-none border border-emerald-500/10 text-[9px] flex items-center space-x-2 font-bold uppercase tracking-wider">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recommendation Ready ✓</span>
                    </div>
                  </div>
                )}

                {ceoStatus === 'typing' && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-[#151B2D] text-text-muted rounded-bl-none border border-white/5 text-[10px] leading-relaxed">
                      {typedMessage}
                      <span className="inline-block w-1.5 h-3 bg-purple-400 ml-0.5 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              {/* Slide-in override card triggers when message completed */}
              <AnimatePresence>
                {pendingAdviceCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/10 flex items-center justify-between text-[9px] text-emerald-300 font-bold uppercase tracking-wide"
                  >
                    <span>Strategic Override coordinates mapped.</span>
                    <button 
                      onClick={() => {
                        setPriceMultiplier(1.4);
                        setMarketingBudget(3500);
                        setPendingAdviceCard(false);
                        alert('Sliders synchronized to AI recommendation parameters!');
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-[8px] cursor-pointer border-none"
                    >
                      Apply Override
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-3 border-t border-white/5 text-[9px] text-text-muted flex justify-between items-center shrink-0 select-none">
                <span className="flex items-center space-x-1">
                  <Brain className={`w-3.5 h-3.5 mr-1 ${ceoStatus !== 'idle' ? 'text-purple-400 animate-pulse' : 'text-text-muted'}`} />
                  <span>AI CEO Engine: Gemini Pro active node.</span>
                </span>
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
          <motion.div 
            whileHover={{ y: -6, scale: 1.01, borderColor: 'rgba(124, 58, 237, 0.3)', boxShadow: '0 15px 30px rgba(124, 58, 237, 0.1)' }}
            className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 space-y-4 transition-all duration-300"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs font-black text-white uppercase tracking-wider">Gross Sales Velocity</span>
              <span className="text-[10px] text-emerald-400 font-extrabold">↑ 18.5% YoY</span>
            </div>
            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
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
          </motion.div>

          {/* Business Health Chart Box */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01, borderColor: 'rgba(6, 182, 212, 0.3)', boxShadow: '0 15px 30px rgba(6, 182, 212, 0.1)' }}
            className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 space-y-4 transition-all duration-300"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs font-black text-white uppercase tracking-wider">Satisfaction Index Tracker</span>
              <span className="text-[10px] text-amber-500 font-extrabold">Stable (94/100)</span>
            </div>
            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
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
          </motion.div>
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
            { title: "Decision Simulations", desc: "Sliders that model prices, ad budgets, and logistics capacity speeds.", icon: Sliders, color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10" },
            { title: "Interactive World Twin", desc: "Watch physical inventory supply chain packets flow dynamically on a NYC grid.", icon: Network, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
            { title: "12-Month Projections", desc: "Generate predictive forecasts curves mapping sales conversions to costs.", icon: TrendingUp, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
            { title: "Structured PDF Reports", desc: "Compile full transaction statements and overhead breakdowns instantly.", icon: FileText, color: "text-[#ec4899] bg-[#ec4899]/5 border-[#ec4899]/10" },
            { title: "Logistics Flow Alerts", desc: "Automatic triggers call out stocks runouts and courier retention lags.", icon: ShieldCheck, color: "text-rose-400 bg-rose-500/5 border-rose-500/10" },
            { title: "Multi-Currency Ledger", desc: "Localized lookups handle USD, Rupee, and Euro exchange valuations.", icon: DollarSign, color: "text-teal-400 bg-teal-500/5 border-teal-500/10" },
            { title: "Modern Design Grid", desc: "Enjoy premium glassmorphic overlays and custom cursor draw paths.", icon: Layers, color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" }
          ].map((feat, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -8, scale: 1.03, borderColor: 'rgba(168, 85, 247, 0.3)', boxShadow: '0 20px 45px rgba(168, 85, 247, 0.15)' }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="p-6 rounded-3xl border border-white/5 bg-[#0C1224]/50 transition-all duration-300 group cursor-pointer"
            >
              <div className={`p-3 rounded-2xl border w-11 shrink-0 ${feat.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider mt-4 group-hover:text-purple-400 transition-colors">{feat.title}</h3>
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us (Storytelling) */}
      {/* About Us (Storytelling) */}
      <div 
        className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Left Side: Interactive Canvas Box */}
        <div 
          style={{ perspective: 1000 }}
          className="lg:col-span-6 h-[400px] bg-[#0C1224]/50 border border-white/5 rounded-3xl relative overflow-hidden flex justify-center items-center"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            heroMousePosRef.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            };
          }}
          onMouseLeave={() => {
            heroMousePosRef.current = { x: -1000, y: -1000 };
          }}
        >
          {/* Interactive Sunburst Canvas */}
          <canvas
            ref={sunburstCanvasRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-80"
          />

          {/* Floating Time of Day dropdown selector */}
          <div className="absolute top-4 right-6 z-30 flex flex-col items-end">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-1.5 rounded-full bg-black/40 border border-white/10 hover:bg-black/65 transition-colors flex items-center space-x-2 text-[10px] uppercase font-black text-white tracking-wider cursor-pointer focus:outline-none"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sky Mode: {timeOfDay}</span>
            </button>
            
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-1.5 p-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex flex-col space-y-0.5 min-w-[120px] shadow-2xl z-40"
                >
                  {(['predawn', 'sunrise', 'daytime', 'dusk', 'sunset', 'night'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setTimeOfDay(mode);
                        setDropdownOpen(false);
                      }}
                      className={`px-3 py-1.5 text-left rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer border-none ${
                        timeOfDay === mode 
                          ? 'bg-purple-650 text-white' 
                          : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="absolute bottom-4 left-4 p-3 rounded-xl border border-white/5 bg-[#070B17]/85 backdrop-blur-md text-[9px] text-text-muted z-20 pointer-events-none">
            Move cursor inside this box to warp the sunburst lines.
          </div>
        </div>

        {/* Right Side: Our Mission Text */}
        <div className="lg:col-span-6 space-y-6 text-left relative z-10">
          <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-widest">Our Mission</span>
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-black italic text-white leading-snug">
            "Businesses have always relied on numbers. Numbers explain the past. BusinessVerse AI lets you experience your business as a living ecosystem. Every department becomes interactive. Every decision becomes visual. Every prediction becomes actionable."
          </blockquote>
          <p className="text-xs text-text-muted leading-relaxed">
            BusinessVerse AI isn't another dashboard. It is your company's Digital Twin. We connect physical bottlenecks to profit margins so you can simulate growth limits before committing cash reserves.
          </p>
        </div>
      </div>

      {/* Roadmap Section */}
      <section id="roadmap" ref={roadmapSectionRef} className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Milestones</span>
          <h2 className="text-3xl font-black text-white">Project Roadmap</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Scroll-linked horizontal/vertical progress timeline indicator */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 hidden md:block z-0 overflow-hidden">
            <motion.div 
              style={{ scaleX: roadmapProgressSpring, transformOrigin: 'left' }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_8px_#06B6D4]"
            />
          </div>

          {[
            { phase: "PHASE 1", name: "Real-time twin monitoring", status: "Completed", desc: "Construct digital maps and link active transactions of warehouses and stores." },
            { phase: "PHASE 2", name: "AI Decision Intelligence", status: "Active", desc: "Integrate Gemini API models to output structured root cause prescriptions." },
            { phase: "PHASE 3", name: "Simulation Sandbox", status: "In Progress", desc: "Allow slider overrides for pricing factors, margins, and courier routing speed." },
            { phase: "PHASE 4", name: "Autonomous Business AI", status: "Future", desc: "Automate supply orders and ad budget allocations via AI agents." }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -6, scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.3)', boxShadow: '0 15px 30px rgba(168, 85, 247, 0.1)' }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="p-6 rounded-2xl border border-white/5 bg-[#0C1224]/50 relative space-y-4 transition-all duration-300 cursor-default z-10"
            >
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full border-t border-white/5 bg-[#050811] relative z-10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand & Newsletter */}
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
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-purple-500 w-full animate-all"
                />
                <button className="p-2 bg-purple-600 hover:bg-purple-550 rounded-xl text-white cursor-pointer border-none flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Directory Links */}
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
