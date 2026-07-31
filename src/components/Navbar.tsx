import React from 'react';
import { Bus, ShieldCheck, Cpu, Wallet, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { CloudMetrics } from '../types';

interface NavbarProps {
  activeTab: 'book' | 'wallet' | 'scanner' | 'cloud' | 'routes';
  setActiveTab: (tab: 'book' | 'wallet' | 'scanner' | 'cloud' | 'routes') => void;
  activePassesCount: number;
  cloudMetrics: CloudMetrics | null;
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activePassesCount,
  cloudMetrics,
  onOpenAiAssistant,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('book')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-2 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center font-bold">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  CloudPass
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v2.4 Cloud
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Scalable Anti-Fraud Transit Platform
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              id="nav-tab-book"
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'book'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bus className="h-3.5 w-3.5" />
              Book Ticket / Pass
            </button>

            <button
              id="nav-tab-wallet"
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'wallet'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Wallet className="h-3.5 w-3.5" />
              My Cloud Wallet
              {activePassesCount > 0 && (
                <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {activePassesCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-scanner"
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Inspector Scanner
            </button>

            <button
              id="nav-tab-cloud"
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'cloud'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              Auto-Scaling Monitor
            </button>

            <button
              id="nav-tab-routes"
              onClick={() => setActiveTab('routes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'routes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Live Routes
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Live Network Status Chip from Professional Polish theme */}
            <div 
              onClick={() => setActiveTab('cloud')} 
              className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition shadow-xs"
              title="Click to view Live Infrastructure Status"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Network: 99.98% Uptime</span>
            </div>

            {/* AI Assistant Button */}
            <button
              id="btn-open-ai-assistant"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all transform active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">AI Transit Helper</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bar Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-900 py-2 text-[11px] text-slate-300">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'book' ? 'text-blue-400 font-bold' : ''}`}
        >
          <Bus className="h-4 w-4" />
          Book
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'wallet' ? 'text-blue-400 font-bold' : ''}`}
        >
          <Wallet className="h-4 w-4" />
          Wallet ({activePassesCount})
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'scanner' ? 'text-blue-400 font-bold' : ''}`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Scanner
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'cloud' ? 'text-blue-400 font-bold' : ''}`}
        >
          <Cpu className="h-4 w-4 text-amber-400" />
          Auto-Scaler
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'routes' ? 'text-blue-400 font-bold' : ''}`}
        >
          <MapPin className="h-4 w-4" />
          Routes
        </button>
      </div>
    </header>
  );
};
