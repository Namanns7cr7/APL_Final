import React, { useState, useRef } from 'react'
import Metrics from '../components/Metrics'
import Map from '../components/Map'
import GeminiCommand from '../components/GeminiCommand'

import { scenarioDatabase } from '../data/stadiumData'

const routingScenarios = {
  default: scenarioDatabase.baseline,
  rain: scenarioDatabase.rain_alert
}

export default function DynamicRouting() {
  const [scenarioId, setScenarioId] = useState('default')
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const simulationRef = useRef(null)

  const handleSimulateClick = () => {
    if (simulationRef.current) {
      simulationRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scenario = routingScenarios[scenarioId] || routingScenarios.default

  // Filter routes on the map: if one is selected, highlight only that one, or display all.
  const mapRoutes = selectedRouteId 
    ? scenario.routes.filter(r => r.id === selectedRouteId) 
    : scenario.routes

  const textColors = {
    primary: 'text-primary',
    tertiary: 'text-tertiary',
    secondary: 'text-secondary',
    error: 'text-error'
  }

  return (
    <div className="pb-12 text-on-surface pt-16">
      {/* Tactical Hub Header */}
      <header className="relative w-full border-b border-white/8 bg-[#040A12]/40 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,185,95,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-margin max-w-container-max py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                route
              </span>
              <span className="font-mono text-[9px] text-tertiary tracking-widest uppercase font-black">AI Crowd Flow Optimizer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">AI Smart Routing</h1>
            <p className="text-xs text-on-surface-variant font-mono max-w-xl">
              Live pedestrian bypass networks, flow pressure shifting, and AI-powered dynamic routing paths for 90,000 fans — mapped in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface/40 border border-white/8 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">ROUTING OVERVIEW</span>
              <span className="text-sm font-bold text-white font-mono uppercase mt-0.5">Active Routes: 6 Pathsets</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 mx-1" />
            <span className="flex items-center gap-1.5 text-[9px] font-mono font-black text-tertiary uppercase tracking-widest bg-tertiary/10 border border-tertiary/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              ACTIVE
            </span>
          </div>
        </div>
      </header>

      {/* Metrics */}
      <Metrics 
        fans={scenario.fans} 
        capacity={scenario.capacity} 
        risk={scenario.risk} 
        ai={scenario.ai} 
        wait={scenario.wait} 
      />

      {/* Bento Grid */}
      <main className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Digital Twin Map */}
          <Map nodes={scenario.nodes} routes={mapRoutes} mapText={scenario.mapText} />

          {/* Gemini Command Panel */}
          <GeminiCommand 
            alertTitle={scenario.alertTitle}
            alertDesc={scenario.alertDesc}
            recTitle={scenario.recTitle}
            recDesc={scenario.recDesc}
            recConfidence={scenario.recConfidence}
            onGeneratePlan={() => setScenarioId('rain')}
          />
        </div>
      </main>

      {/* Dynamic Routing Cards */}
      <section ref={simulationRef} className="container mx-auto px-margin max-w-container-max scroll-mt-20 mb-12">
        <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                route
              </span>
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">DYNAMIC ROUTING CONTROL</h2>
            </div>
            <span className="font-status-badge text-[10px] text-on-surface-variant flex items-center gap-2 bg-surface/50 px-3 py-1.5 rounded-full border border-white/5 uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Active Protocols
            </span>
          </div>

          {/* Route Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scenario.routes.map((route, index) => {
              const active = selectedRouteId === route.id
              const txtColor = textColors[route.color] || 'text-primary'

              return (
                <div 
                  key={route.id}
                  onClick={() => setSelectedRouteId(active ? null : route.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`glass-panel border rounded-lg p-5 relative overflow-hidden group hover:border-primary/40 transition-all route-card-enter shadow-[0_0_15px_rgba(0,0,0,0.3)] cursor-pointer ${
                    active ? 'border-primary/60 bg-primary/5 shadow-[0_0_20px_rgba(98,223,125,0.15)]' : 'border-white/10 bg-surface/30'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-[2px] text-primary/50 marching-ants ${active ? 'text-primary' : ''}`}></div>
                  
                  {/* Route Header */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex flex-col w-1/3">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">ORIGIN</span>
                      <span className="font-bold text-on-surface text-base leading-tight truncate">{route.from}</span>
                    </div>
                    
                    <div className="flex items-center text-primary px-2 flex-grow justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-white/10"></div>
                      </div>
                      <span className={`material-symbols-outlined text-xs arrow-move bg-[#0b1422] px-1 relative z-10 ${txtColor}`}>
                        arrow_forward_ios
                      </span>
                    </div>
                    
                    <div className="flex flex-col w-1/3 text-right">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">DESTINATION</span>
                      <span className="font-bold text-on-surface text-base leading-tight truncate">{route.to}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-surface-variant/30 border border-white/5 rounded p-2 mb-4 flex items-center gap-2">
                    <span className={`material-symbols-outlined text-sm ${txtColor}`}>info</span>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase">TRIGGER EVENT</span>
                      <span className="text-xs text-on-surface font-medium">{route.reason}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">WAIT REDUCTION</span>
                      <span className={`${txtColor} font-mono font-bold text-sm`}>{route.wait}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-2">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">SAFETY IMPACT</span>
                      <span className={`${txtColor} font-mono font-bold text-sm`}>{route.impact}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-2">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">PRESSURE SHIFT</span>
                      <span className={`${txtColor} font-mono font-bold text-sm`}>{route.pressure}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Protocol Toggle */}
      <section className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="glass-panel rounded-xl border-outline-variant p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">SELECT ROUTING SCENARIO</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <button 
              onClick={() => { setScenarioId('default'); setSelectedRouteId(null); }}
              className={`glass-panel p-4 rounded text-left border hover:border-primary/40 hover:bg-white/5 transition-all cursor-pointer group flex justify-between items-center ${
                scenarioId === 'default' ? 'border-primary/60 bg-white/5 shadow-[0_0_15px_rgba(98,223,125,0.15)]' : 'border-white/10'
              }`}
            >
              <div>
                <h4 className="font-label-caps text-[10px] text-white tracking-wider uppercase mb-1">Standard Egress</h4>
                <p className="text-[10px] text-on-surface-variant font-mono">Load baseline flow diversions.</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">play_circle</span>
            </button>

            <button 
              onClick={() => { setScenarioId('rain'); setSelectedRouteId(null); }}
              className={`glass-panel p-4 rounded text-left border hover:border-primary/40 hover:bg-white/5 transition-all cursor-pointer group flex justify-between items-center ${
                scenarioId === 'rain' ? 'border-primary/60 bg-white/5 shadow-[0_0_15px_rgba(98,223,125,0.15)]' : 'border-white/10'
              }`}
            >
              <div>
                <h4 className="font-label-caps text-[10px] text-white tracking-wider uppercase mb-1">Concourse Shelter</h4>
                <p className="text-[10px] text-on-surface-variant font-mono">Redirect fans to indoor sectors.</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">play_circle</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
