import React, { useState } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Sparkles, 
  Calendar, 
  Search, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Percent,
  Download,
  Share2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, BarChart, Bar, RadialBarChart, RadialBar 
} from 'recharts';

export const AnalyticsCenterView: React.FC = () => {
  const { 
    monthlyData, 
    summary, 
    priceMultiplier, 
    marketingBudget, 
    employeesHired,
    alerts 
  } = useBusinessState();

  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'quarter'>('30days');
  const [drillTarget, setDrillTarget] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [compareActive, setCompareActive] = useState(false);
  const [widgetVisibility, setWidgetVisibility] = useState({
    health: true,
    charts: true,
    alerts: true
  });

  // Dynamic calculations based on state
  const payroll = employeesHired * 3800 * 12;
  const healthScore = Math.round(summary.avgSatisfaction);
  const costOfGoodsSold = summary.totalOrders * 45;
  const netOperatingOverhead = payroll + (marketingBudget * 12);

  // Compare mode dataset builder
  const chartData = monthlyData.map((d, idx) => {
    // Generate simulated previous year/period metrics by offsetting current metrics
    const prevRevenue = Math.round(d.revenue * 0.88 - (idx % 2 === 0 ? 2000 : -1500));
    const prevProfit = Math.round(d.profit * 0.82 - (idx % 3 === 0 ? 1000 : -800));
    return {
      ...d,
      prevRevenue,
      prevProfit
    };
  });

  // Drilldown breakdown details
  const renderDrilldownDrawer = () => {
    if (!drillTarget) return null;

    let drillTitle = '';
    let details: React.ReactNode = null;

    if (drillTarget === 'revenue') {
      drillTitle = 'Revenue Breakdown';
      details = (
        <div className="space-y-3 text-xs text-text-muted">
          <p>Analyzing storefront checkout channels and pricing variables:</p>
          <div className="p-3 bg-gray-900 border border-border-glass rounded-xl space-y-2">
            <div className="flex justify-between font-bold text-text-white">
              <span>Main Store Front:</span>
              <span>82% ($${Math.round(summary.totalRevenue * 0.82).toLocaleString()})</span>
            </div>
            <div className="flex justify-between">
              <span>Branch Courier Dispatches:</span>
              <span>18% ($${Math.round(summary.totalRevenue * 0.18).toLocaleString()})</span>
            </div>
            <div className="flex justify-between border-t border-border-glass pt-2 text-[10px]">
              <span>Average pricing multiplier:</span>
              <span>{priceMultiplier.toFixed(2)}x</span>
            </div>
          </div>
        </div>
      );
    } else if (drillTarget === 'profit') {
      drillTitle = 'Net Margins & EBITDA';
      details = (
        <div className="space-y-3 text-xs text-text-muted">
          <p>Operating cash outlays analysis:</p>
          <div className="p-3 bg-gray-900 border border-border-glass rounded-xl space-y-1.5">
            <div className="flex justify-between">
              <span>Cost of Goods Sold (COGS):</span>
              <span className="text-text-white">${costOfGoodsSold.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Staff Payroll (Wages):</span>
              <span className="text-text-white">${payroll.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing Campaigns:</span>
              <span className="text-text-white">${(marketingBudget * 12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border-glass pt-1.5 font-bold text-text-white">
              <span>Total Overhead Expenses:</span>
              <span>${(costOfGoodsSold + netOperatingOverhead).toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    } else if (drillTarget === 'inventory') {
      drillTitle = 'Warehouse & Safety buffers';
      details = (
        <div className="space-y-3 text-xs text-text-muted">
          <p>Fulfillment stock safety metrics:</p>
          <div className="p-3 bg-gray-900 border border-border-glass rounded-xl space-y-1.5">
            <div className="flex justify-between">
              <span>Fulfillment rate:</span>
              <span className="text-text-white">{summary.avgSatisfaction}%</span>
            </div>
            <div className="flex justify-between">
              <span>Year-end ending safety stock:</span>
              <span className="text-text-white">{summary.endingInventory} units</span>
            </div>
            <div className="flex justify-between">
              <span>Buffer rate setting:</span>
              <span className="text-text-white">{monthlyData[0]?.inventory ?? 0} buffer</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-y-0 right-0 w-80 bg-gray-950/95 border-l border-border-glass shadow-2xl z-50 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-border-glass mb-4">
            <h3 className="text-sm font-bold text-text-white flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              {drillTitle}
            </h3>
            <button 
              onClick={() => setDrillTarget(null)}
              className="text-xs text-text-muted hover:text-text-white cursor-pointer focus:outline-none"
            >
              Close
            </button>
          </div>
          {details}
        </div>
        <Button variant="outline" size="sm" onClick={() => setDrillTarget(null)} className="w-full justify-center">
          Dismiss
        </Button>
      </div>
    );
  };

  // Radial chart health score breakdown dataset
  const healthBreakdownData = [
    { name: 'Finance', value: summary.totalProfit > 0 ? 94 : 45, fill: '#8b5cf6' },
    { name: 'Sales', value: priceMultiplier > 1.3 ? 72 : 95, fill: '#06b6d4' },
    { name: 'Warehouse', value: 88, fill: '#f59e0b' },
    { name: 'Customers', value: Math.round(summary.avgSatisfaction), fill: '#22c55e' }
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto relative select-none">
      {/* Side Drilldown Drawer overlay */}
      {renderDrilldownDrawer()}

      {/* Header Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center space-y-4 xl:space-y-0 shrink-0">
        <div>
          <h2 className="text-lg font-black text-text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2.5 text-purple-400" />
            Advanced Decision Intelligence Command Center
          </h2>
          <p className="text-xs text-text-muted">High-fidelity corporate telemetry and projection ledger logs.</p>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search reports/customers..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-gray-950 border border-border-glass rounded-xl pl-9 pr-4 py-2 text-[10px] text-text-white placeholder-text-muted focus:outline-none focus:border-purple-500 w-44"
            />
          </div>

          <div className="flex space-x-1 bg-gray-950 p-0.5 rounded-lg border border-border-glass">
            {['today', '7days', '30days', 'quarter'].map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f as any)}
                className={`text-[10px] px-2.5 py-1.5 rounded-md font-bold transition-all cursor-pointer focus:outline-none ${
                  dateFilter === f ? 'bg-purple-600 text-text-white shadow' : 'text-text-muted hover:text-text-white'
                }`}
              >
                {f === 'today' ? 'Today' : f === '7days' ? '7D' : f === '30days' ? '30D' : 'Q1'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCompareActive(!compareActive)}
            className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer focus:outline-none flex items-center space-x-1.5 ${
              compareActive ? 'bg-purple-600 border-purple-500 text-text-white' : 'bg-gray-950 border-border-glass text-text-muted hover:text-text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{compareActive ? 'Deactivate YoY' : 'Compare YoY'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI: Revenue */}
        <div 
          onClick={() => setDrillTarget('revenue')}
          className="glass-panel border border-border-glass rounded-3xl p-5 hover:border-purple-500/30 transition-all cursor-pointer space-y-2 group shadow-xl"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Gross Annual Revenue</span>
            <Badge variant="purple">+{compareActive ? '12%' : '8%'}</Badge>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-black text-text-white group-hover:text-purple-400 transition-colors">
              ${summary.totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[9px] text-text-muted leading-relaxed">
            AI Insight: Revenue holds healthy margins due to branch channel traffic.
          </p>
        </div>

        {/* KPI: Net Profit */}
        <div 
          onClick={() => setDrillTarget('profit')}
          className="glass-panel border border-border-glass rounded-3xl p-5 hover:border-purple-500/30 transition-all cursor-pointer space-y-2 group shadow-xl"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Net Profit Runway</span>
            <Badge variant={summary.totalProfit >= 0 ? 'emerald' : 'rose'}>
              {summary.totalProfit >= 0 ? '+15%' : '-8%'}
            </Badge>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-xl font-black transition-colors ${summary.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${summary.totalProfit.toLocaleString()}
            </span>
          </div>
          <p className="text-[9px] text-text-muted leading-relaxed">
            AI Insight: Fixed overhead rents represent the primary operational cost outlier.
          </p>
        </div>

        {/* KPI: Orders fulfilled */}
        <div 
          onClick={() => setDrillTarget('inventory')}
          className="glass-panel border border-border-glass rounded-3xl p-5 hover:border-purple-500/30 transition-all cursor-pointer space-y-2 group shadow-xl"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Order Dispatches</span>
            <Badge variant="cyan">+{Math.round(summary.totalOrders / 120)}%</Badge>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-black text-text-white group-hover:text-cyan-400 transition-colors">
              {summary.totalOrders.toLocaleString()} units
            </span>
          </div>
          <p className="text-[9px] text-text-muted leading-relaxed">
            AI Insight: Order checkouts velocity peak in winter season seasonality.
          </p>
        </div>

        {/* KPI: Customers Satisfaction */}
        <div 
          onClick={() => setDrillTarget('revenue')}
          className="glass-panel border border-border-glass rounded-3xl p-5 hover:border-purple-500/30 transition-all cursor-pointer space-y-2 group shadow-xl"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Customer Satisfaction</span>
            <Badge variant={summary.avgSatisfaction >= 80 ? 'emerald' : 'amber'}>
              {summary.avgSatisfaction}% Sat
            </Badge>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-black text-text-white group-hover:text-purple-400 transition-colors">
              {summary.avgSatisfaction}%
            </span>
          </div>
          <p className="text-[9px] text-text-muted leading-relaxed">
            AI Insight: Logistics courier pipelines maintain fulfillment rates above boundaries.
          </p>
        </div>
      </div>

      {/* Main visual panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Area Chart Workspace - Span 8 */}
        {widgetVisibility.charts && (
          <div className="lg:col-span-8 glass-panel border border-border-glass rounded-3xl p-6 shadow-2xl space-y-6 bg-gray-950/20">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-text-white">Annual Financial Runways & YoY Compares</h3>
                <p className="text-[10px] text-text-muted">Projections charting margins, gross sales, and YoY comparison bounds.</p>
              </div>
              <Badge variant="purple">Recharts Vector</Badge>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '10px' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  
                  {/* Current Year Lines */}
                  <Area type="monotone" name="Revenue (CY)" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" name="Net Profit (CY)" dataKey="profit" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />

                  {/* Previous Year Comparison Lines (Dashed) */}
                  {compareActive && (
                    <>
                      <Area type="monotone" name="Revenue (PY)" dataKey="prevRevenue" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
                      <Area type="monotone" name="Net Profit (PY)" dataKey="prevProfit" stroke="#86efac" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insight Capsule */}
            <div className="bg-purple-950/15 border border-purple-500/20 p-4 rounded-2xl flex items-start space-x-3 shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0 animate-pulse" />
              <div>
                <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Forecast Insight</h4>
                <p className="text-[11px] text-text-white mt-1 leading-relaxed">
                  Revenue is trending up {compareActive ? '12%' : '8%'} YoY. Customer acquisition costs stand at $14.20. Trimming marketing budget by 10% will increase EBITDA margin to 42% next quarter.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Right Health Score Radial Gauge - Span 4 */}
        {widgetVisibility.health && (
          <div className="lg:col-span-4 glass-panel border border-border-glass rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-text-white">Business Health Analyzer</h3>
              <p className="text-[10px] text-text-muted">Department efficiency index breakdowns.</p>
            </div>

            {/* Large Radial gauge */}
            <div className="h-[180px] w-full flex items-center justify-center relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <span className="text-xl font-black text-text-white">{healthScore}/100</span>
                <span className="text-[8px] text-emerald-450 font-extrabold uppercase tracking-widest mt-0.5">Optimal</span>
              </div>
              <RadialBarChart 
                width={180} 
                height={180} 
                innerRadius="35%" 
                outerRadius="95%" 
                data={healthBreakdownData} 
                startAngle={90} 
                endAngle={-270}
                barSize={8}
              >
                <RadialBar 
                  background={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                  dataKey="value" 
                  cornerRadius={4}
                />
              </RadialBarChart>
            </div>

            {/* Health Breakdown progress indicators */}
            <div className="space-y-2.5">
              {[
                { label: 'Finance Operations', value: summary.totalProfit > 0 ? 94 : 45, color: 'bg-purple-500' },
                { label: 'Storefront & Pricing', value: priceMultiplier > 1.3 ? 72 : 95, color: 'bg-cyan-500' },
                { label: 'Warehouse & Logistics', value: 88, color: 'bg-amber-500' },
                { label: 'Retention & Satisfaction', value: Math.round(summary.avgSatisfaction), color: 'bg-emerald-500' }
              ].map((dep, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-text-muted">{dep.label}</span>
                    <span className="text-text-white">{dep.value}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${dep.color}`} 
                      style={{ width: `${dep.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
