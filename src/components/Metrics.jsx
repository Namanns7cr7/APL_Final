import React, { useState, useEffect } from 'react'

function AnimatedNumber({ value, isComma = false, duration = 800 }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let start = current
    const end = parseFloat(String(value).replace(/,/g, '')) || 0
    if (start === end) return

    const startTime = performance.now()

    function update(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out quad
      const ease = progress * (2 - progress)
      const nextVal = Math.round(start + (end - start) * ease)

      setCurrent(nextVal)

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        setCurrent(end)
      }
    }

    requestAnimationFrame(update)
  }, [value])

  return (
    <span>
      {isComma ? current.toLocaleString() : current}
    </span>
  )
}

export default function Metrics({ fans = 48320, capacity = 72, risk = 3, ai = 91, wait = 14 }) {
  const isHighRisk = risk > 5

  return (
    <section className="relative z-40 -mt-16 container mx-auto px-margin max-w-container-max mb-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-base">
        {/* Metric 1 */}
        <div className="glass-panel interactive p-panel-padding rounded-lg relative overflow-hidden group animate-up delay-100">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">group</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">FANS INSIDE</span>
          </div>
          <div className="font-metric-xl text-3xl md:text-4xl text-white font-mono">
            <AnimatedNumber value={fans} isComma={true} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel interactive p-panel-padding rounded-lg relative overflow-hidden group animate-up delay-200">
          <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">pie_chart</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">CAPACITY</span>
          </div>
          <div className="font-metric-xl text-3xl md:text-4xl text-secondary font-mono">
            <AnimatedNumber value={capacity} />%
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`glass-panel interactive p-panel-padding rounded-lg relative overflow-hidden transition-all duration-300 ${
          isHighRisk 
            ? 'border-error bg-error/5 shadow-[0_0_25px_rgba(255,180,171,0.3)]' 
            : 'border-error/30 shadow-[0_0_15px_rgba(255,180,171,0.1)]'
        } animate-up delay-300`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-error text-sm animate-pulse">warning</span>
            <span className="font-label-caps text-[10px] text-error tracking-wider uppercase">HIGH RISK ZONES</span>
          </div>
          <div className="font-metric-xl text-3xl md:text-4xl text-error font-mono">
            <AnimatedNumber value={risk} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel interactive p-panel-padding rounded-lg relative overflow-hidden group animate-up delay-400">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">memory</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">AI CONFIDENCE</span>
          </div>
          <div className="font-metric-xl text-3xl md:text-4xl text-primary font-mono">
            <AnimatedNumber value={ai} />%
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass-panel interactive p-panel-padding rounded-lg relative overflow-hidden group animate-up delay-500">
          <div className="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">timer</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">AVG WAIT TIME</span>
          </div>
          <div className="font-metric-xl text-3xl md:text-4xl text-tertiary font-mono">
            <AnimatedNumber value={wait} />m
          </div>
        </div>
      </div>
    </section>
  )
}
