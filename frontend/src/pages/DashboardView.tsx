import React from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { DashboardKPI } from '../components/DashboardKPI';
import { BusinessWorld } from '../components/BusinessWorld';
import { AICEO } from '../components/AICEO';

export const DashboardView: React.FC = () => {
  const { 
    summary, 
    alerts, 
    priceMultiplier, 
    employeesHired,
    marketingBudget,
    branchesOpen 
  } = useBusinessState();

  const healthScore = Math.round(summary.avgSatisfaction);
  
  const getRecentActivities = () => {
    return [
      { text: `Pricing multiplier updated to ${priceMultiplier.toFixed(2)}x.`, time: 'Just now' },
      { text: `Marketing budget adjusted to $${marketingBudget.toLocaleString()}/mo.`, time: '1 min ago' },
      { text: `HR payroll scaled for ${employeesHired} active workers.`, time: '3 mins ago' },
      { text: `Fulfillment checks completed for ${branchesOpen} locations.`, time: '5 mins ago' }
    ];
  };

  return (
    <div className="space-y-6">
      {/* KPI cards grid */}
      <DashboardKPI />

      {/* Main Grid: World + AI CEO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-12">
          <BusinessWorld />
        </div>
        <div className="lg:col-span-12">
          <AICEO />
        </div>
      </div>

      {/* Health Score donut + Alerts counts + Recent activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Donut score */}
        <div className="glass-panel rounded-3xl p-6 border border-border-glass flex flex-col items-center justify-center text-center">
          <h4 className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider">Business Health Index</h4>
          <div className="relative h-28 w-28 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
              <circle 
                cx="56" 
                cy="56" 
                r="48" 
                stroke="#7C3AED" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - healthScore / 100)}
                strokeLinecap="round"
                className="glow-purple transition-all duration-1000"
              />
            </svg>
            <span className="text-3xl font-extrabold text-text-white">{healthScore}%</span>
          </div>
          <span className="text-xs font-semibold mt-4 text-purple-400">
            {healthScore > 80 ? 'Optimal Operations' : healthScore > 60 ? 'Moderate Levers' : 'Critical Restructuring Required'}
          </span>
        </div>

        {/* Alerts Summary */}
        <div className="glass-panel rounded-3xl p-6 border border-border-glass flex flex-col">
          <h4 className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider">Alert Summary</h4>
          <div className="flex-1 space-y-3 flex flex-col justify-center">
            <div className="flex justify-between items-center bg-gray-900/50 p-2.5 rounded-xl border border-border-glass">
              <span className="text-xs font-medium text-rose-400">Critical Warnings</span>
              <span className="text-xs font-bold text-text-white">{alerts.filter(a => a.priority === 'critical').length}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-900/50 p-2.5 rounded-xl border border-border-glass">
              <span className="text-xs font-medium text-amber-400">Warnings</span>
              <span className="text-xs font-bold text-text-white">{alerts.filter(a => a.priority === 'warning').length}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-900/50 p-2.5 rounded-xl border border-border-glass">
              <span className="text-xs font-medium text-cyan-400">Info Alerts</span>
              <span className="text-xs font-bold text-text-white">{alerts.filter(a => a.priority === 'info').length}</span>
            </div>
          </div>
        </div>

        {/* Recent Levers changes */}
        <div className="glass-panel rounded-3xl p-6 border border-border-glass flex flex-col">
          <h4 className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider">Recent System Levers</h4>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {getRecentActivities().map((act, idx) => (
              <div key={idx} className="flex justify-between items-start text-[10px]">
                <span className="text-text-muted">{act.text}</span>
                <span className="text-text-muted italic whitespace-nowrap ml-2">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
