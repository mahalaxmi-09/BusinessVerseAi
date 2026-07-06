import React, { useState, useEffect, useRef } from 'react';
import { useBusinessState, ChatMessage } from '../contexts/BusinessContext';
import { 
  Sparkles, 
  Mic, 
  Send, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  ChevronDown,
  ChevronUp,
  User,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Badge } from './Badge';

export const AICEO: React.FC = () => {
  const { 
    messages, 
    askAICEO, 
    isLoading, 
    clearHistory,
    setPriceMultiplier,
    setMarketingBudget,
    setEmployeesHired,
    setBranchesOpen,
    setInventoryBuffer
  } = useBusinessState();

  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceWaveText, setVoiceWaveText] = useState('Listening...');
  const [expandedAdvice, setExpandedAdvice] = useState<Record<string, boolean>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    
    const query = inputVal;
    setInputVal('');
    await askAICEO(query);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExport = () => {
    const textLog = messages.map(m => {
      const header = `[${m.role.toUpperCase()} - ${m.timestamp.toLocaleTimeString()}]\n`;
      if (m.content) return header + m.content;
      if (m.advice) {
        return header + 
          `Summary: ${m.advice.summary}\n` +
          `Situation: ${m.advice.situation}\n` +
          `Root Cause: ${m.advice.root_cause}\n` +
          `Prediction: ${m.advice.prediction}\n` +
          `Recommendation: ${m.advice.recommendation}\n` +
          `Priority: ${m.advice.priority}\n` +
          `Outcome: ${m.advice.expected_outcome}`;
      }
      return '';
    }).join('\n\n');

    const blob = new Blob([textLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-CEO-Consultation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVoiceTrigger = () => {
    setVoiceActive(true);
    setVoiceWaveText('Capturing voice coordinates...');
    setTimeout(() => {
      setVoiceWaveText('Analyzing vocal patterns...');
      setTimeout(() => {
        setVoiceActive(false);
        setInputVal('Will I run out of inventory?');
      }, 1200);
    }, 1200);
  };

  const handleApplyAdvice = (recText: string) => {
    const text = recText.toLowerCase();
    if (text.includes('price') || text.includes('pricing')) {
      if (text.includes('1.2')) setPriceMultiplier(1.2);
      else if (text.includes('1.1')) setPriceMultiplier(1.1);
      else if (text.includes('1.3')) setPriceMultiplier(1.3);
      else setPriceMultiplier(1.2);
    }
    if (text.includes('employees') || text.includes('staff') || text.includes('headcount')) {
      const match = text.match(/\b\d+\b/);
      if (match) setEmployeesHired(parseInt(match[0], 10));
      else setEmployeesHired(10);
    }
    if (text.includes('marketing') || text.includes('spend')) {
      const match = text.match(/\b\d+,\d+\b|\b\d+\b/);
      if (match) setMarketingBudget(parseInt(match[0].replace(',', ''), 10));
      else setMarketingBudget(1800);
    }
    if (text.includes('inventory') || text.includes('buffer')) {
      setInventoryBuffer(1.2);
    }
    if (text.includes('branches') || text.includes('branch')) {
      setBranchesOpen(2);
    }
    alert('Strategic overrides successfully applied to simulator levers!');
  };

  const toggleAdviceExpand = (id: string) => {
    setExpandedAdvice(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const presetPrompts = [
    "How is my business today?",
    "Why are profits decreasing?",
    "Will I run out of inventory?",
    "Which department needs attention?",
    "What should I improve first?"
  ];

  return (
    <div className="w-full rounded-[18px] border border-border-glass overflow-hidden flex flex-col h-[560px] relative bg-[#151B2D]/40 backdrop-blur-md">
      
      {/* Voice wave modal */}
      <AnimatePresence>
        {voiceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#080B14]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-6"
          >
            <div className="flex items-center space-x-2">
              <span className="h-10 w-1 rounded bg-purple-500 animate-pulse" />
              <span className="h-16 w-1 rounded bg-purple-400 animate-pulse delay-75" />
              <span className="h-24 w-1 rounded bg-cyan-400 animate-pulse delay-150" />
              <span className="h-12 w-1 rounded bg-purple-400 animate-pulse delay-200" />
              <span className="h-6 w-1 rounded bg-purple-500 animate-pulse delay-300" />
            </div>
            <p className="text-[10px] font-bold text-text-white uppercase tracking-wider">{voiceWaveText}</p>
            <Button variant="outline" size="sm" onClick={() => setVoiceActive(false)}>
              Cancel
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="px-5 py-3 border-b border-border-glass flex justify-between items-center bg-[#101522]/60 shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-white">BusinessVerse AI CEO</h3>
            <span className="text-[9px] text-success-green font-bold flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-success-green mr-1.5 animate-ping" />
              Co-Pilot Active
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleExport}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-text-muted hover:text-text-white transition-colors cursor-pointer focus:outline-none"
            title="Export consult logs"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={clearHistory}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-text-muted hover:text-rose-400 transition-colors cursor-pointer focus:outline-none"
            title="Wipe memory log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message canvas scroll pane */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="bg-[#7C3AED]/15 border border-[#7C3AED]/30 px-3.5 py-2 rounded-2xl text-[11px] text-text-white max-w-[80%] shadow-md">
                {m.content}
              </div>
            ) : (
              <div className="w-full max-w-[95%] space-y-2">
                {m.content && (
                  <div className="bg-gray-900/30 border border-border-glass p-3 rounded-2xl text-[11px] text-text-white leading-relaxed">
                    {m.content}
                  </div>
                )}
                
                {m.advice && (
                  <div className="bg-[#151B2D]/60 border border-border-glass rounded-2xl p-4 space-y-3 shadow-md">
                    <div className="flex justify-between items-center border-b border-border-glass pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[9px] font-bold text-text-white uppercase tracking-wider">Executive Advice</span>
                      </div>
                      <Badge variant={m.advice.priority === 'Critical' ? 'rose' : m.advice.priority === 'High' ? 'amber' : 'purple'}>
                        {m.advice.priority}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h4 className="text-[8px] font-bold text-purple-400 uppercase tracking-widest">Summary</h4>
                        <p className="text-[11px] text-text-white font-bold mt-0.5">{m.advice.summary}</p>
                      </div>

                      {/* Main Action step */}
                      <div className="bg-purple-950/20 border border-purple-500/20 p-2.5 rounded-xl flex items-center justify-between mt-2">
                        <div className="min-w-0 flex-1 pr-3">
                          <h4 className="text-[8px] font-black text-purple-300 uppercase tracking-widest">Action Step</h4>
                          <p className="text-[10px] text-text-white mt-0.5 font-bold truncate">{m.advice.recommendation}</p>
                        </div>
                        <button
                          onClick={() => handleApplyAdvice(m.advice!.recommendation)}
                          className="px-2.5 py-1 bg-[#7C3AED] hover:bg-purple-700 text-text-white rounded-lg text-[9px] font-bold flex items-center space-x-1 cursor-pointer shrink-0 transition-colors shadow-md"
                        >
                          <Check className="w-3 h-3" />
                          <span>Apply</span>
                        </button>
                      </div>

                      {/* Expandable detailed drawer accordion */}
                      <div className="border-t border-border-glass/40 pt-2 mt-2">
                        <button
                          onClick={() => toggleAdviceExpand(m.id)}
                          className="flex items-center justify-between w-full text-[9px] font-bold text-text-muted hover:text-text-white cursor-pointer focus:outline-none"
                        >
                          <span>{expandedAdvice[m.id] ? 'Hide Diagnostics' : 'Review Diagnostics'}</span>
                          {expandedAdvice[m.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <AnimatePresence>
                          {expandedAdvice[m.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-2.5 pt-2"
                            >
                              <div>
                                <h4 className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Operational Context</h4>
                                <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{m.advice.situation}</p>
                              </div>
                              <div>
                                <h4 className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Root Cause</h4>
                                <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{m.advice.root_cause}</p>
                              </div>
                              <div>
                                <h4 className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Projected Outcome</h4>
                                <p className="text-[10px] text-cyan-400 mt-0.5 font-semibold bg-cyan-950/20 border border-cyan-800/20 px-2 py-1 rounded">
                                  {m.advice.expected_outcome}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900/30 border border-border-glass px-3.5 py-2.5 rounded-2xl flex items-center space-x-2 text-[10px] text-text-muted shadow-md">
              <span className="h-1 w-1 rounded-full bg-purple-400 animate-bounce" />
              <span className="h-1 w-1 rounded-full bg-purple-400 animate-bounce delay-75" />
              <span className="h-1 w-1 rounded-full bg-purple-400 animate-bounce delay-150" />
              <span>Analyzing projections...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested chips panel */}
      {messages.length === 1 && !isLoading && (
        <div className="px-5 pb-2 pt-1 flex flex-wrap gap-2 shrink-0 select-none">
          {presetPrompts.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setInputVal(preset)}
              className="text-[9px] px-2.5 py-1.5 rounded-full border border-border-glass hover:border-purple-500/20 text-text-muted hover:text-text-white transition-all cursor-pointer focus:outline-none bg-[#080B14]/40"
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {/* Raycast/Arc-style floating input box */}
      <form onSubmit={handleSend} className="p-4 border-t border-border-glass bg-[#101522]/30 shrink-0">
        <div className="flex items-center space-x-2 bg-[#080B14] border border-border-glass rounded-xl px-3 py-2">
          
          <button 
            type="button"
            onClick={handleVoiceTrigger}
            className="p-1 rounded-lg text-text-muted hover:text-purple-400 transition-colors cursor-pointer focus:outline-none"
            title="Voice coordinates input"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask AI CEO... (e.g. 'Predict next month's revenue')" 
            className="flex-grow bg-transparent border-none text-[11px] text-text-white placeholder-text-muted focus:outline-none py-0.5 px-1"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-1 rounded-lg text-text-muted hover:text-purple-400 disabled:opacity-50 transition-colors cursor-pointer focus:outline-none"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </div>
  );
};
