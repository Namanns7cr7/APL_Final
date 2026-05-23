import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero({ onSimulateClick }) {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-surface bg-opacity-95 z-10" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3kaP8Jq6dEtiXlbvmDfMtEkcZnJZZIq-sOXoRCmSQsZmuz8qgVTgcV_ZK1PPrI0jwQYpLRiEQfbsb0aoDoUah3kzd0PAunzjIGocWwUVnQ8tI_Y5L16SwYXMgDW7e4OSBHa2UlsR7dG5uxaBlHDhEQ29rK2Ge3MrxuMWDhlJyihGJHGr7tn2AQEUXNvq8u2aInFYhkDoeNz3UT1DCwltyllTlTT29sRZassW0CIqGM9Z6jLRggc4oDZhAltsVgNET7TLWN-WWB526')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/80 via-surface/90 to-surface z-20"></div>
        <div className="absolute inset-0 hero-glow z-20"></div>
        <div className="absolute inset-0 z-20 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-30 container mx-auto px-margin max-w-container-max flex flex-col items-center text-center">
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 animate-up">
          <span className="glass-panel px-3 py-1.5 rounded-full font-status-badge text-[10px] text-primary flex items-center gap-2 border-primary/20 bg-primary/5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Gemini Powered
          </span>
          <span className="glass-panel px-3 py-1.5 rounded-full font-status-badge text-[10px] text-secondary flex items-center gap-2 border-secondary/20 bg-secondary/5">
            Firebase Realtime
          </span>
          <span className="glass-panel px-3 py-1.5 rounded-full font-status-badge text-[10px] text-tertiary flex items-center gap-2 border-tertiary/20 bg-tertiary/5">
            GCP Scalable
          </span>
          <span className="glass-panel px-3 py-1.5 rounded-full font-status-badge text-[10px] text-primary-fixed flex items-center gap-2 border-primary-fixed/20 bg-primary-fixed/5">
            Emergency Ready
          </span>
        </div>

        {/* Headings */}
        <h1 className="font-display-lg text-4xl md:text-6xl text-white mb-4 animate-up delay-100 max-w-4xl tracking-tight font-extrabold drop-shadow-lg">
          StadiumPulse AI
        </h1>
        <p className="font-headline-lg text-lg md:text-2xl text-primary mb-3 animate-up delay-200 drop-shadow-md">
          Real-time crowd intelligence for safer cricket match days.
        </p>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant max-w-2xl mb-8 animate-up delay-300">
          An agentic command center that detects bottlenecks, reroutes fan flow, and automates emergency response.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-up delay-300">
          <button 
            onClick={() => navigate('/simulation')}
            className="bg-primary hover:bg-primary-fixed text-on-primary font-label-caps text-xs tracking-wider px-8 py-3.5 rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(98,223,125,0.4)] hover:shadow-[0_0_25px_rgba(98,223,125,0.6)] hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            LAUNCH COMMAND CENTER
          </button>
          <button 
            onClick={onSimulateClick || (() => navigate('/simulation'))}
            className="glass-panel interactive border-primary/50 text-primary hover:bg-white/5 font-label-caps text-xs tracking-wider px-8 py-3.5 rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">vital_signs</span>
            SIMULATE MATCH DAY
          </button>
        </div>
      </div>
    </section>
  )
}
