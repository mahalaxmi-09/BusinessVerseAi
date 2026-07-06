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
      title: 'Total Revenue',
      value: summary.totalRevenue,
      prefix: currencySymbol,
      suffix: '',
      isDecimal: false,
      icon: DollarSign,
      color: 'from-purple-500/10 to-indigo-500/5',
      iconColor: 'text-purple-400',
      trendText: '↓ 6.2% vs last month',
      trendColor: 'text-rose-500',
      sparklinePath: 'M 0,25 Q 15,10 30,22 T 60,12 T 90,26 T 100,10',
      sparklineColor: '#8b5cf6'
    },
    {
      title: 'Net Profit',
      value: summary.totalProfit,
      prefix: currencySymbol,
      suffix: '',
      isDecimal: false,
      icon: TrendingUp,
      color: 'from-emerald-500/10 to-teal-500/5',
      iconColor: 'text-emerald-400',
      trendText: '↓ 4.1% vs last month',
      trendColor: 'text-rose-500',
      sparklinePath: 'M 0,28 Q 20,18 40,24 T 80,14 T 100,22',
      sparklineColor: '#22c55e'
    },
    {
      title: 'Active Orders',
      value: summary.totalOrders,
      prefix: '',
      suffix: '',
      isDecimal: false,
      icon: ShoppingBag,
      color: 'from-blue-500/10 to-indigo-500/5',
      iconColor: 'text-blue-400',
      trendText: '↓ 8.0% vs last month',
      trendColor: 'text-rose-500',
      sparklinePath: 'M 0,22 Q 10,28 30,16 T 70,26 T 100,12',
      sparklineColor: '#3b82f6'
    },
    {
      title: 'Inventory Value',
      value: summary.endingInventory * 45,
      prefix: currencySymbol,
      suffix: '',
      isDecimal: false,
      icon: Package,
      color: 'from-amber-500/10 to-yellow-500/5',
      iconColor: 'text-amber-400',
      trendText: '↓ 8.5% vs last month',
      trendColor: 'text-rose-500',
      sparklinePath: 'M 0,26 Q 25,12 50,22 T 80,10 T 100,26',
      sparklineColor: '#f59e0b'
    },
    {
      title: 'Customers',
      value: 1024,
      prefix: '',
      suffix: '',
      isDecimal: false,
      icon: Users,
      color: 'from-teal-500/10 to-emerald-500/5',
      iconColor: 'text-teal-400',
      trendText: '↑ 2.4% vs last month',
      trendColor: 'text-emerald-500',
      sparklinePath: 'M 0,20 Q 30,10 60,18 T 100,8',
      sparklineColor: '#06b6d4'
    },
    {
      title: translate('business_health', language),
      value: Math.round(summary.avgSatisfaction),
      prefix: '',
      suffix: '/100',
      isDecimal: false,
      icon: Activity,
      color: 'from-rose-500/10 to-purple-500/5',
      iconColor: 'text-rose-400',
      trendText: 'Stable',
      trendColor: 'text-amber-500',
      sparklinePath: 'M 0,16 Q 20,24 40,14 T 80,22 T 100,16',
      sparklineColor: '#ef4444'
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
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full"
    >
      {cardItems.map((card, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="group relative rounded-[18px] p-4 glass-card overflow-hidden cursor-pointer flex flex-col justify-between border border-border-glass bg-[#151B2D]/40 hover:bg-[#1A2136]/50 transition-colors"
        >
          {/* Subtle accent blur overlay */}
          <div className={`absolute -inset-px bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10`} />
          
          <div className="flex justify-between items-start w-full">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-text-muted uppercase tracking-wider group-hover:text-text-white transition-colors duration-200">
                {card.title}
              </p>
              <h3 className="text-xl font-black tracking-tight text-text-white mt-1">
                <AnimatedNumber 
                  value={card.value} 
                  prefix={card.prefix} 
                  suffix={card.suffix} 
                  isDecimal={card.isDecimal} 
                />
              </h3>
            </div>
            
            <div className={`p-2 rounded-xl bg-gray-950/40 border border-border-glass ${card.iconColor} group-hover:scale-105 transition-transform duration-200 shrink-0`}>
              <card.icon className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Trend stats */}
          <div className="mt-2 text-[9px] flex items-center space-x-1 font-semibold">
            <span className={card.trendColor}>{card.trendText}</span>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-8 w-full mt-3 overflow-hidden select-none">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d={card.sparklinePath}
                fill="none"
                stroke={card.sparklineColor}
                strokeWidth="1.5"
                className="sparkline-path"
              />
              <path
                d={`${card.sparklinePath} L 100 30 L 0 30 Z`}
                fill={`url(#grad-${idx})`}
                opacity="0.08"
              />
              <defs>
                <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={card.sparklineColor} />
                  <stop offset="100%" stopColor={card.sparklineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
