import React, { useState, useRef } from 'react';
import { BusPass, VerificationLog } from '../types';
import { verifyBusPass } from '../services/securityToken';
import { ShieldCheck, Camera, AlertOctagon, CheckCircle2, RefreshCw, QrCode, Search, History, AlertTriangle } from 'lucide-react';

interface ConductorScannerProps {
  passDatabase: BusPass[];
}

export const ConductorScanner: React.FC<ConductorScannerProps> = ({ passDatabase }) => {
  const [scannedInput, setScannedInput] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationLog | null>(null);
  const [scanLogs, setScanLogs] = useState<VerificationLog[]>([
    {
      id: 'vlog-001',
      passId: 'pass-9081',
      passNumber: 'BP-2026-9081',
      passengerName: 'Alex Morgan',
      timestamp: new Date().toLocaleTimeString(),
      inspectorId: 'INSPECTOR-GATE-01',
      locationStop: 'Central Grand Terminal',
      status: 'VALID',
      message: '✅ VERIFIED ACTIVE PASS: MONTHLY - Student (Alex Morgan)'
    }
  ]);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVerifyCode = async (codeToTest: string) => {
    if (!codeToTest.trim()) return;

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToTest, inspectorId: 'INSPECTOR-GATE-01' })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setVerificationResult(data.result);
        setScanLogs(prev => [data.result, ...prev]);
        return;
      }
    } catch (e) {
      console.warn('Backend verification connection error, fallback to local validator:', e);
    }

    const fallbackResult = verifyBusPass(codeToTest, passDatabase, 'INSPECTOR-GATE-01');
    setVerificationResult(fallbackResult);
    setScanLogs(prev => [fallbackResult, ...prev]);
  };

  const handleStartCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Camera permission denied or unavailable. You can use manual scan or quick-verify demo buttons below.');
      setIsCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Inspector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Conductor & Revenue Protection Portal
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Digital Pass Inspector Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time cryptographic hash verification, anti-screenshot check & fraud detection.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>INSPECTOR ID: GATE-01</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Scanner Control & Verification Feed */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Scan or Enter Pass Code</span>
              <QrCode className="h-4 w-4 text-blue-600" />
            </h2>

            {/* Camera Viewport or Mock Scanner Frame */}
            <div className="relative bg-slate-950 rounded-2xl border-2 border-slate-800 h-60 flex flex-col items-center justify-center overflow-hidden">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-blue-400 border border-slate-800">
                    <Camera className="h-7 w-7" />
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Point conductor camera at passenger's digital pass QR code.
                  </p>
                  <button
                    onClick={handleStartCamera}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                  >
                    Enable Camera Scanner
                  </button>
                </div>
              )}

              {/* Scanning Overlay Reticle */}
              <div className="absolute inset-0 border-2 border-dashed border-blue-400/40 pointer-events-none rounded-2xl m-6" />
            </div>

            {/* Manual ID / Hash Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Manual Pass ID or QR Signature</label>
              <div className="flex gap-2">
                <input
                  id="input-scan-code"
                  type="text"
                  placeholder="e.g. pass-9081 or BP-2026-9081"
                  value={scannedInput}
                  onChange={(e) => setScannedInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode(scannedInput)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-900"
                />
                <button
                  id="btn-verify-pass-code"
                  onClick={() => handleVerifyCode(scannedInput)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md"
                >
                  <Search className="h-4 w-4" /> Verify
                </button>
              </div>
            </div>

            {/* Quick Test Demo Pass Buttons */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">
                Quick Test Sample Passes
              </div>
              <div className="flex flex-wrap gap-2">
                {passDatabase.map(p => (
                  <button
                    key={p.id}
                    id={`btn-quick-verify-${p.id}`}
                    onClick={() => {
                      setScannedInput(p.id);
                      handleVerifyCode(p.id);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300"
                  >
                    Test {p.passNumber} ({p.status})
                  </button>
                ))}

                <button
                  onClick={() => {
                    setScannedInput('FAKE-COUNTERFEIT-HASH-99');
                    handleVerifyCode('FAKE-COUNTERFEIT-HASH-99');
                  }}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-rose-300"
                >
                  Test Fake Counterfeit Code
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Instant Live Verification Feedback Panel */}
        <div className="lg:col-span-6 space-y-6">
          
          {verificationResult ? (
            <div className={`rounded-2xl border-2 p-6 shadow-2xl space-y-4 animate-fade-in ${
              verificationResult.status === 'VALID'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-500'
                : 'bg-rose-950 text-rose-100 border-rose-500'
            }`}>
              
              <div className="flex items-center gap-3">
                {verificationResult.status === 'VALID' ? (
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 shrink-0" />
                ) : (
                  <AlertOctagon className="h-10 w-10 text-rose-400 shrink-0 animate-bounce" />
                )}

                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {verificationResult.status === 'VALID' ? 'PASS VALID & APPROVED' : 'SECURITY FLAG DETECTED'}
                  </h3>
                  <p className="text-xs opacity-90 font-mono mt-0.5">{verificationResult.timestamp}</p>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-white/10 font-mono text-xs space-y-1.5">
                <div>Status: <span className="font-bold underline">{verificationResult.status}</span></div>
                <div>Pass Number: <span className="text-white font-bold">{verificationResult.passNumber}</span></div>
                <div>Passenger: <span className="text-white font-bold">{verificationResult.passengerName}</span></div>
                <div className="text-amber-300 font-sans mt-2 font-medium">{verificationResult.message}</div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
              <QrCode className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Ready for pass verification</p>
              <p className="text-xs text-slate-400">Scan a QR code or click one of the quick test sample passes.</p>
            </div>
          )}

          {/* Audit Verification Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <History className="h-4 w-4 text-slate-600" />
              Recent Inspection Audit Log ({scanLogs.length})
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-xs pr-1">
              {scanLogs.map(log => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    log.status === 'VALID'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div>
                    <span className="font-bold">{log.passNumber}</span> - {log.passengerName}
                    <div className="text-[10px] opacity-75">{log.timestamp}</div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    log.status === 'VALID' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
