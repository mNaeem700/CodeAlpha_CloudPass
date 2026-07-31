import React, { useState } from 'react';
import { CloudMetrics, ServerNode } from '../types';
import { Cpu, Zap, Activity, Server, ShieldCheck, RefreshCw, BarChart2, TrendingUp, DollarSign, Layers, CheckCircle2 } from 'lucide-react';

interface CloudInfrastructureProps {
  metrics: CloudMetrics | null;
  nodes: ServerNode[];
  onSimulateSpike: (targetRps: number) => void;
  onResetCluster: () => void;
}

export const CloudInfrastructure: React.FC<CloudInfrastructureProps> = ({
  metrics,
  nodes,
  onSimulateSpike,
  onResetCluster,
}) => {
  const [isScaling, setIsScaling] = useState<boolean>(false);

  const handleSpikeClick = (rps: number) => {
    setIsScaling(true);
    onSimulateSpike(rps);
    setTimeout(() => setIsScaling(false), 2000);
  };

  const handleResetClick = () => {
    setIsScaling(true);
    onResetCluster();
    setTimeout(() => setIsScaling(false), 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Infrastructure Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold border border-amber-500/30">
            <Zap className="h-3.5 w-3.5" />
            DYNAMIC INFRASTRUCTURE & AUTO-SCALER ENGINE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            High-Traffic Elastic Cloud Cluster
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Automated node provisioning, zero-downtime surge mitigation, and distributed ticket locks preventing double-booking during flash rush hours.
          </p>
        </div>

        {/* Quick Traffic Load Simulator Buttons */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 shrink-0 relative z-10">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Simulate Traffic Surge Event
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="btn-spike-normal"
              onClick={() => handleSpikeClick(4700)}
              disabled={isScaling}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-slate-700 transition"
            >
              Normal (4.7k req/s)
            </button>

            <button
              id="btn-spike-rush"
              onClick={() => handleSpikeClick(15000)}
              disabled={isScaling}
              className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-md transition"
            >
              Rush Hour (15k req/s)
            </button>

            <button
              id="btn-spike-blackfriday"
              onClick={() => handleSpikeClick(30000)}
              disabled={isScaling}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-extrabold shadow-lg transition animate-pulse"
            >
              Flash Crowd (30k req/s)
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleResetClick}
              className="text-[11px] text-slate-400 hover:text-white underline font-mono flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Reset Baseline Load
            </button>
          </div>
        </div>

      </div>

      {/* Realtime Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Active Container Nodes</span>
            <Server className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics ? metrics.activeInstances : nodes.length} <span className="text-xs font-normal text-slate-500">instances</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Auto-Scaled (2 to 32 max)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Throughput (RPS)</span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics ? (metrics.currentRps / 1000).toFixed(1) : '4.7'}k <span className="text-xs font-normal text-slate-500">req/sec</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Total: {metrics ? (metrics.totalRequestsProcessed / 1000000).toFixed(2) : '4.89'}M requests
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Average API Latency</span>
            <Zap className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics ? metrics.avgLatencyMs : 14} <span className="text-xs font-normal text-slate-500">ms</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-mono font-semibold">
            p99 Latency: {metrics ? metrics.p99LatencyMs : 38} ms
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Edge Cache Hit Ratio</span>
            <BarChart2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics ? metrics.cacheHitRatio : 98.4}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Est. Cost: ${metrics ? metrics.costPerHour : 0.96}/hr
          </div>
        </div>

      </div>

      {/* Server Node Health Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-600" />
            Provisioned Microservice Worker Instances ({nodes.length})
          </h2>
          <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ● All Nodes 100% Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map(node => (
            <div
              key={node.id}
              className={`p-4 rounded-xl border font-mono text-xs space-y-2 transition-all ${
                node.status === 'PROVISIONING'
                  ? 'bg-amber-50 border-amber-300 animate-pulse'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-blue-400 truncate">{node.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  node.status === 'PROVISIONING' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {node.status}
                </span>
              </div>

              <div className="text-[11px] opacity-75">{node.region}</div>

              {/* CPU Meter */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px]">
                  <span>CPU Load</span>
                  <span>{node.cpuPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      node.cpuPercent > 80 ? 'bg-rose-500' : (node.cpuPercent > 50 ? 'bg-amber-400' : 'bg-emerald-400')
                    }`}
                    style={{ width: `${node.cpuPercent}%` }}
                  />
                </div>
              </div>

              {/* Memory Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>RAM Usage</span>
                  <span>{node.memoryPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 transition-all duration-500"
                    style={{ width: `${node.memoryPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>{node.requestsPerSec} req/s</span>
                <span>{node.activeConnections} conn</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scalability & Reliability Architectural Comparison Table */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-400" />
            Reliability & Scalability Architecture vs. Legacy Sites
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Why this cloud-native system prevents outages, ticket losses, and incorrect pricing.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Feature / Vector</th>
                <th className="py-3 px-4 text-rose-400">Legacy Traditional Sites</th>
                <th className="py-3 px-4 text-emerald-400 font-bold">Cloud-Native Bus Pass System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white">High Traffic Spikes</td>
                <td className="py-3 px-4 text-rose-300">Monolithic servers crash or queue users endlessly.</td>
                <td className="py-3 px-4 text-emerald-300 font-semibold">Auto-scales nodes dynamically in 2.5s up to 30k req/s.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Ticket Loss / Theft</td>
                <td className="py-3 px-4 text-rose-300">Paper tickets easily lost; static screenshots stolen.</td>
                <td className="py-3 px-4 text-emerald-300 font-semibold">Synced to Cloud Wallet with rolling 30s anti-theft TOTP codes.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Fare & Price Calculation</td>
                <td className="py-3 px-4 text-rose-300">Manual zone entry causing overcharge & human error.</td>
                <td className="py-3 px-4 text-emerald-300 font-semibold">Automated distance matrix & verified concession discounts.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Counterfeit Verification</td>
                <td className="py-3 px-4 text-rose-300">Visual inspector check vulnerable to fake passes.</td>
                <td className="py-3 px-4 text-emerald-300 font-semibold">Instant SHA-256 cryptographic signature validation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
