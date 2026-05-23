import React, { useState, useEffect, useRef } from 'react'

function AnimatedNumber({ value, isComma = false, duration = 900 }) {
  const [current, setCurrent] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const start = prev.current
    const end = parseFloat(String(value).replace(/,/g, '')) || 0
    if (start === end) { setCurrent(end); return }
    const t0 = performance.now()
    function update(now) {
      const p = Math.min((now - t0) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      const val = Math.round(start + (end - start) * e)
      setCurrent(val)
      if (p < 1) requestAnimationFrame(update)
      else { setCurrent(end); prev.current = end }
    }
    requestAnimationFrame(update)
  }, [value])

  return <span>{isComma ? current.toLocaleString() : current}</span>
}

// Mini sparkline
function Sparkline({ data, color, height = 20 }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const w = 60, h = height
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-40">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

const METRICS = [
  {
    key: 'fans', icon: 'groups', label: 'Live Attendance', suffix: '', isComma: true,
    color: '#ffffff', trend: '+1,240', trendUp: true, trendColor: '#62df7d',
    desc: 'inside stadium', sparkData: [42000, 44500, 46200, 47100, 48320]
  },
  {
    key: 'capacity', icon: 'pie_chart', label: 'Capacity Utilization', suffix: '%', isComma: false,
    color: '#9ddf2e', trend: '+8%', trendUp: true, trendColor: '#9ddf2e',
    desc: 'of 90,000 seats', sparkData: [55, 60, 65, 68, 72]
  },
  {
    key: 'risk', icon: 'warning', label: 'Active Threat Zones', suffix: '', isComma: false,
    color: '#ff6b6b', trend: '+1', trendUp: true, trendColor: '#ff6b6b', isRisk: true,
    desc: 'require attention', sparkData: [1, 1, 2, 2, 3]
  },
  {
    key: 'ai', icon: 'psychology', label: 'AI Confidence', suffix: '%', isComma: false,
    color: '#62df7d', trend: '+2.4%', trendUp: true, trendColor: '#62df7d',
    desc: 'gemini 2.5 pro', sparkData: [86, 88, 89, 90, 91]
  },
  {
    key: 'wait', icon: 'timer', label: 'Gate Clearance', suffix: 'm', isComma: false,
    color: '#ffb95f', trend: '−3m', trendUp: false, trendColor: '#62df7d',
    desc: 'avg gate wait', sparkData: [22, 19, 17, 16, 14]
  },
]

export default function Metrics({ fans = 48320, capacity = 72, risk = 3, ai = 91, wait = 14 }) {
  const vals = { fans, capacity, risk, ai, wait }

  return (
    <section className="relative z-10 border-y mx-4 lg:mx-8 rounded-2xl mb-10 overflow-hidden"
      style={{ background: 'rgba(4,10,18,0.85)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(98,223,125,0.35), transparent)' }} />

      <div className="grid grid-cols-2 md:grid-cols-5">
        {METRICS.map((m, idx) => {
          const v = vals[m.key]
          const isHighRisk = m.isRisk && v > 5
          return (
            <div key={m.key}
              className={`relative flex flex-col gap-2 px-5 py-5 group transition-all duration-300 hover:bg-white/[0.02] animate-up ${isHighRisk ? 'bg-red-500/[0.03]' : ''}`}
              style={{
                borderRight: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                animationDelay: `${idx * 0.08}s`
              }}>
              {isHighRisk && <div className="absolute inset-0 border border-red-500/20 pointer-events-none animate-pulse" />}

              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${isHighRisk ? 'text-red-400 animate-pulse' : 'text-white/25'}`}
                    style={!isHighRisk ? {} : { fontVariationSettings: "'FILL' 1" }}>
                    {m.icon}
                  </span>
                  <span className="font-mono text-[8px] text-white/35 tracking-widest uppercase font-black">{m.label}</span>
                </div>
                {idx === 0 && (
                  <span className="flex items-center gap-1 text-[7px] font-mono font-black text-emerald-400 uppercase tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />LIVE
                  </span>
                )}
              </div>

              {/* Value + sparkline */}
              <div className="flex items-end justify-between">
                <div className="font-mono text-3xl font-black transition-all duration-300" style={{ color: m.color }}>
                  <AnimatedNumber value={v} isComma={m.isComma} />
                  <span className="text-base font-black">{m.suffix}</span>
                </div>
                <Sparkline data={m.sparkData} color={m.color} />
              </div>

              {/* Trend + desc */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] text-white/25 uppercase tracking-wider font-bold">{m.desc}</span>
                <span className="flex items-center gap-0.5 font-mono text-[8px] font-black" style={{ color: m.trendColor }}>
                  <span className="material-symbols-outlined text-[10px]">{m.trendUp ? 'trending_up' : 'trending_down'}</span>
                  {m.trend}
                </span>
              </div>

              {/* Hover underline */}
              <div className={`absolute bottom-0 left-4 right-4 h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 rounded-full ${isHighRisk ? 'bg-red-400/40' : 'bg-emerald-400/25'}`} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
