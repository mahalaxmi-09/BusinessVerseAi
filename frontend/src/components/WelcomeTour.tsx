import React, { useState } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export const WelcomeTour: React.FC = () => {
  const { showTour, setShowTour } = useBusinessState();
  const [step, setStep] = useState(1);

  if (!showTour) return null;

  const tourSteps = [
    {
      title: "Welcome to BusinessVerse AI",
      content: "This hackathon mode is preloaded with data files for TechNova Retail Pvt Ltd (₹12.4 Crore Revenue, ₹2.8 Crore Profit). Let's take a 60-second command center tour."
    },
    {
      title: "1. Living Digital Twin City",
      content: "Navigate to 'Business World' to view your 8 connected nodes (Store, Warehouse, Finance, HR, Suppliers, Logistics, Customers, Marketing) connected via live flowing lines."
    },
    {
      title: "2. Meet your AI CEO Co-Pilot",
      content: "Select 'AI CEO' to request structured operational audits. Tap suggestions chips like 'Why are profits decreasing?' to stream advice instantly."
    },
    {
      title: "3. Decision Simulation Levers",
      content: "Open 'Simulation' to adjust 10 parameters (price, marketing, wages, overheads). Click What-If scenarios like 'Holiday Discount' to see immediate effects."
    },
    {
      title: "4. Risk & Forecasting Sparklines",
      content: "View the simulated performance ledger and Recharts graphs. Risk indicators evaluate stockout or churn margins on every slider adjustment."
    },
    {
      title: "5. Command Analytics Center",
      content: "Click 'Analytics' to toggle YoY compares and click KPI cards to open deep-dive drill-down drawers."
    },
    {
      title: "6. Executive Reports Generator",
      content: "Open 'Reports' to select, compile, and download weekly or risk audit files formatted as advisory PDFs."
    }
  ];

  const currentStepData = tourSteps[step - 1];

  const handleNext = () => {
    if (step < tourSteps.length) {
      setStep(prev => prev + 1);
    } else {
      setShowTour(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="fixed bottom-6 right-6 w-80 rounded-3xl glass-panel border border-purple-500/50 shadow-2xl p-5 z-50 bg-gray-950/95"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-1.5 text-purple-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Presenter Guide</span>
          </div>
          <button 
            onClick={() => setShowTour(false)}
            className="p-1 rounded-lg hover:bg-gray-800 text-text-muted hover:text-text-white cursor-pointer transition-colors focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-black text-text-white">{currentStepData.title}</h4>
          <p className="text-[10px] text-text-muted leading-relaxed">{currentStepData.content}</p>
        </div>

        {/* Action Tray */}
        <div className="flex justify-between items-center border-t border-border-glass pt-3 text-[10px]">
          <span className="text-text-muted">Step {step} of {tourSteps.length}</span>
          <div className="flex items-center space-x-2">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="p-1.5 rounded-lg border border-border-glass text-text-muted hover:text-text-white cursor-pointer focus:outline-none flex items-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              className="text-[9px] font-bold py-1 px-3 flex items-center space-x-1"
            >
              <span>{step === tourSteps.length ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
