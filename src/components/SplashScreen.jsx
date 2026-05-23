import React, { useState, useEffect } from 'react'

export default function SplashScreen({ onFinish }) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const steps = [
    "Establishing secure connection to Stadium Server...",
    "Initializing Gemini 2.5 Pro inference engine...",
    "Loading digital twin geometry and live metrics...",
    "Syncing volunteer GPS telemetry...",
    "System Optimal. Launching StadiumPulse..."
  ]

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return p + Math.random() * 8
      })
    }, 150)

    // Text steps animation
    const stepInterval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s))
    }, 450)

    // Finish sequence
    const finishTimeout = setTimeout(() => {
      setIsFadingOut(true)
      setTimeout(() => {
        onFinish()
      }, 500) // matches CSS fade out duration
    }, 2800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearTimeout(finishTimeout)
    }
  }, [onFinish])

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03080F] transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[400px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(ellipse, #62df7d, transparent 70%)' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
        
        {/* Logo Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center border mb-6 animate-pulse" 
             style={{ background: 'rgba(98,223,125,0.05)', borderColor: 'rgba(98,223,125,0.2)', boxShadow: '0 0 40px rgba(98,223,125,0.15)' }}>
          <span className="material-symbols-outlined text-emerald-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
        </div>

        {/* Brand Name */}
        <h1 className="font-black text-3xl text-white tracking-tight uppercase mb-1">
          Stadium<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#9ddf2e]">Pulse</span>
        </h1>
        <p className="font-mono text-[9px] text-emerald-400/60 uppercase tracking-[0.3em] font-black mb-12">
          AI Command Center
        </p>

        {/* Progress Bar Container */}
        <div className="w-full mb-4">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 transition-all duration-200 ease-out"
              style={{ width: `${Math.min(progress, 100)}%`, boxShadow: '0 0 10px #62df7d' }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  )
}
