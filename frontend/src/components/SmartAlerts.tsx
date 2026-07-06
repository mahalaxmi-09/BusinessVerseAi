import React from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { AlertCircle, AlertTriangle, Info, BellRing, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SmartAlerts: React.FC = () => {
  const { alerts } = useBusinessState();

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          border: 'border-rose-500/20',
          bg: 'bg-rose-500/5',
          text: 'text-rose-400',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: AlertCircle
        };
      case 'warning':
        return {
          border: 'border-amber-500/20',
          bg: 'bg-amber-500/5',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: AlertTriangle
        };
      case 'info':
      default:
        return {
          border: 'border-cyan-500/20',
          bg: 'bg-cyan-500/5',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          icon: Info
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div className="w-full rounded-3xl glass-panel border border-border-glass p-6 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-glass">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gray-900 border border-border-glass text-purple-400">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-white">Smart Alerts Inbox</h3>
            <p className="text-[10px] text-text-muted">Real-time threat & capability detection</p>
          </div>
        </div>
        
        {/* Count badge */}
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600 text-text-white shadow-lg">
          {alerts.length} Active
        </span>
      </div>

      {/* Notifications log */}
      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-4"
            >
              <Info className="w-8 h-8 text-text-muted mb-2 animate-bounce" />
              <p className="text-xs text-text-muted font-medium">All systems operational.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {alerts.map((a) => {
                const styles = getPriorityStyle(a.priority);
                const Icon = styles.icon;
                
                return (
                  <motion.div
                    key={a.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -30 }}
                    className={`p-4 rounded-2xl border ${styles.border} ${styles.bg} transition-all duration-300 hover:scale-[1.01]`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-900 border border-border-glass ${styles.text}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-text-white">{a.title}</h4>
                            <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.25 rounded border ${styles.badge}`}>
                              {a.priority}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                            {a.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-border-glass text-[9px] text-text-muted flex items-center justify-center space-x-1">
        <Settings className="w-3.5 h-3.5" />
        <span>Configure alerting Webhooks and SMS channels in settings</span>
      </div>
    </div>
  );
};
