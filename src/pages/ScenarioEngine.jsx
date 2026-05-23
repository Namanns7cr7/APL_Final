import React, { useState, useRef } from 'react'
import Hero from '../components/Hero'
import Metrics from '../components/Metrics'
import Map from '../components/Map'
import GeminiCommand from '../components/GeminiCommand'
import AnalyticsSuite from '../components/AnalyticsSuite'

import { scenarioDatabase } from '../data/stadiumData'

export default function ScenarioEngine() {
  const [activeScenario, setActiveScenario] = useState('baseline')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  
  // Manage Kanban Tasks locally so users can interact and move cards
  const [tasks, setTasks] = useState(JSON.parse(JSON.stringify(scenarioDatabase.baseline.kanbanTasks)))

  const simulationRef = useRef(null)

  const handleSimulateClick = () => {
    if (simulationRef.current) {
      simulationRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ===================================================
  // CLOUD FUNCTION + GEMINI AI BACKEND CONNECTION POINT
  // ===================================================
  // In production, the triggerScenario function makes a POST fetch request to
  // the Google Cloud Functions orchestration server:
  //
  // async function triggerScenario(scenarioId) {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('https://us-central1-stadiumpulse-ai.cloudfunctions.net/simulateMatchday', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ scenario: scenarioId })
  //     });
  //     const data = await response.json();
  //     // The server parses data generated dynamically by Gemini Pro via:
  //     // genAI.getGenerativeModel({ model: "gemini-1.5-pro" }).generateContent(...)
  //     // We then apply the returned metrics, alert text, recommendations, FCM pushes, and task cards:
  //     // applyState(data);
  //   } catch(err) {
  //     console.error("Gemini Cloud Function failed:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  //
  // Below is the mock implementation designed to run client-side for rapid prototyping:
  const triggerScenario = (scenarioId) => {
    setIsLoading(true)
    setSelectedRouteId(null) // Reset active route highlight
    setTimeout(() => {
      setActiveScenario(scenarioId)
      const data = scenarioDatabase[scenarioId] || scenarioDatabase.baseline
      setTasks(JSON.parse(JSON.stringify(data.kanbanTasks)))
      setIsLoading(false)
    }, 1000) // 1-second simulated network / analysis delay
  }

  const resetSimulation = () => {
    triggerScenario('baseline')
  }

  const cycleTaskStatus = (taskId) => {
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

  const current = scenarioDatabase[activeScenario] || scenarioDatabase.baseline

  // Extract tasks for GeminiCommand summary dispatch task mapping
  const geminiTasks = tasks.map(t => `${t.team} in ${t.zone}: ${t.action}`)

  // Handle active routes on map based on card selection
  const activeRoutes = selectedRouteId 
    ? current.routes.filter(r => r.id === selectedRouteId) 
    : current.routes

  const textColors = {
    primary: 'text-primary',
    tertiary: 'text-tertiary',
    secondary: 'text-secondary',
    error: 'text-error'
  }

  const renderKanbanColumn = (status, headerText, textClass) => {
    const colTasks = tasks.filter(t => t.status === status)

    return (
      <div className="flex flex-col gap-4 bg-surface/10 p-4 rounded border border-white/5">
        <h3 className={`font-label-caps text-xs ${textClass} border-b border-white/10 pb-2 flex justify-between items-center tracking-wider uppercase`}>
          <span>{headerText}</span>
          <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-mono text-[10px]">{colTasks.length}</span>
        </h3>
        <div className="flex flex-col gap-3 min-h-[180px]">
          {colTasks.map(task => {
            const pClasses = getPriorityClasses(task.priority)
            const isDone = task.status === 'Done'
            const doneGlow = isDone ? 'shadow-[0_0_15px_rgba(98,223,125,0.15)] border-primary/30' : 'border-white/5 hover:border-white/20'

            return (
              <div 
                key={task.id} 
                className={`glass-panel rounded p-3 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-0.5 ${doneGlow}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-status-badge text-[9px] px-2 py-0.5 rounded font-mono ${pClasses.bg} ${pClasses.glow}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="font-terminal-nano text-[9px] text-on-surface-variant bg-surface-container/50 px-1.5 py-0.5 rounded font-mono">
                    {task.zone.toUpperCase()}
                  </span>
                </div>
                <p className="font-body-md text-xs text-on-surface leading-normal">
                  {task.action}
                </p>
                <div className="flex justify-between items-center mt-1 pt-2 border-t border-white/5">
                  <span className="font-label-caps text-[9px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">group</span> 
                    {task.team}
                  </span>
                  <button 
                    onClick={() => cycleTaskStatus(task.id)}
                    className="glass-panel px-2 py-0.5 rounded text-[8px] text-primary hover:text-white border-primary/20 hover:border-primary/45 flex items-center gap-1 cursor-pointer font-status-badge"
                  >
                    <span>CYCLE</span>
                    <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )
          })}
          {colTasks.length === 0 && (
            <div className="flex-grow flex items-center justify-center border border-dashed border-white/5 rounded py-6">
              <span className="font-label-caps text-[9px] text-on-surface-variant tracking-wider uppercase font-mono">No tasks in queue</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24 text-on-surface">
      {/* Global Loading Overlay for Scenario Transitions */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/85 backdrop-blur-md transition-opacity duration-300">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">
              sync
            </span>
            <p className="font-label-caps text-xs text-primary tracking-widest animate-pulse uppercase">
              Gemini analyzing stadium state...
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
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
          <Map nodes={current.nodes} routes={activeRoutes} mapText={current.mapText} sectors={current.sectors} />

          {/* Gemini Command Panel */}
          <GeminiCommand 
            alertTitle={current.alertTitle}
            alertDesc={current.alertDesc}
            recTitle={current.recTitle}
            recDesc={current.recDesc}
            recConfidence={current.recConfidence}
            opsTasks={geminiTasks}
            onGeneratePlan={() => triggerScenario('crowd_surge')}
          />
        </div>
      </main>

      {/* Analytics Suite */}
      <section className="container mx-auto px-margin max-w-container-max mb-12">
        <AnalyticsSuite analytics={current.analytics} />
      </section>

      {/* Scenario Control Engine & System Architecture */}
      <section ref={simulationRef} className="container mx-auto px-margin max-w-container-max scroll-mt-20 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* Scenario Simulation Panel */}
          <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">tune</span>
                <h2 className="font-label-caps text-xs text-tertiary tracking-widest uppercase">SCENARIO SIMULATION ENGINE</h2>
              </div>
              <button 
                onClick={resetSimulation}
                className="glass-panel px-3 py-1.5 rounded font-status-badge text-[10px] text-on-surface-variant hover:text-white border-white/10 hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer uppercase"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span> 
                RESET SIMULATION
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => triggerScenario('crowd_surge')}
                className={`glass-panel text-left p-3 rounded border-white/10 hover:border-tertiary/50 hover:bg-white/5 transition-all group cursor-pointer ${
                  activeScenario === 'crowd_surge' ? 'border-tertiary bg-white/5 shadow-[0_0_15px_rgba(255,185,95,0.15)]' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase group-hover:text-tertiary transition-colors">CROWD SURGE</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:text-tertiary">play_arrow</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Test massive inflow bottleneck prediction.</p>
              </button>

              <button 
                onClick={() => triggerScenario('rain_alert')}
                className={`glass-panel text-left p-3 rounded border-white/10 hover:border-tertiary/50 hover:bg-white/5 transition-all group cursor-pointer ${
                  activeScenario === 'rain_alert' ? 'border-tertiary bg-white/5 shadow-[0_0_15px_rgba(255,185,95,0.15)]' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase group-hover:text-tertiary transition-colors">RAIN ALERT</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:text-tertiary">play_arrow</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Sudden indoor concourse density spike.</p>
              </button>

              <button 
                onClick={() => triggerScenario('medical')}
                className={`glass-panel text-left p-3 rounded border-white/10 hover:border-error/50 hover:bg-white/5 transition-all group cursor-pointer ${
                  activeScenario === 'medical' ? 'border-error bg-white/5 shadow-[0_0_15px_rgba(255,180,171,0.15)]' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase group-hover:text-error transition-colors">MEDICAL EMERGENCY</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:text-error">play_arrow</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Clear immediate path for responders.</p>
              </button>

              <button 
                onClick={() => triggerScenario('security')}
                className={`glass-panel text-left p-3 rounded border-white/10 hover:border-error/50 hover:bg-white/5 transition-all group cursor-pointer ${
                  activeScenario === 'security' ? 'border-error bg-white/5 shadow-[0_0_15px_rgba(255,180,171,0.15)]' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase group-hover:text-error transition-colors">SECURITY THREAT</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:text-error">play_arrow</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Zone isolation and immediate evacuation routing.</p>
              </button>

              <button 
                onClick={() => triggerScenario('gate_failure')}
                className={`glass-panel text-left p-3 rounded border-white/10 hover:border-tertiary/50 hover:bg-white/5 transition-all group cursor-pointer ${
                  activeScenario === 'gate_failure' ? 'border-tertiary bg-white/5 shadow-[0_0_15px_rgba(255,185,95,0.15)]' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase group-hover:text-tertiary transition-colors">GATE FAILURE</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:text-tertiary">play_arrow</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Scanner malfunction rerouting logistics.</p>
              </button>

              <button 
                onClick={() => triggerScenario('exit_rush')}
                className={`glass-panel text-left p-3 rounded border-white/10 hover:border-tertiary/50 hover:bg-white/5 transition-all group cursor-pointer ${
                  activeScenario === 'exit_rush' ? 'border-tertiary bg-white/5 shadow-[0_0_15px_rgba(255,185,95,0.15)]' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase group-hover:text-tertiary transition-colors">POST-MATCH EXIT</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:text-tertiary">play_arrow</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Massive outflow from all stands simultaneously.</p>
              </button>
            </div>
          </div>

          {/* System Architecture Flowchart */}
          <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">SYSTEM ARCHITECTURE</h2>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">account_tree</span>
            </div>
            <div className="p-panel-padding flex-grow flex items-center justify-center bg-surface/30">
              <div className="flex flex-col items-center w-full max-w-sm gap-2">
                <div className="glass-panel interactive w-full p-2.5 rounded text-center border-primary/20 bg-surface/50">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase font-mono">IoT SENSORS &amp; CAMERAS</span>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-lg animate-pulse">arrow_downward</span>
                <div className="glass-panel interactive w-full p-2.5 rounded text-center border-secondary/20 bg-surface/50">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase font-mono">GCP PUB/SUB</span>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-lg animate-pulse">arrow_downward</span>
                <div className="glass-panel interactive w-full p-2.5 rounded text-center border-tertiary/20 bg-surface/50">
                  <span className="font-label-caps text-[10px] text-on-surface tracking-wider uppercase font-mono">CLOUD FUNCTIONS &amp; GEMINI AI</span>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-lg animate-pulse">arrow_downward</span>
                <div className="bg-primary/10 w-full p-2.5 rounded text-center border border-primary/40 shadow-[0_0_15px_rgba(98,223,125,0.15)]">
                  <span className="font-label-caps text-[10px] text-primary font-bold tracking-wider uppercase font-mono">FIRESTORE REALTIME UPDATE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Routing Cards Section */}
      <section className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                route
              </span>
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">DYNAMIC REROUTING PLAN</h2>
            </div>
            <span className="font-status-badge text-[9px] text-on-surface-variant flex items-center gap-1.5 bg-surface/50 px-3 py-1 rounded-full border border-white/5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Isolate route on click
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {current.routes.map((route, idx) => {
              const active = selectedRouteId === route.id
              const txtColor = textColors[route.color] || 'text-primary'

              return (
                <div 
                  key={route.id}
                  onClick={() => setSelectedRouteId(active ? null : route.id)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  className={`glass-panel border rounded-lg p-5 relative overflow-hidden group hover:border-primary/45 transition-all route-card-enter shadow-[0_0_15px_rgba(0,0,0,0.3)] cursor-pointer ${
                    active ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(98,223,125,0.15)]' : 'border-white/10 bg-surface/30'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-[2px] text-primary/50 marching-ants ${active ? 'text-primary' : ''}`}></div>
                  
                  {/* Route Header */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex flex-col w-1/3">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">ORIGIN</span>
                      <span className="font-bold text-on-surface text-sm leading-tight truncate">{route.from}</span>
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
                      <span className="font-bold text-on-surface text-sm leading-tight truncate">{route.to}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-surface-variant/30 border border-white/5 rounded p-2 mb-4 flex items-center gap-2">
                    <span className={`material-symbols-outlined text-xs ${txtColor}`}>info</span>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase">TRIGGER EVENT</span>
                      <span className="text-xs text-on-surface font-medium">{route.reason}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">WAIT REDUCTION</span>
                      <span className={`${txtColor} font-mono font-bold text-xs`}>{route.wait}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-2">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">SAFETY IMPACT</span>
                      <span className={`${txtColor} font-mono font-bold text-xs`}>{route.impact}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-2">
                      <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase mb-1">PRESSURE SHIFT</span>
                      <span className={`${txtColor} font-mono font-bold text-xs`}>{route.pressure}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {current.routes.length === 0 && (
              <div className="col-span-3 border border-dashed border-white/10 rounded-lg p-6 text-center">
                <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">No active rerouting plans</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kanban Board Section */}
      <section className="container mx-auto px-margin max-w-container-max mb-12">
        <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">local_police</span>
              <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">DISPATCH OPERATIONS BOARD</h2>
            </div>
            <span className="font-status-badge text-[9px] text-on-surface-variant flex items-center gap-1 border border-white/5 bg-surface/50 px-2 py-0.5 rounded-full uppercase">
              Interact to cycle task
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface/30 p-4 rounded">
            {renderKanbanColumn('Pending', 'Pending', 'text-on-surface-variant')}
            {renderKanbanColumn('In Progress', 'In Progress', 'text-tertiary')}
            {renderKanbanColumn('Done', 'Done', 'text-primary')}
          </div>
        </div>
      </section>

      {/* Fan Comm Notification Preview & Radio Log Section */}
      <section className="container mx-auto px-margin max-w-container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* FCM Announcements phone mockup */}
          <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6 items-center">
            <div className="flex justify-between items-center w-full mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  cell_tower
                </span>
                <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">PUSH ANNOUNCEMENTS (FCM)</h2>
              </div>
              <span className="glass-panel px-3 py-1 rounded-full font-status-badge text-[9px] text-primary border-primary/20 bg-primary/5 uppercase">
                PUSH ACTIVE
              </span>
            </div>

            {/* Smartphone Mockup */}
            <div className="w-[280px] h-[450px] bg-black rounded-[2.5rem] border-8 border-surface-variant p-3 relative shadow-2xl overflow-hidden flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-surface-variant rounded-b-xl z-20"></div>
              <div className="bg-surface-container-low w-full h-full rounded-[2rem] overflow-hidden flex flex-col pt-6">
                <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-surface/50">
                  <span className="text-[10px] font-bold text-white font-mono uppercase">Stadium App</span>
                  <span className="material-symbols-outlined text-white text-xs">notifications</span>
                </div>
                <div className="flex-grow p-3 flex flex-col gap-2.5 overflow-y-auto">
                  {current.fcmNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`bg-surface-variant/80 rounded-lg p-2.5 border-l-4 shadow-md transition-all duration-300 animate-[cardEnter_0.3s_ease-out] ${
                        notif.type === 'error' ? 'border-error' :
                        notif.type === 'tertiary' ? 'border-tertiary' :
                        notif.type === 'secondary' ? 'border-secondary' : 'border-primary'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="material-symbols-outlined text-[10px]" style={{ color: 'currentColor' }}>info</span>
                        <span className="text-[9px] font-bold text-white uppercase font-mono">{notif.title}</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        {notif.text}
                      </p>
                    </div>
                  ))}
                  {current.fcmNotifications.length === 0 && (
                    <div className="flex-grow flex items-center justify-center border border-dashed border-white/10 rounded py-8">
                      <span className="font-label-caps text-[9px] text-on-surface-variant uppercase font-mono">No broadcasts sent</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Radio Messages */}
          <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6">
            <div className="flex justify-between items-center w-full mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  headset_mic
                </span>
                <h2 className="font-label-caps text-xs text-secondary tracking-widest uppercase">STAFF RADIO CHANNELS</h2>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">wifi_tethering</span>
            </div>

            <div className="p-4 flex-grow bg-[#07111F]/60 rounded border border-white/5 relative overflow-hidden h-[450px] flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#07111F] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#07111F] to-transparent z-10 pointer-events-none"></div>

              <div className="relative flex-grow overflow-hidden font-mono text-xs text-on-surface-variant">
                <div className="absolute w-full scrolling-log flex flex-col gap-3 py-6">
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

                  {/* Duplicated loop entries */}
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
