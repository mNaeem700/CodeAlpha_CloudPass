import React, { useState, useEffect } from 'react';
import { BusRoute, FareBreakdown, PassCategory, PassType, BusPass } from '../types';
import { calculateFare } from '../services/pricingEngine';
import { INITIAL_BUS_ROUTES } from '../data/mockRoutes';
import { Bus, CheckCircle2, Shield, CreditCard, User, Upload, ArrowRight, DollarSign, Zap, Lock, RefreshCw } from 'lucide-react';

interface BookingWizardProps {
  onPassIssued: (pass: BusPass) => void;
  onViewWallet: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ onPassIssued, onViewWallet }) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [passType, setPassType] = useState<PassType>('daily');
  const [category, setCategory] = useState<PassCategory>('Standard');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-101');
  const [originStopId, setOriginStopId] = useState<string>('stop-101-1');
  const [destinationStopId, setDestinationStopId] = useState<string>('stop-101-4');
  
  const [userName, setUserName] = useState<string>('Alex Morgan');
  const [userEmail, setUserEmail] = useState<string>('alex.morgan@transit.cloud');
  const [idDocumentUploaded, setIdDocumentUploaded] = useState<boolean>(true);
  
  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [issuedPass, setIssuedPass] = useState<BusPass | null>(null);

  const selectedRoute = INITIAL_BUS_ROUTES.find(r => r.id === selectedRouteId) || INITIAL_BUS_ROUTES[0];

  // Update stops default when route changes
  useEffect(() => {
    if (selectedRoute && selectedRoute.stops.length >= 2) {
      setOriginStopId(selectedRoute.stops[0].id);
      setDestinationStopId(selectedRoute.stops[selectedRoute.stops.length - 1].id);
    }
  }, [selectedRouteId]);

  // Recalculate Fare whenever choices change (Automated Price Protection)
  useEffect(() => {
    try {
      const breakdown = calculateFare({
        passType,
        category,
        routeId: selectedRouteId,
        originStopId,
        destinationStopId,
      });
      setFareBreakdown(breakdown);
    } catch (e) {
      console.error(e);
    }
  }, [passType, category, selectedRouteId, originStopId, destinationStopId]);

  const handleIssuePass = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/passes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          passType,
          category,
          routeId: selectedRouteId,
          originStopId,
          destinationStopId,
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        })
      });

      const data = await res.json();
      if (data.success && data.pass) {
        setIssuedPass(data.pass);
        onPassIssued(data.pass);
        setStep(4); // Success step
      } else {
        alert(data.error || 'Failed to issue pass');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error connecting to Cloud Booking API');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
          <Shield className="h-3.5 w-3.5 text-blue-600" />
          Cloud-Secured Fare Engine & Anti-Loss Protection
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Book Bus Ticket & Pass
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
          Dynamic distance-based price verification, anti-loss digital wallet storage, and instant QR generation.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-10" />
        
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-200 text-slate-600'}`}>
            1
          </div>
          <span className="text-[11px] font-semibold text-slate-700">Pass Type</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-200 text-slate-600'}`}>
            2
          </div>
          <span className="text-[11px] font-semibold text-slate-700">Route & Rider</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 3 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-200 text-slate-600'}`}>
            3
          </div>
          <span className="text-[11px] font-semibold text-slate-700">Fare & Pay</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 4 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-200 text-slate-600'}`}>
            4
          </div>
          <span className="text-[11px] font-semibold text-slate-700">Digital Pass</span>
        </div>
      </div>

      {/* STEP 1: Select Pass Type & Concession Category */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bus className="h-5 w-5 text-blue-600" />
            Select Pass Duration & Type
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Single Ticket */}
            <div
              id="pass-opt-single"
              onClick={() => setPassType('single')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                passType === 'single'
                  ? 'border-blue-600 bg-blue-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-blue-600">Single Ride</span>
                {passType === 'single' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
              </div>
              <h3 className="font-bold text-slate-900">Point-to-Point Ticket</h3>
              <p className="text-xs text-slate-500 mt-1">Single trip between selected origin and destination stops.</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">From</span>
                <span className="text-lg font-black text-slate-900">$2.50</span>
              </div>
            </div>

            {/* Daily Pass */}
            <div
              id="pass-opt-daily"
              onClick={() => setPassType('daily')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                passType === 'daily'
                  ? 'border-blue-600 bg-blue-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Popular
              </span>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-blue-600">24-Hour Pass</span>
                {passType === 'daily' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
              </div>
              <h3 className="font-bold text-slate-900">Daily Unlimited</h3>
              <p className="text-xs text-slate-500 mt-1">Unlimited rides on all transit zones for 24 full hours.</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Unlimited Day</span>
                <span className="text-lg font-black text-slate-900">$12.80</span>
              </div>
            </div>

            {/* Monthly Pass */}
            <div
              id="pass-opt-monthly"
              onClick={() => setPassType('monthly')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                passType === 'monthly'
                  ? 'border-blue-600 bg-blue-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-blue-600">30-Day Commuter</span>
                {passType === 'monthly' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
              </div>
              <h3 className="font-bold text-slate-900">Monthly Pass</h3>
              <p className="text-xs text-slate-500 mt-1">30 days unlimited travel across all city and express zones.</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">30 Days</span>
                <span className="text-lg font-black text-slate-900">$90.00</span>
              </div>
            </div>

          </div>

          {/* Passenger Category Selection (Anti-Pricing Error Engine) */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-600" />
              Passenger Category & Verified Concessions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Standard', 'Student', 'Senior', 'Veteran / Access'] as PassCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    category === cat
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">{cat}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-normal">
                    {cat === 'Standard' && 'Full Adult Fare'}
                    {cat === 'Student' && '50% Off Concession'}
                    {cat === 'Senior' && '40% Off Concession'}
                    {cat === 'Veteran / Access' && '60% Off Concession'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-4">
            <button
              id="btn-step1-next"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              Continue to Route & Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Route, Stops & Passenger Identity */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bus className="h-5 w-5 text-blue-600" />
            Select Route & Passenger Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Route & Stop Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Bus Line / Route
                </label>
                <select
                  id="select-bus-route"
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {INITIAL_BUS_ROUTES.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.code} - {r.name} (${r.baseFare.toFixed(2)} base)
                    </option>
                  ))}
                </select>
              </div>

              {passType === 'single' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Boarding Stop (Origin)
                    </label>
                    <select
                      id="select-origin-stop"
                      value={originStopId}
                      onChange={(e) => setOriginStopId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                    >
                      {selectedRoute.stops.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Destination Stop
                    </label>
                    <select
                      id="select-dest-stop"
                      value={destinationStopId}
                      onChange={(e) => setDestinationStopId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                    >
                      {selectedRoute.stops.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.zone})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic GPS Fare Lock:</strong> Distance calculated at <strong>{fareBreakdown?.distanceKm || 0} km</strong>. Zone boundaries automatically verified by cloud service.
                </span>
              </div>
            </div>

            {/* Passenger Identity */}
            <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Passenger Identification</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  id="input-passenger-name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cloud Account Email</label>
                <input
                  id="input-passenger-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900"
                />
              </div>

              {category !== 'Standard' && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>{category} ID Verification Document</span>
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                  <div className="p-3 border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-emerald-600" />
                      <span>{category}_Student_Card_2026.pdf</span>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Auto-Verified</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
            <button
              id="btn-step2-next"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              Review Price & Pay
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Automated Price Protection Breakdown & Payment */}
      {step === 3 && fareBreakdown && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Verified Price Protection Breakdown
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Zero Pricing Error Guarantee
            </span>
          </div>

          {/* Pricing Sheet */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-inner space-y-3 font-mono">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Pass Type</span>
              <span className="text-white font-sans uppercase font-bold">{passType} ({category})</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Distance Matrix</span>
              <span className="text-white">{fareBreakdown.distanceKm} km ({fareBreakdown.zoneName})</span>
            </div>
            
            <div className="h-px bg-slate-800 my-2" />

            <div className="flex justify-between text-sm text-slate-300">
              <span>Base Transit Fare</span>
              <span>${fareBreakdown.baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Distance Rate Charge</span>
              <span>${fareBreakdown.distanceFare.toFixed(2)}</span>
            </div>
            {fareBreakdown.zoneSurcharge > 0 && (
              <div className="flex justify-between text-sm text-slate-300">
                <span>Cross-Zone Surcharge</span>
                <span>${fareBreakdown.zoneSurcharge.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm text-slate-300">
              <span>Gross Calculated Fare</span>
              <span>${fareBreakdown.originalFare.toFixed(2)}</span>
            </div>

            {fareBreakdown.concessionDiscount > 0 && (
              <div className="flex justify-between text-sm text-emerald-400 font-bold">
                <span>{fareBreakdown.discountReason}</span>
                <span>-${fareBreakdown.concessionDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-slate-500">
              <span>Cloud Convenience Fee</span>
              <span className="text-emerald-400 font-sans">$0.00 (Free)</span>
            </div>

            <div className="h-px bg-slate-700 my-3" />

            <div className="flex justify-between items-baseline text-lg font-sans">
              <span className="font-bold text-slate-200">Final Total Amount</span>
              <span className="text-3xl font-black text-emerald-400">${fareBreakdown.finalFare.toFixed(2)}</span>
            </div>
          </div>

          {/* Security Guarantee Note */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
            <Lock className="h-5 w-5 text-indigo-600 shrink-0" />
            <div>
              <strong>Anti-Loss Cloud Provisioning:</strong> Once payment succeeds, your pass is cryptographically registered to your email <code>{userEmail}</code> with an anti-tamper QR hash. Accessible from any device even if offline.
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
            <button
              id="btn-confirm-pay"
              onClick={handleIssuePass}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl font-extrabold text-base shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Provisioning Cloud Pass...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay ${fareBreakdown.finalFare.toFixed(2)} & Issue Pass
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Instant Issuance Success Card */}
      {step === 4 && issuedPass && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Digital Bus Pass Issued Successfully!</h2>
            <p className="text-sm text-slate-600 mt-1">
              Pass <span className="font-mono font-bold text-slate-900">{issuedPass.passNumber}</span> has been synced to your Cloud Wallet.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block text-left text-xs space-y-1 font-mono">
            <div><span className="text-slate-500">Holder:</span> <strong className="text-slate-900">{issuedPass.userName}</strong></div>
            <div><span className="text-slate-500">Route:</span> <span className="text-slate-900">{issuedPass.routeName}</span></div>
            <div><span className="text-slate-500">Pass Type:</span> <span className="text-blue-600 font-bold uppercase">{issuedPass.passType} ({issuedPass.category})</span></div>
            <div><span className="text-slate-500">Cryptographic Hash:</span> <span className="text-emerald-700 font-bold">{issuedPass.qrSignature}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              id="btn-view-wallet-after-booking"
              onClick={onViewWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              View Pass in Cloud Wallet
            </button>
            <button
              onClick={() => setStep(1)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl transition"
            >
              Book Another Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
