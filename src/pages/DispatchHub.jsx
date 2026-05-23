import React, { useState, useRef } from 'react'
import Hero from '../components/Hero'
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
  // Map operations tasks to list of actions
  const geminiTasks = tasks.map(t => `${t.team} in ${t.zone}: ${t.action}`)

  return (
    <div className="pb-24 text-on-surface">
      {/* Hero */}
      <Hero onSimulateClick={handleSimulateClick} />

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

      {/* Kanban Board Container */}
      <section ref={simulationRef} className="container mx-auto px-margin max-w-container-max scroll-mt-20 mb-12">
        <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">local_police</span>
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">DISPATCH OPERATIONS KANBAN</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface/30 p-4 rounded">
            {renderColumn('Pending', 'Pending', 'text-on-surface-variant')}
            {renderColumn('In Progress', 'In Progress', 'text-tertiary')}
            {renderColumn('Done', 'Done', 'text-primary')}
          </div>
        </div>
      </section>

      {/* Scenario Simulation Controls specific to dispatch */}
      <section className="container mx-auto px-margin max-w-container-max">
        <div className="glass-panel rounded-xl border-outline-variant p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
            <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">LOAD SCENARIO DISPATCH PROTOCOLS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
