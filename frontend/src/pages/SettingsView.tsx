import React, { useState } from 'react';
import { useBusinessState } from '../contexts/BusinessContext';
import { useAuthState } from '../contexts/AuthContext';
import { 
  Settings, 
  User, 
  Globe, 
  DollarSign, 
  Download, 
  Upload, 
  Shield, 
  Link,
  Sparkles,
  Save
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const SettingsView: React.FC = () => {
  const {
    priceMultiplier, setPriceMultiplier,
    marketingBudget, setMarketingBudget,
    employeesHired, setEmployeesHired,
    branchesOpen, setBranchesOpen,
    inventoryBuffer, setInventoryBuffer,
    summary,
    currency,
    setCurrency,
    language,
    setLanguage
  } = useBusinessState();

  const { user, logout } = useAuthState();

  // Profile preferences
  const [profileName, setProfileName] = useState(user?.name || 'Mahalakshmi');
  const [bizName, setBizName] = useState('BusinessVerse Sandbox Retailer');
  const [industry, setIndustry] = useState('Retail & Distribution');
  const [theme, setTheme] = useState('dark');

  // Export state variables to JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      levers: {
        priceMultiplier,
        marketingBudget,
        employeesHired,
        branchesOpen,
        inventoryBuffer
      },
      summary
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BusinessVerse-Backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('JSON configuration backup downloaded successfully!');
  };

  // Restore state variables from JSON upload
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.levers) {
          const { levers } = parsed;
          if (levers.priceMultiplier !== undefined) setPriceMultiplier(levers.priceMultiplier);
          if (levers.marketingBudget !== undefined) setMarketingBudget(levers.marketingBudget);
          if (levers.employeesHired !== undefined) setEmployeesHired(levers.employeesHired);
          if (levers.branchesOpen !== undefined) setBranchesOpen(levers.branchesOpen);
          if (levers.inventoryBuffer !== undefined) setInventoryBuffer(levers.inventoryBuffer);
          alert('Simulator levers successfully restored from JSON backup!');
        } else {
          alert('Invalid backup format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    alert('Enterprise preferences successfully saved!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-glass shrink-0">
        <div>
          <h2 className="text-lg font-bold text-text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-purple-400" />
            Enterprise Control Panel
          </h2>
          <p className="text-xs text-text-muted">Manage active tenant structures, linked login accounts, and data logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Profile Claims card */}
        <div className="glass-panel border border-border-glass rounded-3xl p-6 space-y-4 h-fit bg-gray-950/20">
          <div className="flex flex-col items-center text-center space-y-2">
            <div>
              <h3 className="text-xs font-bold text-text-white">{profileName}</h3>
              <p className="text-[9px] text-text-muted">{user?.email || 'admin@businessverse.ai'}</p>
            </div>
            <Badge variant="purple">{user?.role ? user.role.toUpperCase() : 'OWNER'}</Badge>
          </div>

          <div className="border-t border-border-glass pt-4 space-y-2.5 text-[10px] text-text-muted">
            <div className="flex justify-between">
              <span>Authority Permissions:</span>
              <span className="text-text-white">Full Access</span>
            </div>
            <div className="flex justify-between">
              <span>Tenant Status:</span>
              <span className="text-emerald-400 font-bold">ACTIVE sandbox</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full text-center py-2 bg-gray-900 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-xl text-[10px] font-bold cursor-pointer transition-colors focus:outline-none"
          >
            Sign Out
          </button>
        </div>

        {/* Right Side: Preference Controls */}
        <div className="md:col-span-2 space-y-6">
          {/* Business & Localizations Card */}
          <div className="glass-panel border border-border-glass rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-text-white uppercase tracking-wider flex items-center">
              <Globe className="w-4 h-4 mr-2 text-purple-400" />
              Corporate Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted">Business Name</label>
                <input 
                  type="text" 
                  value={bizName} 
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full bg-gray-950 border border-border-glass rounded-xl px-3 py-2 text-xs text-text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted">Industry Type</label>
                <input 
                  type="text" 
                  value={industry} 
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-gray-950 border border-border-glass rounded-xl px-3 py-2 text-xs text-text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted">System Language</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-950 border border-border-glass rounded-xl px-3 py-2 text-xs text-text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="de">Deutsch (DE)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted">Ledger Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-gray-950 border border-border-glass rounded-xl px-3 py-2 text-xs text-text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Backup Restore controls */}
          <div className="glass-panel border border-border-glass rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-text-white uppercase tracking-wider flex items-center">
              <Shield className="w-4 h-4 mr-2 text-purple-400" />
              Backup & Disaster Recovery
            </h3>

            <p className="text-[10px] text-text-muted leading-relaxed">
              Export your simulated settings and KPI results to a local file, or restore previously archived simulation parameters.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportBackup}
                className="text-[10px] flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Configuration JSON</span>
              </Button>

              <div className="relative">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImportBackup}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="text-[10px] flex items-center space-x-1.5 pointer-events-none"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore Configuration</span>
                </Button>
              </div>
            </div>
          </div>


          {/* Save Change actions */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              className="text-[10px] flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};
