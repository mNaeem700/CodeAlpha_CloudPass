import React, { useState, useEffect } from 'react';
import { BusRoute } from '../types';
import { INITIAL_BUS_ROUTES } from '../data/mockRoutes';
import { MapPin, Bus, Clock, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const RouteExplorer: React.FC = () => {
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_BUS_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(INITIAL_BUS_ROUTES[0].id);

  useEffect(() => {
    fetch('/api/routes')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.routes && data.routes.length > 0) {
          setRoutes(data.routes);
        }
      })
      .catch(e => console.warn('Could not fetch routes from backend API:', e));
  }, []);

  const route = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Route Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Live Transit Network Explorer
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Bus Routes & Live Schedules
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time GPS bus tracking, live occupancy meters, and stop timetables.
          </p>
        </div>

        {/* Route Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {routes.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                r.id === selectedRouteId
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {r.code}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Route Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg text-lg"
              style={{ backgroundColor: route.color }}
            >
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400 font-mono">{route.category}</span>
              <h2 className="text-xl font-black text-slate-900">{route.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500">Base Fare:</span> <strong className="text-slate-900">${route.baseFare.toFixed(2)}</strong>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div>
              <span className="text-slate-500">Frequency:</span> <strong className="text-slate-900">Every {route.frequencyMins}m</strong>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div>
              <span className="text-slate-500">Distance:</span> <strong className="text-slate-900">{route.totalDistanceKm} km</strong>
            </div>
          </div>
        </div>

        {/* Live Buses on this Route */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Bus className="h-4 w-4 text-blue-600" />
            Active Buses En Route ({route.liveBuses.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {route.liveBuses.map(bus => (
              <div key={bus.id} className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{bus.busNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    bus.status === 'ON_TIME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Driver: <strong className="text-white font-sans">{bus.driverName}</strong></span>
                  <span>{bus.speedKmh} km/h</span>
                </div>

                {/* Occupancy Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Occupancy</span>
                    <span className={bus.occupancyPercent > 80 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {bus.occupancyPercent}% Full
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bus.occupancyPercent > 80 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                      style={{ width: `${bus.occupancyPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stops Sequence Diagram */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Route Stops Sequence & Zones
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-1 before:bg-blue-600/30">
            {route.stops.map((stop, idx) => (
              <div key={stop.id} className="relative flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="absolute -left-[1.375rem] w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md" />
                
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    Stop #{idx + 1} ({stop.code})
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{stop.name}</h4>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-slate-500">{stop.zone}</span>
                  <p className="text-slate-400 text-[11px]">{stop.distanceKmFromStart} km from origin</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
