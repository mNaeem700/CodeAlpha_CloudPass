import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { BusPass } from '../types';
import { generatePassQRPayload, getRollingSecurityCode } from '../services/securityToken';
import { Wallet, ShieldCheck, Download, Printer, Share2, AlertTriangle, RefreshCw, CheckCircle2, Lock, Clock, Sparkles } from 'lucide-react';

interface PassWalletProps {
  passes: BusPass[];
  onReportLostStolen: (passId: string) => void;
  onBookNewPass: () => void;
}

export const PassWallet: React.FC<PassWalletProps> = ({ passes, onReportLostStolen, onBookNewPass }) => {
  const [selectedPassId, setSelectedPassId] = useState<string>(passes[0]?.id || '');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [totpCode, setTotpCode] = useState<string>('');
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(30);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const selectedPass = passes.find(p => p.id === selectedPassId) || passes[0];

  // Refresh dynamic rolling TOTP security code every 30 seconds
  useEffect(() => {
    if (!selectedPass) return;

    const updateSecurityCode = () => {
      const code = getRollingSecurityCode(selectedPass.id);
      setTotpCode(code);
      const seconds = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeRemainingSec(seconds);
    };

    updateSecurityCode();
    const timer = setInterval(updateSecurityCode, 1000);
    return () => clearInterval(timer);
  }, [selectedPassId, passes]);

  // Generate QR code Data URL whenever selectedPass or totpCode updates
  useEffect(() => {
    if (!selectedPass) return;

    const payload = generatePassQRPayload(selectedPass);
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [selectedPass, totpCode]);

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.download = `BusPass_${selectedPass?.passNumber || 'Digital'}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleCopyHash = () => {
    if (selectedPass) {
      navigator.clipboard.writeText(selectedPass.qrSignature);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Top Wallet Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Wallet className="h-7 w-7 text-blue-600" />
              Digital Pass Wallet
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Cloud Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Anti-theft dynamic TOTP verification & anti-loss cloud backup storage.
          </p>
        </div>

        <button
          onClick={onBookNewPass}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 text-sm transition"
        >
          + Purchase New Pass
        </button>
      </div>

      {passes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-lg">
          <Wallet className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Digital Passes Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            You don't have any active transit passes yet. Purchase your first daily or monthly pass!
          </p>
          <button
            onClick={onBookNewPass}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md"
          >
            Book Pass Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Pass Selection Cards List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Your Saved Passes ({passes.length})
            </h2>

            {passes.map((pass) => {
              const isActive = pass.status === 'ACTIVE';
              const isSelected = pass.id === selectedPassId;

              return (
                <div
                  key={pass.id}
                  id={`pass-item-${pass.id}`}
                  onClick={() => setSelectedPassId(pass.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-blue-600 bg-slate-900 text-white shadow-xl scale-[1.02]'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {pass.status}
                    </span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {pass.passType.toUpperCase()}
                    </span>
                  </div>

                  <h3 className={`font-black text-base ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {pass.routeName || 'Network Travel Pass'}
                  </h3>
                  
                  <div className="mt-2 text-xs space-y-0.5 opacity-80">
                    <div>Category: <span className="font-semibold">{pass.category}</span></div>
                    <div>Valid Until: <span className="font-semibold">{new Date(pass.validUntil).toLocaleDateString()}</span></div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] font-mono">
                    <span className="opacity-70">{pass.passNumber}</span>
                    <span className="text-emerald-400 font-bold">${pass.farePaid.toFixed(2)} Paid</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Digital Pass View with Hologram & Anti-Theft QR */}
          {selectedPass && (
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white relative">
                
                {/* Holographic Dynamic Top Security Bar */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-300 animate-pulse" />
                    <span className="tracking-wide">ANTI-FRAUD VERIFIED TRANSIT PASS</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-950/40 px-2.5 py-1 rounded-full border border-white/20">
                    <Clock className="h-3 w-3 text-amber-300" />
                    <span>REFRESH: {timeRemainingSec}s</span>
                  </div>
                </div>

                {/* Main Pass Card Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Holder Info & Avatar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPass.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={selectedPass.userName}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500 shadow-md"
                      />
                      <div>
                        <h2 className="text-xl font-black text-white">{selectedPass.userName}</h2>
                        <p className="text-xs text-slate-400 font-mono">{selectedPass.userEmail}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-mono">Pass Number</span>
                      <p className="text-sm font-black font-mono text-blue-400">{selectedPass.passNumber}</p>
                    </div>
                  </div>

                  {/* QR Code & Rolling Dynamic TOTP Token (Anti-Screenshot Theft) */}
                  <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 text-center space-y-4 relative overflow-hidden">
                    
                    {/* Pulsing Watermark background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-indigo-500/10 to-transparent pointer-events-none" />

                    <div className="inline-block bg-white p-3 rounded-2xl shadow-2xl relative">
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="Pass Verification QR Code" className="w-48 h-48 mx-auto" />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                          <RefreshCw className="h-8 w-8 animate-spin" />
                        </div>
                      )}

                      {/* Dynamic Pulsing Holographic Security Seal overlay */}
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> SECURE
                      </div>
                    </div>

                    {/* Rolling TOTP Security Code */}
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest font-mono mb-1">
                        Anti-Theft Dynamic Security Code (Updates every 30s)
                      </div>
                      <div className="text-3xl font-black tracking-widest font-mono text-amber-400 bg-slate-900/90 inline-block px-4 py-1.5 rounded-xl border border-amber-500/30 shadow-inner">
                        {totpCode || '849201'}
                      </div>
                    </div>

                  </div>

                  {/* Pass Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 font-mono">
                    <div>
                      <span className="text-slate-500">Route:</span>
                      <p className="text-white font-sans font-bold truncate">{selectedPass.routeName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Concession:</span>
                      <p className="text-indigo-400 font-sans font-bold">{selectedPass.category}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Fare Paid:</span>
                      <p className="text-emerald-400 font-sans font-bold">${selectedPass.farePaid.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Valid From:</span>
                      <p className="text-slate-300">{new Date(selectedPass.validFrom).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Valid Until:</span>
                      <p className="text-slate-300">{new Date(selectedPass.validUntil).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Device Fingerprint:</span>
                      <p className="text-slate-400 truncate">{selectedPass.deviceFingerprint}</p>
                    </div>
                  </div>

                  {/* Cryptographic Signature Hash */}
                  <div className="flex items-center justify-between text-[11px] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 truncate">SIG: {selectedPass.qrSignature}</span>
                    <button
                      onClick={handleCopyHash}
                      className="text-blue-400 hover:text-blue-300 font-bold shrink-0 ml-2"
                    >
                      {copiedNotification ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        id="btn-download-pass"
                        onClick={handleDownloadPNG}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download PNG
                      </button>

                      <button
                        id="btn-print-pass"
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print Pass
                      </button>

                      <button
                        onClick={handleTriggerConfetti}
                        className="flex items-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 px-3 py-2 rounded-xl text-xs font-semibold border border-indigo-500/30 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {selectedPass.status === 'ACTIVE' && (
                      <button
                        onClick={() => onReportLostStolen(selectedPass.id)}
                        className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Report Stolen / Revoke
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
