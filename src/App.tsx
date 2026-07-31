import React, { useState, useEffect } from 'react';
import { BusPass, CloudMetrics, ServerNode } from './types';
import { INITIAL_PASSES } from './data/initialPasses';
import { Navbar } from './components/Navbar';
import { BookingWizard } from './components/BookingWizard';
import { PassWallet } from './components/PassWallet';
import { ConductorScanner } from './components/ConductorScanner';
import { CloudInfrastructure } from './components/CloudInfrastructure';
import { RouteExplorer } from './components/RouteExplorer';
import { TransitAssistant } from './components/TransitAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<'book' | 'wallet' | 'scanner' | 'cloud' | 'routes'>('book');
  const [passes, setPasses] = useState<BusPass[]>(INITIAL_PASSES);
  const [cloudMetrics, setCloudMetrics] = useState<CloudMetrics | null>(null);
  const [serverNodes, setServerNodes] = useState<ServerNode[]>([]);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  // Fetch initial passes and metrics from server
  useEffect(() => {
    fetchPasses();
    fetchCloudMetrics();

    const timer = setInterval(() => {
      fetchCloudMetrics();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const fetchPasses = async () => {
    try {
      const res = await fetch('/api/passes');
      const data = await res.json();
      if (data.success && data.passes) {
        setPasses(data.passes);
      }
    } catch (e) {
      console.warn('Could not fetch passes from API, using local state:', e);
    }
  };

  const fetchCloudMetrics = async () => {
    try {
      const res = await fetch('/api/autoscale/metrics');
      const data = await res.json();
      if (data.success) {
        setCloudMetrics(data.metrics);
        setServerNodes(data.nodes);
      }
    } catch (e) {
      // quiet fallback
    }
  };

  const handlePassIssued = (newPass: BusPass) => {
    setPasses(prev => [newPass, ...prev]);
  };

  const handleReportLostStolen = async (passId: string) => {
    if (confirm('Are you sure you want to revoke and report this pass stolen? It will immediately be flagged across all conductor scanners.')) {
      try {
        const res = await fetch(`/api/passes/${passId}/revoke`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setPasses(prev => prev.map(p => p.id === passId ? { ...p, status: 'REVOKED' } : p));
          alert('Pass revoked in Cloud Security Database. A replacement digital pass can be re-issued to your account without charge.');
          return;
        }
      } catch (e) {
        console.error('Revoke API error:', e);
      }
      setPasses(prev => prev.map(p => p.id === passId ? { ...p, status: 'REVOKED' } : p));
    }
  };

  const handleSimulateSpike = async (targetRps: number) => {
    try {
      const res = await fetch('/api/autoscale/simulate-spike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRps })
      });
      const data = await res.json();
      if (data.success) {
        setCloudMetrics(data.metrics);
        setServerNodes(data.nodes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetCluster = async () => {
    try {
      const res = await fetch('/api/autoscale/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCloudMetrics(data.metrics);
        setServerNodes(data.nodes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activePassesCount = passes.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePassesCount={activePassesCount}
        cloudMetrics={cloudMetrics}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'book' && (
          <BookingWizard
            onPassIssued={handlePassIssued}
            onViewWallet={() => setActiveTab('wallet')}
          />
        )}

        {activeTab === 'wallet' && (
          <PassWallet
            passes={passes}
            onReportLostStolen={handleReportLostStolen}
            onBookNewPass={() => setActiveTab('book')}
          />
        )}

        {activeTab === 'scanner' && (
          <ConductorScanner passDatabase={passes} />
        )}

        {activeTab === 'cloud' && (
          <CloudInfrastructure
            metrics={cloudMetrics}
            nodes={serverNodes}
            onSimulateSpike={handleSimulateSpike}
            onResetCluster={handleResetCluster}
          />
        )}

        {activeTab === 'routes' && (
          <RouteExplorer />
        )}
      </main>

      {/* AI Transit Assistant Modal */}
      <TransitAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onSelectPassType={() => setActiveTab('book')}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 CloudPass Transit Systems. High-Availability Auto-Scaling Cluster.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-bold">● SHA-256 Anti-Fraud Active</span>
            <span className="text-blue-400">Cloud Run Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
