import React, { useState, useRef } from 'react'
import Metrics from '../components/Metrics'
import Map from '../components/Map'
import GeminiCommand from '../components/GeminiCommand'
import { scenarioDatabase } from '../data/stadiumData'

const initialTasks = {
  standby: scenarioDatabase.baseline.kanbanTasks,
  surge: scenarioDatabase.crowd_surge.kanbanTasks,
  rain: scenarioDatabase.rain_alert.kanbanTasks
}

const dispatchStates = {
  standby: scenarioDatabase.baseline,
  surge: scenarioDatabase.crowd_surge,
  rain: scenarioDatabase.rain_alert
}

export default function DispatchHub() {
  const [activeScenario, setActiveScenario] = useState('standby')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [tasks, setTasks] = useState(JSON.parse(JSON.stringify(initialTasks.standby)))
  const simulationRef = useRef(null)

  const handleSimulateClick = () => {
    if (simulationRef.current) {
      simulationRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const switchScenario = (scenario) => {
    setActiveScenario(scenario)
    setTasks(JSON.parse(JSON.stringify(initialTasks[scenario] || initialTasks.standby)))
  }

  const resetSimulation = () => {
    switchScenario('standby')
  }

  const cycleStatus = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const nextStatus = 
          task.status === 'Pending' ? 'In Progress' :
          task.status === 'In Progress' ? 'Done' : 'Pending'
        return { ...task, status: nextStatus }
      }
      return task
    }))
  }

  const getPriorityClasses = (priority) => {
    switch(priority) {
      case 'Critical':
        return {
          bg: 'bg-error/20 text-error border border-error/50',
          glow: 'shadow-[0_0_10px_rgba(255,180,171,0.3)]'
        }
      case 'High':
        return {
          bg: 'bg-amber-500/20 text-amber-500 border border-amber-500/50',
          glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]'
        }
      case 'Medium':
        return { bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/50', glow: '' }
      default:
        return { bg: 'bg-gray-500/20 text-gray-400 border border-gray-500/50', glow: '' }
    }
  }

  const renderColumn = (status, headerText, textClass) => {
    const columnTasks = tasks.filter(t => t.status === status)

    return (
      <div className="flex flex-col gap-4 kanban-col bg-surface/10 p-4 rounded border border-white/5">
        <h3 className={`font-label-caps text-xs ${textClass} border-b border-white/10 pb-2 flex justify-between items-center tracking-wider uppercase`}>
          <span>{headerText}</span>
          <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-mono text-[10px]">{columnTasks.length}</span>
        </h3>
        <div className="flex flex-col gap-3 min-h-[300px]">
          {columnTasks.map(task => {
            const pClasses = getPriorityClasses(task.priority)
            const isDone = task.status === 'Done'
            const doneGlow = isDone ? 'shadow-[0_0_15px_rgba(98,223,125,0.15)] border-primary/30' : 'border-white/5 hover:border-white/20'

            return (
              <div 
                key={task.id} 
                className={`glass-panel rounded p-4 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 ${doneGlow}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-status-badge text-[9px] px-2 py-0.5 rounded font-mono ${pClasses.bg} ${pClasses.glow}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="font-terminal-nano text-[9px] text-on-surface-variant bg-surface-container/50 px-2 py-0.5 rounded font-mono">
                    {task.zone.toUpperCase()}
                  </span>
                </div>
                <p className="font-body-md text-xs text-on-surface leading-relaxed mt-1">
                  {task.action}
                </p>
                <div className="flex justify-between items-center mt-1 pt-2 border-t border-white/5">
                  <span className="font-label-caps text-[9px] text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">group</span> 
                    {task.team}
                  </span>
                  <button 
                    onClick={() => cycleStatus(task.id)}
                    className="glass-panel px-2.5 py-1 rounded text-[9px] text-primary hover:text-white border-primary/20 hover:border-primary/40 flex items-center gap-1 cursor-pointer font-status-badge"
                  >
                    <span>CYCLE</span>
                    <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )
          })}
          {columnTasks.length === 0 && (
            <div className="flex-grow flex items-center justify-center border border-dashed border-white/5 rounded py-8">
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase font-mono">No tasks in queue</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const current = dispatchStates[activeScenario] || dispatchStates.standby
  const geminiTasks = tasks.map(t => `${t.team} in ${t.zone}: ${t.action}`)

  return (
    <div className="pb-12 text-on-surface pt-16">
      {/* Tactical Hub Header */}
      <header className="relative w-full border-b border-white/8 bg-[#040A12]/40 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(98,223,125,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-margin max-w-container-max py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_police
              </span>
              <span className="font-mono text-[9px] text-primary tracking-widest uppercase font-black">Volunteer Operations Layer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Volunteer Command Grid</h1>
            <p className="text-xs text-on-surface-variant font-mono max-w-xl">
              Live volunteer deployment, GPS tracking, task dispatch engine, and field responder coordination powered by Gemini crowd analysis.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface/40 border border-white/8 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">DISPATCH OVERVIEW</span>
              <span className="text-sm font-bold text-white font-mono uppercase mt-0.5">Active Units: 14/16</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 mx-1" />
            <span className="flex items-center gap-1.5 text-[9px] font-mono font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Metrics Strip */}
      <Metrics 
        fans={current.fans} 
        capacity={current.capacity} 
        risk={current.risk} 
        ai={current.ai} 
        wait={current.wait} 
      />

      {/* Bento Grid */}
      <main className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Digital Twin Map */}
          <Map nodes={current.nodes} mapText={current.mapText} />

          {/* Gemini Command Panel */}
          <GeminiCommand 
            alertTitle={current.alertTitle}
            alertDesc={current.alertDesc}
            recTitle={current.recTitle}
            recDesc={current.recDesc}
            recConfidence={current.recConfidence}
            opsTasks={geminiTasks}
            onGeneratePlan={() => switchScenario('surge')}
          />
        </div>
      </main>

      {/* ── RESPONDER FIELD TELEMETRY HUD ── */}
      <section className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Responder Cards Grid (8 cols) */}
          <div className="lg:col-span-8 glass-panel rounded-xl border border-white/8 p-6 flex flex-col gap-6 shadow-2xl bg-[#040A12]/80">
            <div className="flex justify-between items-center border-b border-white/8 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  satellite_alt
                </span>
                <h3 className="font-mono text-[9.5px] text-primary tracking-widest uppercase font-black">ACTIVE FIELD UNITS TELEMETRY</h3>
              </div>
              <span className="text-[8px] font-mono text-on-surface-variant uppercase tracking-widest font-bold">4 UNITS CONNECTED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'alpha', name: 'ALPHA-1', role: 'Crowd Marshal', zone: 'North Gate C', status: 'Optimal', sig: 98, bat: 84, color: 'text-primary border-primary/20 bg-primary/4' },
                { id: 'bravo', name: 'BRAVO-2', role: 'Security Patrol', zone: 'South Concourse', status: 'Mobilising', sig: 92, bat: 79, color: 'text-tertiary border-tertiary/20 bg-tertiary/4' },
                { id: 'med', name: 'MED-LEAD', role: 'First Aid Unit', zone: 'Block 104 Upper', status: 'Securing', sig: 95, bat: 92, color: 'text-error border-error/20 bg-error/4' },
                { id: 'delta', name: 'DELTA-1', role: 'VIP Steward', zone: 'East Pavilion', status: 'Standby', sig: 99, bat: 89, color: 'text-secondary border-secondary/20 bg-secondary/4' },
              ].map(unit => (
                <div key={unit.id} className="glass-panel rounded-xl border border-white/6 p-4 flex flex-col justify-between gap-3 bg-[#06101c]/45 relative overflow-hidden transition-all hover:scale-[1.02] hover:border-white/12 cursor-default group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-current opacity-70" style={{ color: unit.id === 'alpha' ? '#62df7d' : unit.id === 'bravo' ? '#ffb95f' : unit.id === 'med' ? '#ffb4ab' : '#9ddf2e' }} />
                  <div className="flex justify-between items-start pl-2">
                    <div>
                      <h4 className="font-mono text-xs font-black text-white">{unit.name}</h4>
                      <p className="text-[9px] text-on-surface-variant font-mono uppercase tracking-wider font-bold mt-0.5">{unit.role}</p>
                    </div>
                    <span className={`font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${unit.color}`}>
                      {unit.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1 pl-2 border-t border-white/5 pt-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7.5px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">Signal Bandwidth</span>
                      <span className="text-[10px] font-mono font-black text-white flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-primary">wifi</span> {unit.sig}%
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7.5px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">Battery Status</span>
                      <span className="text-[10px] font-mono font-black text-white flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-secondary">battery_full</span> {unit.bat}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 pl-2 pt-2 border-t border-white/5 opacity-85 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-mono text-on-surface-variant uppercase tracking-wider font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">location_on</span>
                      {unit.zone}
                    </span>
                    <button onClick={() => {
                      setSelectedTeam(unit.name)
                      setTimeout(() => setSelectedTeam(null), 3000)
                    }} className="px-2 py-0.5 bg-white/5 border border-white/8 rounded font-mono text-[8px] font-black uppercase tracking-wider text-primary hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer">
                      PING GPS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Log / Comms Log (4 cols) */}
          <div className="lg:col-span-4 glass-panel rounded-xl border border-white/8 p-6 flex flex-col gap-4 shadow-2xl bg-[#040A12]/80">
            <div className="flex justify-between items-center border-b border-white/8 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  spatial_tracking
                </span>
                <h3 className="font-mono text-[9.5px] text-secondary tracking-widest uppercase font-black">GPS PING CHANNELS</h3>
              </div>
              <span className="text-[8px] font-mono text-error font-black animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                ACTIVE RX
              </span>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex-grow flex flex-col gap-3 font-mono text-[9.5px] text-on-surface-variant max-h-[260px] overflow-y-auto leading-normal">
              {selectedTeam ? (
                <div className="flex flex-col gap-2 p-2 rounded border border-primary/20 bg-primary/4 alert-enter">
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-black uppercase tracking-wider">LOCATING RESPONDER...</span>
                    <span className="material-symbols-outlined text-primary text-xs animate-spin">sync</span>
                  </div>
                  <p className="text-white text-[9.5px]">GPS satellite ping sent successfully to {selectedTeam}. Established secure channel 22. Status: Nominal.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 text-on-surface-variant font-mono">
                  <p className="text-primary font-black uppercase tracking-wider">// SYSTEM DIAGNOSTIC CHANNELS</p>
                  <p className="leading-snug mt-1">1. Sat-Link #12: Established link with satellite receiver APL-4.</p>
                  <p className="leading-snug">2. VHF Frequency 144.250MHz: Enforcing encryption protocol AES-256.</p>
                  <p className="leading-snug">3. Mobile units: 4/4 squads checking in every 5 seconds. GPS lock is green.</p>
                  <p className="leading-snug mt-1.5 text-secondary">// CLICK PING GPS TO TEST LIVE ENCRYPTION CHANNELS</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Kanban Board Container */}
      <section ref={simulationRef} className="container mx-auto px-margin max-w-container-max scroll-mt-20 mb-12">
        <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">VOLUNTEER DEPLOYMENT BOARD</h2>
            </div>
            <button 
              onClick={resetSimulation}
              className="glass-panel px-3 py-1.5 rounded font-label-caps text-[10px] text-on-surface-variant hover:text-primary border-outline-variant hover:border-primary/50 transition-all flex items-center gap-2 cursor-pointer uppercase"
            >
              <span className="material-symbols-outlined text-sm">refresh</span> 
              RESET BOARD
            </button>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-surface/30 p-6 rounded">
            {renderColumn('Pending', 'Pending', 'text-on-surface-variant')}
            {renderColumn('In Progress', 'In Progress', 'text-tertiary')}
            {renderColumn('Done', 'Done', 'text-primary')}
          </div>
        </div>
      </section>

      {/* Scenario Simulation Controls specific to dispatch */}
      <section className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="glass-panel rounded-xl border-outline-variant p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">LOAD SCENARIO DISPATCH PROTOCOLS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <button 
              onClick={() => switchScenario('standby')}
              className={`glass-panel p-4 rounded text-left border hover:border-primary/40 hover:bg-white/5 transition-all cursor-pointer group flex justify-between items-center ${
                activeScenario === 'standby' ? 'border-primary/60 bg-white/5 shadow-[0_0_15px_rgba(98,223,125,0.15)]' : 'border-white/10'
              }`}
            >
              <div>
                <h4 className="font-label-caps text-[10px] text-white tracking-wider uppercase mb-1">Standby Mode</h4>
                <p className="text-[10px] text-on-surface-variant">Verify baseline operations.</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">play_circle</span>
            </button>

            <button 
              onClick={() => switchScenario('surge')}
              className={`glass-panel p-4 rounded text-left border hover:border-primary/40 hover:bg-white/5 transition-all cursor-pointer group flex justify-between items-center ${
                activeScenario === 'surge' ? 'border-primary/60 bg-white/5 shadow-[0_0_15px_rgba(98,223,125,0.15)]' : 'border-white/10'
              }`}
            >
              <div>
                <h4 className="font-label-caps text-[10px] text-white tracking-wider uppercase mb-1">Post-Match Surge</h4>
                <p className="text-[10px] text-on-surface-variant">Direct overflow scanning.</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">play_circle</span>
            </button>

            <button 
              onClick={() => switchScenario('rain')}
              className={`glass-panel p-4 rounded text-left border hover:border-primary/40 hover:bg-white/5 transition-all cursor-pointer group flex justify-between items-center ${
                activeScenario === 'rain' ? 'border-primary/60 bg-white/5 shadow-[0_0_15px_rgba(98,223,125,0.15)]' : 'border-white/10'
              }`}
            >
              <div>
                <h4 className="font-label-caps text-[10px] text-white tracking-wider uppercase mb-1">Rain Alert</h4>
                <p className="text-[10px] text-on-surface-variant">Concourse crowd shelter.</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">play_circle</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
