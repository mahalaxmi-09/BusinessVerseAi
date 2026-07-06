import React, { useState, useEffect } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { 
  Tv, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Clock, 
  BookOpen, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DemoPanel: React.FC = () => {
  const { 
    isDemoMode,
    presentationMode, 
    setPresentationMode, 
    setShowTour 
  } = useBusinessState();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentScriptIdx, setCurrentScriptIdx] = useState(0);

  // Timer countdown loop
  useEffect(() => {
    if (!isDemoMode) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  if (!isDemoMode) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const scriptSteps = [
    { title: "1. Command Dashboard", note: "Show ₹12.4 Cr TechNova baseline with custom YoY comparative analytics." },
    { title: "2. City Ecosystem", note: "Navigate to Business World. Highlight flow lines and alerts (e.g. Warehouse node glows)." },
    { title: "3. Strategic Advisor", note: "Open AI CEO. Tap 'Why are profits decreasing?' to review 7-part strategic advice." },
    { title: "4. Run Simulation", note: "Open Simulation. Click 'Holiday Discount' preset slider override and watch outcomes change." },
    { title: "5. Export Audits", note: "Open Reports. Select Executive Audit, run compilation logs, and export PDF." }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start space-y-2 select-none">
      
      {/* Floating control dock bar */}
      <div className="flex items-center space-x-2 p-1.5 rounded-full glass-panel border border-purple-500/30 bg-gray-950/95 shadow-xl">
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={`p-2 rounded-full cursor-pointer hover:bg-gray-800 text-purple-400 focus:outline-none flex items-center justify-center`}
          title="Open presenter controls"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-text-white font-black px-2.5 flex items-center border-r border-border-glass">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
          {formatTime(timeLeft)}
        </span>

        {/* Presentation layout toggler */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`p-2 rounded-full cursor-pointer hover:bg-gray-800 focus:outline-none flex items-center justify-center ${
            presentationMode ? 'text-purple-400 bg-purple-600/10' : 'text-text-muted'
          }`}
          title="Toggle Presentation Mode (hides sidebar)"
        >
          <Tv className="w-4 h-4" />
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={handleFullscreenToggle}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-800 text-text-muted focus:outline-none flex items-center justify-center"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Replay Welcome tour */}
        <button
          onClick={() => setShowTour(true)}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-800 text-text-muted focus:outline-none flex items-center justify-center"
          title="Replay welcome tour"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Script details card panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-72 rounded-3xl glass-panel border border-border-glass bg-gray-950/95 shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-text-white">Presenter Demo Script</span>
            </div>

            <div className="space-y-1.5">
              {scriptSteps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setCurrentScriptIdx(idx)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer text-[10px] ${
                    currentScriptIdx === idx 
                      ? 'border-purple-500/50 bg-purple-500/5 text-text-white' 
                      : 'border-border-glass hover:border-purple-500/20 text-text-muted hover:text-text-white'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{step.title}</span>
                    {currentScriptIdx > idx && <CheckCircle className="w-3.5 h-3.5 text-success-green" />}
                  </div>
                  {currentScriptIdx === idx && (
                    <p className="mt-1 text-[9px] leading-relaxed text-purple-300">
                      {step.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Next presenter note */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setCurrentScriptIdx(prev => (prev < 4 ? prev + 1 : 0))}
                className="text-[9px] text-purple-400 hover:text-purple-300 font-bold cursor-pointer focus:outline-none"
              >
                {currentScriptIdx === 4 ? 'Reset Script' : 'Next Script Checkpoint'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
