import React, { useState } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  Layers, 
  Briefcase 
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

type ReportType = 'executive' | 'weekly' | 'risk' | 'growth';

export const ReportsView: React.FC = () => {
  const { 
    summary, 
    priceMultiplier, 
    employeesHired, 
    marketingBudget, 
    branchesOpen,
    inventoryBuffer,
    alerts 
  } = useBusinessState();

  const [activeReport, setActiveReport] = useState<ReportType>('executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string>('');
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'excel' | null>(null);

  const getReportTitle = (type: ReportType) => {
    switch (type) {
      case 'executive': return 'Confidential Executive Summary';
      case 'weekly': return 'Weekly Operational Turnout';
      case 'risk': return 'Risk Vulnerability Audit';
      case 'growth': return 'Capital Scale Projections';
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationLogs('Simulating supply chain pipelines...');
    
    setTimeout(() => {
      setGenerationLogs('Running cash-flow projections algorithms...');
      setTimeout(() => {
        setGenerationLogs('Formatting advisory recommendation matrix...');
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationLogs('');
        }, 800);
      }, 800);
    }, 800);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      alert(`Report exported as ${format.toUpperCase()} successfully!`);
    }, 1500);
  };

  // Dynamic contents builder based on simulator state
  const renderReportContent = () => {
    const healthScore = Math.min(100, Math.max(10, Math.round((summary.avgSatisfaction + (summary.totalProfit > 0 ? 95 : 30)) / 2)));
    const payroll = employeesHired * 3800 * 12;
    const rent = branchesOpen * 6000 * 12;
    const cogs = summary.totalOrders * 45;
    const fixedExpenses = payroll + rent + (marketingBudget * 12);
    
    switch (activeReport) {
      case 'executive':
        return (
          <div className="space-y-4 text-text-muted leading-relaxed text-xs">
            <div className="border-b border-border-glass pb-3">
              <h4 className="font-bold text-text-white text-sm">1. Executive Overview</h4>
              <p className="mt-1">
                The business operations are currently projected to generate **${summary.totalRevenue.toLocaleString()}** in annual revenue, yielding **${summary.totalProfit.toLocaleString()}** in net operating profits. 
                Overall system health stands at **{healthScore}/100**, indicating **{healthScore > 80 ? 'optimal baseline alignment' : 'under-optimized levers'}**.
              </p>
            </div>
            <div className="border-b border-border-glass pb-3">
              <h4 className="font-bold text-text-white text-sm">2. Sales & Channel Audit</h4>
              <p className="mt-1">
                Pricing is set at a **{priceMultiplier.toFixed(2)}x** multiplier. We are operating **{branchesOpen}** physical location(s). 
                Total processed unit order dispatches stands at **{summary.totalOrders.toLocaleString()}** units.
              </p>
            </div>
            <div className="border-b border-border-glass pb-3">
              <h4 className="font-bold text-text-white text-sm">3. Financial Ledger Projections</h4>
              <p className="mt-1">
                - **Gross Revenues**: ${summary.totalRevenue.toLocaleString()}<br />
                - **Cost of Goods Sold (COGS)**: ${cogs.toLocaleString()}<br />
                - **Fixed Overheads**: Rent: ${rent.toLocaleString()}/yr | Payroll: ${payroll.toLocaleString()}/yr<br />
                - **Net Returns**: ${summary.totalProfit.toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-purple-400 text-sm">4. Priority Recommendations</h4>
              <p className="mt-1 font-semibold text-text-white">
                {summary.totalProfit < 0 
                  ? 'Wages and rents exceed storefront contribution margins. Immediately adjust pricing multiplier to 1.20x to reach break-even.' 
                  : 'Cash flows are secure. Target secondary branch launch and double marketing spend to establish local share.'}
              </p>
            </div>
          </div>
        );
      case 'weekly':
        return (
          <div className="space-y-4 text-text-muted leading-relaxed text-xs">
            <div className="border-b border-border-glass pb-3">
              <h4 className="font-bold text-text-white text-sm">1. Weekly Sales Velocities</h4>
              <p className="mt-1">
                Weekly orders process rate stands at **{Math.round(summary.totalOrders / 52)} dispatches/wk**. 
                Estimated weekly cash receipts are **${Math.round(summary.totalRevenue / 52).toLocaleString()}/wk**.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-text-white text-sm">2. Staff Throughput Indicators</h4>
              <p className="mt-1">
                Wages payout stands at **${Math.round(payroll / 52).toLocaleString()}/wk**. Average staff utilization rate is 
                **{Math.round(((summary.totalOrders / 12) / (employeesHired * 120)) * 100)}%**.
              </p>
            </div>
          </div>
        );
      case 'risk':
        return (
          <div className="space-y-4 text-text-muted leading-relaxed text-xs">
            <div className="border-b border-border-glass pb-3">
              <h4 className="font-bold text-text-white text-sm">1. Liquidity & Cash Flow Risk</h4>
              <p className="mt-1">
                Current Risk Rating: <span className={summary.totalProfit < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {summary.totalProfit < 0 ? 'CRITICAL RUNWAY DRAIN' : 'SECURE'}
                </span><br />
                {summary.totalProfit < 0 
                  ? 'Negative annual profits indicate cash reserves will deplete. Secure pricing markup mitigations.' 
                  : 'Profits are healthy. System liquidity runway is extended.'}
              </p>
            </div>
            <div className="border-b border-border-glass pb-3">
              <h4 className="font-bold text-text-white text-sm">2. Supply Chain & Stockout Hazard</h4>
              <p className="mt-1">
                Current Risk Rating: <span className={inventoryBuffer < 0.8 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {inventoryBuffer < 0.8 ? 'HIGH STOCKOUT EXPOSURE' : 'SECURE STOCKING'}
                </span><br />
                {inventoryBuffer < 0.8 
                  ? 'Low safety buffers increase chance of empty shelves. Raise inventory buffer rate slider.' 
                  : 'Warehouse safety stocks are adequate to insulate operations from seasonal order spikes.'}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-text-white text-sm">3. Capacity & Understaffing Risk</h4>
              <p className="mt-1">
                Current Risk Rating: <span className={employeesHired < (summary.totalOrders / 12 / 120) ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {employeesHired < (summary.totalOrders / 12 / 120) ? 'CAPACITY BOTTLENECK' : 'ADEQUATE HEADCOUNT'}
                </span>
              </p>
            </div>
          </div>
        );
      case 'growth':
        return (
          <div className="space-y-4 text-text-muted leading-relaxed text-xs">
            <div className="border-b border-border-glass pb-3">
              <h4 className="font-bold text-text-white text-sm">1. Multi-branch Replication</h4>
              <p className="mt-1">
                Replicating branch storefronts increases physical overhead by **$72,000/yr per location**. 
                However, it scales market exposure by **1.8x** in adjacent neighborhoods.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-text-white text-sm">2. CAC Scaling Vectors</h4>
              <p className="mt-1">
                Increasing marketing budget to **$3,500/mo** scales annual customer registrations to 
                **{Math.round(summary.totalOrders * 1.2)} accounts/yr**.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-lg font-bold text-text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-400" />
            Decision Intelligence Audit Reports
          </h2>
          <p className="text-xs text-text-muted">Generate specific projection reports and AI strategy files based on simulated states.</p>
        </div>
      </div>

      {/* Select Report Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { id: 'executive', label: 'Executive Audit', icon: Briefcase, color: 'text-purple-400' },
          { id: 'weekly', label: 'Weekly Projections', icon: Activity, color: 'text-cyan-400' },
          { id: 'risk', label: 'Risk Vulnerability', icon: ShieldAlert, color: 'text-rose-400' },
          { id: 'growth', label: 'Growth Projections', icon: TrendingUp, color: 'text-emerald-400' }
        ].map((r) => (
          <div
            key={r.id}
            onClick={() => setActiveReport(r.id as ReportType)}
            className={`p-4 rounded-2xl glass-panel border cursor-pointer hover:border-purple-500/30 transition-all flex items-center space-x-3 ${
              activeReport === r.id ? 'border-purple-500/60 bg-purple-500/5' : 'border-border-glass bg-gray-950/20'
            }`}
          >
            <div className={`p-2 rounded-xl bg-gray-900 border border-border-glass ${r.color}`}>
              <r.icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-text-white">{r.label}</span>
          </div>
        ))}
      </div>

      {/* Main Generator Canvas Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left selector details summary */}
        <div className="lg:col-span-4 glass-panel border border-border-glass rounded-3xl p-6 space-y-4">
          <div className="space-y-1">
            <Badge variant="purple">System Engine</Badge>
            <h3 className="text-sm font-bold text-text-white mt-1">Audit Configuration</h3>
            <p className="text-[10px] text-text-muted">Projections are compiled from active slider coordinates.</p>
          </div>

          <div className="border-t border-border-glass pt-4 space-y-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full justify-center text-[10px]"
            >
              {isGenerating ? 'Compiling data...' : 'Recalculate Projections'}
            </Button>
          </div>

          {/* Logs panel when generating */}
          {isGenerating && (
            <div className="bg-gray-900/60 border border-border-glass p-3 rounded-xl flex items-center space-x-2 text-[9px] text-purple-400 font-mono animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping"></span>
              <span>{generationLogs}</span>
            </div>
          )}
        </div>

        {/* Right Preview Card Sheet */}
        <div className="lg:col-span-8">
          <div className="glass-panel border border-border-glass rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden bg-gray-950/40">
            {/* Header watermarks */}
            <div className="absolute top-4 right-6 text-[8px] font-black text-purple-500/25 tracking-widest pointer-events-none uppercase">
              BusinessVerse AI Confidential Projections Audit
            </div>

            {/* Document Header */}
            <div className="border-b border-border-glass pb-4 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-extrabold text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest">
                  {activeReport} audit report
                </span>
                <h3 className="text-base font-black text-text-white mt-2">
                  {getReportTitle(activeReport)}
                </h3>
                <p className="text-[10px] text-text-muted italic mt-0.5">
                  Generated on {new Date().toLocaleDateString()} &bull; Synced simulation parameters
                </p>
              </div>

              {/* Status score tag */}
              <Badge variant={summary.totalProfit >= 0 ? 'emerald' : 'rose'}>
                {summary.totalProfit >= 0 ? 'Liquid runway secure' : 'Cashflow warning'}
              </Badge>
            </div>

            {/* Generated Report Content */}
            <div className="min-h-[220px]">
              {isGenerating ? (
                <div className="h-[220px] flex flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 rounded-full border border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <span className="text-[10px] text-text-muted">Compiling data ledgers...</span>
                </div>
              ) : (
                renderReportContent()
              )}
            </div>

            {/* PDF/Excel Actions Footer */}
            <div className="border-t border-border-glass pt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                disabled={downloadingFormat !== null}
                className="text-[10px]"
              >
                {downloadingFormat === 'excel' ? 'Exporting...' : 'Export raw CSV'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={downloadingFormat !== null}
                className="text-[10px] flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingFormat === 'pdf' ? 'Generating PDF...' : 'Download Advisory PDF'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
