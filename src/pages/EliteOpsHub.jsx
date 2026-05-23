import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Metrics from '../components/Metrics'
import Map from '../components/Map'
import GeminiCommand from '../components/GeminiCommand'
import AnalyticsSuite from '../components/AnalyticsSuite'
import { scenarioDatabase } from '../data/stadiumData'

export default function EliteOpsHub() {
  const navigate = useNavigate()
  const simulationRef = useRef(null)

  const baseline = scenarioDatabase.baseline

  const handleSimulateClick = () => {
    if (simulationRef.current) {
      simulationRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="pb-24 text-on-surface">
      {/* Hero Section */}
      <Hero onSimulateClick={handleSimulateClick} />

      {/* Metrics Strip */}
      <Metrics fans={baseline.fans} capacity={baseline.capacity} risk={baseline.risk} ai={baseline.ai} wait={baseline.wait} />

      {/* Bento Grid */}
      <main className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Digital Twin Map */}
          <Map nodes={baseline.nodes} mapText={baseline.mapText} sectors={baseline.sectors} />

          {/* Gemini Command Panel */}
          <GeminiCommand 
            alertTitle={baseline.alertTitle}
            alertDesc={baseline.alertDesc}
            recTitle={baseline.recTitle}
            recDesc={baseline.recDesc}
            recConfidence={baseline.recConfidence}
            onGeneratePlan={() => navigate('/simulation')}
          />
        </div>
      </main>

      {/* Live Data Analytics */}
      <section className="container mx-auto px-margin max-w-container-max mb-12">
        <AnalyticsSuite analytics={baseline.analytics} />
      </section>

      {/* Interactive Scenario Preview & System Architecture */}
      <section ref={simulationRef} className="container mx-auto px-margin max-w-container-max mb-12 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* Scenario Simulation Card */}
          <div className="glass-panel interactive rounded-xl flex flex-col border-outline-variant p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">SCENARIO SIMULATION</h2>
              <span className="glass-panel px-2 py-1 rounded font-status-badge text-[9px] text-tertiary border-tertiary/30 bg-tertiary/5 uppercase">
                Demo Engine Ready
              </span>
            </div>
            
            <div className="flex flex-col gap-4">
              <div 
                onClick={() => navigate('/simulation')} 
                className="border border-white/10 rounded p-4 hover:bg-white/5 hover:border-primary/30 transition-all cursor-pointer group flex justify-between items-start"
              >
                <div>
                  <h3 className="font-label-caps text-xs text-on-surface tracking-wider uppercase mb-1">CROWD SURGE (POST-MATCH)</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">Simulate massive outflow from all stands simultaneously. Tests bottleneck prediction algorithms.</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-2xl">
                  play_circle
                </span>
              </div>

              <div 
                onClick={() => navigate('/simulation')} 
                className="border border-white/10 rounded p-4 hover:bg-white/5 hover:border-primary/30 transition-all cursor-pointer group flex justify-between items-start"
              >
                <div>
                  <h3 className="font-label-caps text-xs text-on-surface tracking-wider uppercase mb-1">RAIN ALERT / SHELTER</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">Simulate sudden rain event forcing fans into concourses. Evaluates indoor density management.</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-2xl">
                  play_circle
                </span>
              </div>
            </div>
          </div>

          {/* System Architecture Flowchart */}
          <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">SYSTEM ARCHITECTURE</h2>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">account_tree</span>
            </div>

            <div className="flex-grow flex items-center justify-center bg-surface/30 rounded py-4">
              <div className="flex flex-col items-center w-full max-w-sm gap-2">
                <div className="glass-panel interactive w-full p-2.5 rounded text-center border-primary/20 bg-surface/50">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase">IoT SENSORS &amp; CAMERAS</span>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-lg animate-pulse">arrow_downward</span>
                <div className="glass-panel interactive w-full p-2.5 rounded text-center border-secondary/20 bg-surface/50">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase">GCP PUB/SUB</span>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-lg animate-pulse">arrow_downward</span>
                <div className="glass-panel interactive w-full p-2.5 rounded text-center border-tertiary/20 bg-surface/50">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase">CLOUD FUNCTIONS &amp; GEMINI AI</span>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-lg animate-pulse">arrow_downward</span>
                <div className="bg-primary/10 w-full p-2.5 rounded text-center border border-primary/40 shadow-[0_0_15px_rgba(98,223,125,0.15)]">
                  <span className="font-label-caps text-[10px] text-primary font-bold tracking-wider uppercase">FIRESTORE REALTIME UPDATE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fan Comm & Radio Section */}
      <section className="container mx-auto px-margin max-w-container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* Fan Comm Preview (Smartphone Mockup) */}
          <div className="glass-panel rounded-xl flex flex-col border-outline-variant overflow-hidden p-6 items-center">
            <div className="flex justify-between items-center w-full mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  cell_tower
                </span>
                <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">FAN COMM PREVIEW</h2>
              </div>
              <span className="glass-panel px-3 py-1 rounded-full font-status-badge text-[9px] text-primary border-primary/20 bg-primary/5 uppercase">
                FCM Ready
              </span>
            </div>

            {/* Smartphone Container Mockup */}
            <div className="w-[280px] h-[480px] bg-black rounded-[2.5rem] border-8 border-surface-variant p-3 relative shadow-2xl overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-surface-variant rounded-b-xl z-20"></div>
              {/* Screen Content */}
              <div className="bg-surface-container-low w-full h-full rounded-[2rem] overflow-hidden flex flex-col pt-6">
                <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-surface/50">
                  <span className="text-[10px] font-bold text-white font-mono uppercase">Stadium App</span>
                  <span className="material-symbols-outlined text-white text-xs">notifications</span>
                </div>
                <div className="flex-grow p-3 flex flex-col gap-2.5 overflow-y-auto">
                  <div className="bg-surface-variant/80 rounded-lg p-2.5 border-l-4 border-primary shadow-md">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-primary text-[10px]">info</span>
                      <span className="text-[9px] font-bold text-white uppercase font-mono">Alert</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Fans near Gate A are requested to proceed to Gate C for faster and safer entry.
                    </p>
                  </div>

                  <div className="bg-surface-variant/80 rounded-lg p-2.5 border-l-4 border-tertiary shadow-md">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-tertiary text-[10px]">water_drop</span>
                      <span className="text-[9px] font-bold text-white uppercase font-mono">Weather Update</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Rain alert: Covered concourse access is open through South Stand.
                    </p>
                  </div>

                  <div className="bg-surface-variant/80 rounded-lg p-2.5 border-l-4 border-error shadow-md opacity-60">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-error text-[10px]">medical_services</span>
                      <span className="text-[9px] font-bold text-white uppercase font-mono">Medical</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Medical team is responding near North Stand. Please keep the lane clear.
                    </p>
                  </div>

                  <div className="bg-surface-variant/80 rounded-lg p-2.5 border-l-4 border-secondary shadow-md opacity-60">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-secondary text-[10px]">directions_walk</span>
                      <span className="text-[9px] font-bold text-white uppercase font-mono">Exit Route</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Post-match exit traffic is high near Metro Exit. Use Parking Exit route.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Radio Messages */}
          <div className="glass-panel rounded-xl flex flex-col border-outline-variant overflow-hidden p-6">
            <div className="flex justify-between items-center w-full mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  headset_mic
                </span>
                <h2 className="font-label-caps text-xs text-secondary tracking-widest uppercase">STAFF RADIO MESSAGES</h2>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">wifi_tethering</span>
            </div>

            <div className="p-4 flex-grow bg-[#07111F]/60 rounded border border-white/5 relative overflow-hidden h-[480px] flex flex-col">
              {/* Fade filters */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#07111F] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#07111F] to-transparent z-10 pointer-events-none"></div>

              {/* Looping Radio Text */}
              <div className="relative flex-grow overflow-hidden font-mono text-xs text-on-surface-variant">
                <div className="absolute w-full scrolling-log flex flex-col gap-3 py-6">
                  {/* Set 1 */}
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:02:11</span>
                    <span className="text-secondary font-bold font-mono">[Alpha-1]</span>
                    <span className="text-on-surface">Gate C clear, moving to D.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:03:45</span>
                    <span className="text-tertiary font-bold font-mono">[Echo-Lead]</span>
                    <span className="text-on-surface">Medical on site at North Stand.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:04:20</span>
                    <span className="text-primary font-bold font-mono">[Command]</span>
                    <span className="text-primary font-bold">Copy that Echo. Deploying backup.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:07:05</span>
                    <span className="text-error font-bold font-mono">[Bravo-2]</span>
                    <span className="text-on-surface">Bottleneck forming at Metro exit.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:08:12</span>
                    <span className="text-primary font-bold font-mono">[Command]</span>
                    <span className="text-primary font-bold">Bravo-2, redirecting flow via App.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:10:33</span>
                    <span className="text-secondary font-bold font-mono">[Alpha-3]</span>
                    <span className="text-on-surface">South concourse secure.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:12:01</span>
                    <span className="text-tertiary font-bold font-mono">[Delta-1]</span>
                    <span className="text-on-surface">VIP parking route engaged.</span>
                  </div>

                  {/* Set 2 (duplication for seamless animation scroll) */}
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:02:11</span>
                    <span className="text-secondary font-bold font-mono">[Alpha-1]</span>
                    <span className="text-on-surface">Gate C clear, moving to D.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:03:45</span>
                    <span className="text-tertiary font-bold font-mono">[Echo-Lead]</span>
                    <span className="text-on-surface">Medical on site at North Stand.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:04:20</span>
                    <span className="text-primary font-bold font-mono">[Command]</span>
                    <span className="text-primary font-bold">Copy that Echo. Deploying backup.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:07:05</span>
                    <span className="text-error font-bold font-mono">[Bravo-2]</span>
                    <span className="text-on-surface">Bottleneck forming at Metro exit.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:08:12</span>
                    <span className="text-primary font-bold font-mono">[Command]</span>
                    <span className="text-primary font-bold">Bravo-2, redirecting flow via App.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:10:33</span>
                    <span className="text-secondary font-bold font-mono">[Alpha-3]</span>
                    <span className="text-on-surface">South concourse secure.</span>
                  </div>
                  <div className="flex items-start gap-2 border-b border-white/5 pb-1">
                    <span className="text-surface-variant text-[10px]">14:12:01</span>
                    <span className="text-tertiary font-bold font-mono">[Delta-1]</span>
                    <span className="text-on-surface">VIP parking route engaged.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
