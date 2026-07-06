import React, { useState } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar, Line } from 'recharts';
import { BarChart3, LineChart, TrendingUp, Package, Sparkles } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { monthlyData, summary, priceMultiplier, marketingBudget, employeesHired } = useBusinessState();
  const [chartType, setChartType] = useState<'financial' | 'inventory'>('financial');

  // Custom tooltips to match glassmorphism aesthetics
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-4 rounded-xl border border-border-glass shadow-2xl">
          <p className="text-xs font-bold text-text-white mb-2">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center space-x-6 text-[10px] py-0.5">
              <span style={{ color: p.color }} className="font-semibold">{p.name}:</span>
              <span className="font-bold text-text-white">
                {p.name.includes('Rate') || p.name.includes('Satisfaction')
                  ? `${p.value}%` 
                  : `$${p.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getFinancialInsight = () => {
    const maxProfitMonth = [...monthlyData].sort((a, b) => b.profit - a.profit)[0] || { month: 'Dec', profit: 0 };
    return `Annual profit runway is projected at $${summary.totalProfit.toLocaleString()}. Profit spikes peak in ${maxProfitMonth.month} ($${maxProfitMonth.profit.toLocaleString()}), aligning with peak holiday seasonality multiplier. Pricing is balanced at ${priceMultiplier.toFixed(2)}x.`;
  };

  const getInventoryInsight = () => {
    const totalStockouts = monthlyData.reduce((acc, d) => acc + d.stockouts, 0);
    if (totalStockouts > 200) {
      return `WARNING: Projected annual supply chain stockouts total ${totalStockouts} units. Your current buffer of ${monthlyData[0]?.inventory ?? 0} is depleting during peak season. Recommend increasing buffer.`;
    }
    return `Logistics are operating at optimal load. Workforce of ${employeesHired} staff can easily handle average throughput. Safety stock maintains a year-end cushion of ${summary.endingInventory} units.`;
  };

  return (
    <div className="w-full rounded-3xl glass-panel border border-border-glass p-6 flex flex-col h-[520px]">
      {/* Header with selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6 pb-4 border-b border-border-glass">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gray-900 border border-border-glass text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-white">Decision intelligence Forecasting</h3>
            <p className="text-[10px] text-text-muted">Projections generated via operational simulation model</p>
          </div>
        </div>

        {/* Chart View Toggle */}
        <div className="flex space-x-1 bg-gray-950 p-0.5 rounded-lg border border-border-glass">
          <button 
            onClick={() => setChartType('financial')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              chartType === 'financial' ? 'bg-purple-600 text-text-white shadow-md' : 'text-text-muted hover:text-text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Financial Runway</span>
          </button>
          <button 
            onClick={() => setChartType('inventory')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              chartType === 'inventory' ? 'bg-purple-600 text-text-white shadow-md' : 'text-text-muted hover:text-text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Supply Chain</span>
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="flex-1 min-h-0 w-full mb-4">
        {chartType === 'financial' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#FFFFFF' }} />
              <Area type="monotone" name="Monthly Revenue" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" name="Net Operating Profit" dataKey="profit" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#FFFFFF' }} />
              <Bar name="Orders Fulfilled" dataKey="orders" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              <Bar name="Warehouse Stock" dataKey="inventory" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI Insight Capsule */}
      <div className="bg-purple-950/15 border border-purple-500/20 p-4 rounded-2xl flex items-start space-x-3 shrink-0">
        <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Forecast Insight</h4>
          <p className="text-[11px] text-text-white mt-1 leading-relaxed">
            {chartType === 'financial' ? getFinancialInsight() : getInventoryInsight()}
          </p>
        </div>
      </div>
    </div>
  );
};
