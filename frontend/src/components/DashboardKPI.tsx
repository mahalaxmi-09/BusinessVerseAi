import React, { useEffect, useState } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { DollarSign, TrendingUp, Package, ShoppingBag, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { translate } from '../utils/translations';

// Custom CountUp Component with Indian en-IN grouping
const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string; isDecimal?: boolean }> = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  isDecimal = false 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 600; // faster animation for premium feel
    const startTime = performance.now();

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const current = start + (end - start) * easeProgress;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value]);

  const formatted = isDecimal 
    ? displayValue.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : Math.round(displayValue).toLocaleString('en-IN');

  return (
    <span>{prefix}{formatted}{suffix}</span>
  );
};

export const DashboardKPI: React.FC = () => {
  const { summary, currencySymbol, language } = useBusinessState();

  const cardItems = [
    {
      title: translate('business_health', language),
      value: summary.avgSatisfaction,
      prefix: '',
      suffix: '/100',
      isDecimal: false,
      icon: Activity,
      color: 'from-purple-500/10 to-indigo-500/5',
      iconColor: 'text-purple-400',
      description: translate('system_wide_index', language)
    },
    {
      title: translate('annual_revenue', language),
      value: summary.totalRevenue,
      prefix: currencySymbol,
      suffix: '',
      isDecimal: false,
      icon: DollarSign,
      color: 'from-cyan-500/10 to-blue-500/5',
      iconColor: 'text-cyan-400',
      description: translate('gross_turnover', language)
    },
    {
      title: translate('monthly_profit', language),
      value: summary.totalProfit,
      prefix: currencySymbol,
      suffix: '',
      isDecimal: false,
      icon: TrendingUp,
      color: 'from-emerald-500/10 to-teal-500/5',
      iconColor: 'text-emerald-400',
      description: translate('net_returns', language)
    },
    {
      title: 'Active Orders',
      value: summary.totalOrders,
      prefix: '',
      suffix: '',
      isDecimal: false,
      icon: ShoppingBag,
      color: 'from-indigo-500/10 to-purple-500/5',
      iconColor: 'text-indigo-400',
      description: 'Dispatched orders throughout the year'
    },
    {
      title: 'Ending Inventory',
      value: summary.endingInventory,
      prefix: '',
      suffix: ' Units',
      isDecimal: false,
      icon: Package,
      color: 'from-amber-500/10 to-yellow-500/5',
      iconColor: 'text-amber-400',
      description: 'Procured stocks available'
    },
    {
      title: 'Customer Traffic',
      value: 487, // Pre-loaded customers count
      prefix: '',
      suffix: '',
      isDecimal: false,
      icon: Users,
      color: 'from-blue-500/10 to-indigo-500/5',
      iconColor: 'text-blue-400',
      description: 'Active consumer client footprint'
    }
  ];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
    >
      {cardItems.map((card, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="group relative rounded-[18px] p-5 glass-card overflow-hidden cursor-pointer flex flex-col justify-between border border-border-glass bg-[#151B2D]/40 hover:bg-[#1A2136]/50 transition-colors"
        >
          {/* Subtle accent blur overlay */}
          <div className={`absolute -inset-px bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10`} />
          
          <div className="flex justify-between items-center w-full">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-wider group-hover:text-text-white transition-colors duration-200">
                {card.title}
              </p>
              <h3 className="text-2xl font-black tracking-tight text-text-white">
                <AnimatedNumber 
                  value={card.value} 
                  prefix={card.prefix} 
                  suffix={card.suffix} 
                  isDecimal={card.isDecimal} 
                />
              </h3>
            </div>
            
            <div className={`p-2.5 rounded-xl bg-gray-950/40 border border-border-glass ${card.iconColor} group-hover:scale-105 transition-transform duration-200 shrink-0`}>
              <card.icon className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border-glass flex items-center justify-between text-[9px] text-text-muted">
            <span>{card.description}</span>
            {card.title === 'Monthly Profit' && (
              <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Healthy
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
