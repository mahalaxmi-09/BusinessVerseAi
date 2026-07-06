import React from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { Sliders, HelpCircle, DollarSign, Users, Award, ShieldAlert, ShoppingCart } from 'lucide-react';

export const SimulationPanel: React.FC = () => {
  const {
    priceMultiplier,
    marketingBudget,
    employeesHired,
    branchesOpen,
    inventoryBuffer,
    setPriceMultiplier,
    setMarketingBudget,
    setEmployeesHired,
    setBranchesOpen,
    setInventoryBuffer,
    isLoading
  } = useBusinessState();

  const sliders = [
    {
      title: 'Pricing Multiplier',
      icon: DollarSign,
      value: priceMultiplier,
      min: 0.5,
      max: 2.0,
      step: 0.05,
      formatter: (val: number) => `${val.toFixed(2)}x`,
      onChange: setPriceMultiplier,
      description: 'Markup relative to market standard price ($120).'
    },
    {
      title: 'Monthly Marketing Budget',
      icon: Award,
      value: marketingBudget,
      min: 200,
      max: 10000,
      step: 100,
      formatter: (val: number) => `$${val.toLocaleString()}`,
      onChange: setMarketingBudget,
      description: 'Spend to acquire new customer leads and traffic.'
    },
    {
      title: 'Headcount (Employees)',
      icon: Users,
      value: employeesHired,
      min: 1,
      max: 50,
      step: 1,
      formatter: (val: number) => `${val} staff`,
      onChange: setEmployeesHired,
      description: 'Workers. Caps monthly order processing capacity (120/staff).'
    },
    {
      title: 'Store Branches',
      icon: ShoppingCart,
      value: branchesOpen,
      min: 1,
      max: 5,
      step: 1,
      formatter: (val: number) => `${val} active`,
      onChange: setBranchesOpen,
      description: 'Physical locations. Multiplies demand but adds fixed overhead ($6k/branch).'
    },
    {
      title: 'Inventory Buffer Rate',
      icon: ShieldAlert,
      value: inventoryBuffer,
      min: 0.2,
      max: 2.0,
      step: 0.1,
      formatter: (val: number) => `${val.toFixed(1)}x`,
      onChange: setInventoryBuffer,
      description: 'Target stocking multiple. Low rates cause stockouts.'
    }
  ];

  return (
    <div className="w-full rounded-3xl glass-panel border border-border-glass p-6 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-border-glass">
        <div className="p-2 rounded-xl bg-gray-900 border border-border-glass text-purple-400">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-white">Business Simulation Levers</h3>
          <p className="text-[10px] text-text-muted">Tweak parameters to project business trajectories</p>
        </div>
        {isLoading && (
          <div className="ml-auto flex items-center space-x-1.5 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-ping"></span>
            <span className="text-[9px] font-semibold text-purple-400">Simulating...</span>
          </div>
        )}
      </div>

      {/* Sliders List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6">
        {sliders.map((s, idx) => (
          <div key={idx} className="space-y-2 group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text-white flex items-center group-hover:text-purple-400 transition-colors">
                <s.icon className="w-4 h-4 mr-2 text-text-muted group-hover:text-purple-400 transition-colors" />
                {s.title}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-gray-800 border border-border-glass text-text-white group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-all">
                {s.formatter(s.value)}
              </span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(e) => s.onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all focus:outline-none"
              />
            </div>
            
            <p className="text-[10px] text-text-muted leading-relaxed pl-6">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
