import React, { useState } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { 
  Store, 
  Warehouse, 
  Truck, 
  TrendingUp, 
  Users, 
  UserCheck, 
  Award, 
  ShieldCheck, 
  X, 
  Activity, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  AlertOctagon,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

type NodeId = 'store' | 'warehouse' | 'delivery' | 'finance' | 'employees' | 'customers' | 'marketing' | 'suppliers';

interface BuildingConfig {
  id: NodeId;
  title: string;
  icon: React.ComponentType<any>;
  hoverHint: string;
  getMiniKPI: (state: any) => string;
  getLiveActivity: (state: any) => string;
  getLastUpdate: () => string;
  getDetails: (state: any) => {
    overview: string;
    kpis: { label: string; value: string; trend?: string }[];
    recentActivity: string[];
    aiSummary: string;
    recommendation: string;
    forecastText: string;
  };
}

export const BusinessWorld: React.FC = () => {
  const state = useBusinessState();
  const { 
    priceMultiplier, 
    marketingBudget, 
    employeesHired, 
    branchesOpen, 
    inventoryBuffer,
    summary,
    monthlyData,
    alerts 
  } = state;

  const [activeNode, setActiveNode] = useState<NodeId | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);

  // Derive statuses for buildings
  const getStatus = (node: NodeId): 'healthy' | 'warning' | 'critical' => {
    switch (node) {
      case 'store':
        if (summary.avgSatisfaction < 70) return 'critical';
        if (summary.avgSatisfaction < 80) return 'warning';
        return 'healthy';
      case 'warehouse':
        if (alerts.some(a => a.id === 'alert-stockouts')) return 'critical';
        if (inventoryBuffer < 0.8) return 'warning';
        return 'healthy';
      case 'finance':
        if (summary.totalProfit < 0) return 'critical';
        if (summary.totalProfit < 20000) return 'warning';
        return 'healthy';
      case 'delivery':
        if (alerts.some(a => a.id === 'alert-labor')) return 'critical';
        return 'healthy';
      case 'employees':
        if (alerts.some(a => a.id === 'alert-labor')) return 'critical';
        if (employeesHired < 5) return 'warning';
        return 'healthy';
      case 'customers':
        if (summary.avgSatisfaction < 75) return 'critical';
        return 'healthy';
      case 'marketing':
        if (marketingBudget < 500) return 'warning';
        return 'healthy';
      case 'suppliers':
        if (inventoryBuffer < 0.6) return 'warning';
        return 'healthy';
    }
  };

  const getStatusColors = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/20',
          text: 'text-rose-400',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)] border-rose-500',
          pulse: 'bg-rose-500'
        };
      case 'warning':
        return {
          border: 'border-amber-500/50',
          bg: 'bg-amber-950/20',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)] border-amber-500',
          pulse: 'bg-amber-500'
        };
      case 'healthy':
      default:
        return {
          border: 'border-[#3c2a6b]/50',
          bg: 'bg-[#130e26]/85',
          text: 'text-[#B692C2]',
          glow: 'shadow-[0_0_16px_rgba(130,76,150,0.4)] border-[#824C96]/80',
          pulse: 'bg-purple-500'
        };
    }
  };

  // Node position map (scaled on viewBox 1000 x 500)
  const nodePositions = {
    customers: { x: 150, y: 85, left: '15%', top: '17%' },
    marketing: { x: 150, y: 250, left: '15%', top: '50%' },
    store: { x: 420, y: 85, left: '42%', top: '17%' },
    warehouse: { x: 420, y: 250, left: '42%', top: '50%' },
    delivery: { x: 420, y: 415, left: '42%', top: '83%' },
    finance: { x: 690, y: 100, left: '69%', top: '20%' },
    suppliers: { x: 690, y: 275, left: '69%', top: '55%' },
    employees: { x: 900, y: 185, left: '90%', top: '37%' }
  };

  const buildings: BuildingConfig[] = [
    {
      id: 'customers',
      title: 'Consumer Market',
      icon: UserCheck,
      hoverHint: 'Total consumer count & purchase parameters',
      getMiniKPI: (s) => `${s.summary.avgSatisfaction}% retention`,
      getLiveActivity: (s) => s.summary.avgSatisfaction > 80 ? 'High buyer affinity' : 'Churn risks high',
      getLastUpdate: () => 'Real-time feed',
      getDetails: (s) => ({
        overview: 'Aggregates buyer profiles, transaction frequencies, and purchase retention metrics.',
        kpis: [
          { label: 'Satisfaction index', value: `${s.summary.avgSatisfaction}%`, trend: s.summary.avgSatisfaction > 80 ? '↑ 2.4%' : '↓ 5.1%' },
          { label: 'Market demand', value: `${Math.round(s.monthlyData.reduce((acc: any, d: any) => acc + d.customers, 0) / 12)} /mo` }
        ],
        recentActivity: [
          'Buyer checkout delays analyzed.',
          'Customer satisfaction triggers resolved.'
        ],
        aiSummary: 'Demand elasticity indicates high resistance at current price multiplier. Recalibrate prices to optimize retention.',
        recommendation: 'Target a customer satisfaction rating above 85% to maintain organic referral networks.',
        forecastText: 'Retention index will remain stable if fulfillment rate stands above 90%.'
      })
    },
    {
      id: 'marketing',
      title: 'Marketing Ops',
      icon: Award,
      hoverHint: 'Lead capture & budget allocation',
      getMiniKPI: (s) => `$${s.marketingBudget.toLocaleString()}/mo`,
      getLiveActivity: (s) => s.marketingBudget > 1000 ? 'Active campaigns online' : 'Funnel underfunded',
      getLastUpdate: () => 'Ad server synced',
      getDetails: (s) => ({
        overview: 'Coordinates organic SEO campaigns, paid advertisements, and brand reach funnels.',
        kpis: [
          { label: 'Spend index', value: `$${s.marketingBudget}/mo` },
          { label: 'Traffic scaling', value: `${(1 + 0.45 * Math.log(s.marketingBudget / 500 + 1)).toFixed(2)}x rate` }
        ],
        recentActivity: [
          'PPC budget successfully synchronized.',
          'Conversion optimization vectors updated.'
        ],
        aiSummary: 'Marketing spend efficiency scales logarithmically. Budgets above $3,500 yield diminishing incremental demand per dollar.',
        recommendation: 'Scale marketing to $1,800/mo to balance brand exposure with overhead requirements.',
        forecastText: 'Monthly traffic is projected to grow by 12% next month under current allocation.'
      })
    },
    {
      id: 'store',
      title: 'Retail Storefront',
      icon: Store,
      hoverHint: 'Consumer storefront & order checkout processing',
      getMiniKPI: (s) => `$${Math.round(s.summary.totalRevenue / 12).toLocaleString()}/mo`,
      getLiveActivity: (s) => `Processing ${s.summary.totalOrders > 0 ? Math.round(s.summary.totalOrders / 12) : 0} checkouts/mo`,
      getLastUpdate: () => 'POS Terminal online',
      getDetails: (s) => ({
        overview: 'Main storefront operations, branch expansion, and unit checkout processing.',
        kpis: [
          { label: 'Pricing Markup', value: `${s.priceMultiplier.toFixed(2)}x` },
          { label: 'Active Branches', value: `${s.branchesOpen} locations` }
        ],
        recentActivity: [
          'Store registers reconciled.',
          'Branch overhead checks successfully complete.'
        ],
        aiSummary: 'Branches add $6,000/mo in fixed overhead. Price markups above 1.4x reduce unit throughput below optimal capacity.',
        recommendation: 'Open branch 2 only if net profit margins on branch 1 consistently exceed $25,000.',
        forecastText: 'Expected store traffic is projected to peak during November/December holiday season.'
      })
    },
    {
      id: 'warehouse',
      title: 'Central Warehouse',
      icon: Warehouse,
      hoverHint: 'Inventory buffer, lead times & stockouts',
      getMiniKPI: (s) => `${Math.round(s.summary.endingInventory).toLocaleString()} units`,
      getLiveActivity: (s) => 'Inbound restock sorting',
      getLastUpdate: () => 'Stock database synchronized',
      getDetails: (s) => ({
        overview: 'Central distribution hub managing product sorting, shipping prep, and safety stocks buffer.',
        kpis: [
          { label: 'Ending inventory', value: `${Math.round(s.summary.endingInventory).toLocaleString()} units` },
          { label: 'Holding cost', value: `${s.currencySymbol}4.00/unit/yr` }
        ],
        recentActivity: [
          'Inventory safety count verified.',
          'Fulfillment batches completed.'
        ],
        aiSummary: 'Holding cost accumulates on slow safety inventories. Safety stock counts should match branches capacity.',
        recommendation: 'Target a safety buffer multiplier of 1.0x to limit excess holding bills.',
        forecastText: 'Stock velocity is expected to stabilize over the next 14 business days.'
      })
    },
    {
      id: 'delivery',
      title: 'Logistics Fleet',
      icon: Truck,
      hoverHint: 'Courier speeds, dispatch delays & caps',
      getMiniKPI: (s) => `${s.summary.totalOrders.toLocaleString()} shipped`,
      getLiveActivity: (s) => 'Couriers in dispatch',
      getLastUpdate: () => 'GPS logs synchronized',
      getDetails: (s) => ({
        overview: 'Fulfillment operations handling delivery dispatches, dispatch speeds, and courier capacities.',
        kpis: [
          { label: 'Orders processed', value: `${s.summary.totalOrders.toLocaleString()} checkouts` },
          { label: 'Delivery speed', value: 'Level 3/5' }
        ],
        recentActivity: [
          'Fulfillment batches dispatched.',
          'Turnaround metrics compiled.'
        ],
        aiSummary: 'Courier capacities are dependent on available staff. Dispatch delay logs show minimal transport setbacks.',
        recommendation: 'Ensure employee count matches order volumes to support 24-hour turnaround speeds.',
        forecastText: 'Delivery runs are projected to increase by 15% as winter seasonal demand climbs.'
      })
    },
    {
      id: 'suppliers',
      title: 'Supply Pipeline',
      icon: Activity,
      hoverHint: 'Suppliers relations & buffer rates',
      getMiniKPI: (s) => `${s.inventoryBuffer.toFixed(1)}x buffer`,
      getLiveActivity: (s) => 'Procuring raw stocks',
      getLastUpdate: () => 'EDI systems active',
      getDetails: (s) => ({
        overview: 'Coordinates relationship profiles with wholesale suppliers and restocking shipments.',
        kpis: [
          { label: 'Procurement buffer', value: `${s.inventoryBuffer.toFixed(2)}x` },
          { label: 'Unit base cost', value: `${s.currencySymbol}45.00` }
        ],
        recentActivity: [
          'Wholesale supplier ledger verified.',
          'Lead times audited.'
        ],
        aiSummary: 'Supply chain pipelines are stable, but low buffer multipliers under 0.8x increase risk of supplier delays.',
        recommendation: 'Increase the buffer rate to 1.1x to offset possible seasonal supply constraints.',
        forecastText: 'Supplier fulfillment times are projected to increase by 3 days in the coming month.'
      })
    },
    {
      id: 'finance',
      title: 'Finance HQ',
      icon: TrendingUp,
      hoverHint: 'Capital runway, overheads & margins',
      getMiniKPI: (s) => `+${s.currencySymbol}${s.summary.totalProfit.toLocaleString()}`,
      getLiveActivity: (s) => s.summary.totalProfit > 0 ? 'Cash flow positive' : 'Operating deficit',
      getLastUpdate: () => 'Ledgers synchronized',
      getDetails: (s) => ({
        overview: 'Corporate financial HQ, ledger tracking, rent overheads, and net margins.',
        kpis: [
          { label: 'Simulated profit', value: `${s.currencySymbol}${s.summary.totalProfit.toLocaleString()}` },
          { label: 'Annual Revenue', value: `${s.currencySymbol}${s.summary.totalRevenue.toLocaleString()}` }
        ],
        recentActivity: [
          'Overhead bills settled.',
          'Tax provisions updated.'
        ],
        aiSummary: `Primary cost centers are wages (${s.currencySymbol}3,800/mo/employee) and physical branch rents (${s.currencySymbol}6,000/mo/branch).`,
        recommendation: 'Trimming employee headcount below required thresholds reduces revenue velocity faster than saving wages.',
        forecastText: 'Gross margins are projected to remain steady at 62.5%.'
      })
    },
    {
      id: 'employees',
      title: 'Human Resources',
      icon: Users,
      hoverHint: 'Headcount payroll, turnout & cap',
      getMiniKPI: (s) => `${s.employeesHired} active staff`,
      getLiveActivity: (s) => `Cap: ${s.employeesHired * 120} orders/mo`,
      getLastUpdate: () => 'Payroll terminal active',
      getDetails: (s) => ({
        overview: 'Maintains worker turnouts, wages allocation, and labor output metrics.',
        kpis: [
          { label: 'Staff Count', value: `${s.employeesHired} workers` },
          { label: 'Monthly payroll', value: `${s.currencySymbol}${(s.employeesHired * 3800).toLocaleString()}` }
        ],
        recentActivity: [
          'Wages checks distributed.',
          'Headcount capacity audited.'
        ],
        aiSummary: 'Each staff member handles up to 120 checkouts/mo. Labor deficit bottlenecks the entire sales cycle.',
        recommendation: 'Maintain a minimum staff of 8 to process standard demand bounds without causing delays.',
        forecastText: 'Wages expenses will scale to accommodate holiday seasonal overtime hours.'
      })
    }
  ];

  const activeNodeData = buildings.find(b => b.id === activeNode);
  const activeNodeDetails = activeNodeData?.getDetails(state);

  return (
    <div className="relative w-full h-[620px] rounded-3xl glass-panel overflow-hidden border border-border-glass dot-grid-bg flex flex-col p-6">
      <div className="flex justify-between items-center z-10 w-full mb-4">
        <div className="flex items-center space-x-2 bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-border-glass">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-semibold tracking-wider uppercase text-text-white">NYC Digital Twin</span>
          <span className="h-2 w-2 rounded-full bg-success-green animate-ping"></span>
        </div>

        <div className="flex items-center space-x-3 bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-border-glass">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Health index:</span>
          <span className="text-xs font-black text-text-white">
            {Math.round(summary.avgSatisfaction)}/100
          </span>
        </div>
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center select-none overflow-hidden">
        <svg 
          viewBox="0 0 1000 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Paths definition */}
          <defs>
            <linearGradient id="purple-cyan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="cyan-green" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          {/* Connective Paths */}
          {/* Customers -> Store */}
          <path d="M 270,115 C 330,115 330,115 420,115" stroke="url(#purple-cyan)" strokeWidth="1.5" className="flow-line" />
          {/* Marketing -> Customers */}
          <path d="M 200,250 C 200,180 200,180 200,140" stroke="#06B6D4" strokeWidth="1.5" className="flow-line" />
          {/* Marketing -> Store */}
          <path d="M 270,280 C 330,280 340,115 420,115" stroke="#7C3AED" strokeWidth="1.5" className="flow-line" />
          {/* Store -> Warehouse */}
          <path d="M 470,140 C 470,190 470,190 470,250" stroke="#7C3AED" strokeWidth="1.5" className="flow-line" />
          {/* Store -> Finance */}
          <path d="M 520,115 C 600,115 600,130 690,130" stroke="url(#cyan-green)" strokeWidth="1.5" className="flow-line" />
          {/* Warehouse -> Delivery */}
          <path d="M 470,300 C 470,350 470,350 470,415" stroke="#3B82F6" strokeWidth="1.5" className="flow-line" />
          {/* Warehouse -> Suppliers */}
          <path d="M 520,280 C 600,280 600,305 690,305" stroke="#F59E0B" strokeWidth="1.5" className="flow-line" />
          {/* Suppliers -> Finance */}
          <path d="M 740,275 C 740,200 740,200 740,160" stroke="#22C55E" strokeWidth="1.5" className="flow-line" />
          {/* Delivery -> Customers */}
          <path d="M 420,445 C 300,445 200,250 200,140" stroke="#3B82F6" strokeWidth="1.5" className="flow-line" opacity="0.6" />
          {/* Finance -> Employees */}
          <path d="M 790,130 C 850,130 850,185 900,185" stroke="#22C55E" strokeWidth="1.5" className="flow-line" />
          {/* Employees -> Store */}
          <path d="M 900,220 C 700,220 700,115 520,115" stroke="#A855F7" strokeWidth="1.5" className="flow-line" opacity="0.6" />
        </svg>

        {/* HTML Interactive nodes float relative to viewBox coordinates */}
        {buildings.map((node) => {
          const pos = nodePositions[node.id];
          const status = getStatus(node.id);
          const colors = getStatusColors(status);
          const Icon = node.icon;
          const isHovered = hoveredNode === node.id;
          const isCentralNode = node.id === 'warehouse';

          return (
            <motion.div
              key={node.id}
              style={{
                position: 'absolute',
                left: pos.left,
                top: pos.top,
                transform: 'translate(-50%, -50%)',
              }}
              className="z-10"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setActiveNode(node.id)}
            >
              <div 
                className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer w-44 transition-all duration-300 ${
                  isCentralNode 
                    ? 'bg-gradient-to-r from-[#824C96] to-[#694F8E] border border-purple-400/40 text-white shadow-[0_0_20px_rgba(130,76,150,0.4)]'
                    : `glass-card ${isHovered ? colors.glow : colors.border} ${colors.bg}`
                }`}
              >
                {/* Active alert indicator beacon */}
                {status !== 'healthy' && !isCentralNode && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full flex items-center justify-center">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.pulse}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.pulse}`} />
                  </span>
                )}

                {/* Node Icon */}
                <div className={`p-2 rounded-xl mb-1.5 shrink-0 ${
                  isCentralNode 
                    ? 'bg-white/10 text-white animate-pulse' 
                    : `bg-slate-950 border border-border-glass ${colors.text}`
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text metrics */}
                <div className="w-full">
                  <h4 className={`text-[10px] font-black tracking-tight ${isCentralNode ? 'text-white' : 'text-text-white'}`}>
                    {node.title}
                  </h4>
                  <p className={`text-[9px] font-extrabold mt-0.5 ${isCentralNode ? 'text-purple-200' : 'text-[#B692C2]'}`}>
                    {node.getMiniKPI(state)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

      </div>

      {/* Connected Nodes Detail Drawer */}
      <AnimatePresence>
        {activeNode && activeNodeData && activeNodeDetails && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="absolute top-0 right-0 h-full w-80 bg-gray-950 border-l border-border-glass p-6 shadow-2xl z-20 flex flex-col justify-between overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border-glass pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl bg-gray-900 border border-border-glass ${getStatusColors(getStatus(activeNode)).text}`}>
                    {React.createElement(activeNodeData.icon, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-text-white">{activeNodeData.title}</h3>
                    <span className="text-[8px] text-text-muted block mt-0.5">{activeNodeData.getLastUpdate()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNode(null)}
                  className="p-1 rounded-lg hover:bg-gray-900 text-text-muted hover:text-text-white transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Overview text */}
              <p className="text-[11px] text-text-muted leading-relaxed">
                {activeNodeDetails.overview}
              </p>

              {/* Dynamic Sparkline chart */}
              <div className="h-20 w-full bg-gray-900/40 border border-border-glass rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
                    <defs>
                      <linearGradient id="sparkline-color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip 
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-gray-950 border border-border-glass px-2 py-1 rounded text-[8px] font-bold text-text-white">
                              {state.currencySymbol}{payload[0].value.toLocaleString()}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={activeNode === 'warehouse' ? 'inventory' : activeNode === 'customers' ? 'customers' : 'revenue'} 
                      stroke="#7C3AED" 
                      strokeWidth={1.5} 
                      fill="url(#sparkline-color)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed KPIs Grid */}
              <div className="grid grid-cols-2 gap-3">
                {activeNodeDetails.kpis.map((kpi, idx) => (
                  <div key={idx} className="bg-gray-900/50 border border-border-glass p-2.5 rounded-xl">
                    <span className="text-[8px] uppercase font-bold text-text-muted block tracking-wider">{kpi.label}</span>
                    <span className="text-xs font-black text-text-white block mt-0.5">{kpi.value}</span>
                    {kpi.trend && (
                      <span className={`text-[8px] font-bold block mt-0.5 ${kpi.trend.includes('↑') ? 'text-success-green' : 'text-danger-red'}`}>
                        {kpi.trend}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Insight recommendation block */}
              <div className="border border-purple-500/20 bg-purple-500/5 p-3.5 rounded-2xl space-y-2">
                <h4 className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" />
                  AI CEO Prescriptions
                </h4>
                <p className="text-[10px] text-text-white font-medium leading-relaxed">
                  {activeNodeDetails.aiSummary}
                </p>
                <div className="pt-2 border-t border-purple-500/10 text-[9px] text-purple-300 leading-normal">
                  <span className="font-extrabold uppercase block text-[8px] text-purple-400">Prescription:</span>
                  {activeNodeDetails.recommendation}
                </div>
              </div>
            </div>

            {/* Close / Action bar */}
            <div className="pt-4 border-t border-border-glass">
              <Button
                variant="glass"
                size="sm"
                className="w-full text-center py-2 text-[10px] font-bold"
                onClick={() => setActiveNode(null)}
              >
                Return to World View
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static Info Footer Panel - Prevents Clutter & Overlaps */}
      <div className="mt-4 pt-3 border-t border-border-glass flex justify-between items-center text-[10px] text-text-muted z-10 shrink-0">
        <div className="min-w-0">
          {hoveredNode ? (
            <div className="flex items-center space-x-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
              <span className="font-bold text-text-white shrink-0">{buildings.find(b => b.id === hoveredNode)?.title}:</span>
              <span className="truncate">{buildings.find(b => b.id === hoveredNode)?.hoverHint}</span>
            </div>
          ) : activeNode ? (
            <div className="flex items-center space-x-1.5 truncate">
              <span className="font-bold text-purple-400 shrink-0">Inspecting:</span>
              <span className="text-text-white truncate">{buildings.find(b => b.id === activeNode)?.title}</span>
            </div>
          ) : (
            <span className="truncate">Click any operational node to inspect real-time metrics and AI diagnostics.</span>
          )}
        </div>
        <div className="text-[9px] text-text-muted italic shrink-0 pl-4">
          Ecosystem Sandbox
        </div>
      </div>
    </div>
  );
};
