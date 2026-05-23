import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Animated crowd particle
function CrowdDot({ x, y, delay, color, size }) {
  return (
    <div className="absolute rounded-full animate-pulse"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color,
        animationDelay: `${delay}s`, animationDuration: `${1.5 + delay * 0.3}s`, opacity: 0.45,
        boxShadow: `0 0 ${size * 2}px ${color}` }} />
  )
}

const CROWD = Array.from({ length: 60 }, (_, i) => ({
  x: 5 + Math.abs(Math.sin(i * 2.3)) * 90,
  y: 5 + Math.abs(Math.cos(i * 1.7)) * 88,
  delay: (i * 0.11) % 2,
  size: 2 + (i % 3),
  color: i % 5 === 0 ? '#ff6b6b' : i % 4 === 0 ? '#ffb95f' : '#62df7d',
}))

const IMPACT_STATS = [
  { val: '62%', label: 'Faster Emergency Response', icon: 'speed', color: '#62df7d' },
  { val: '3,200', label: 'Fans Rerouted in < 2 min', icon: 'route', color: '#9ddf2e' },
  { val: '0', label: 'Crowd Crush Incidents', icon: 'verified_user', color: '#62df7d' },
  { val: '98.4%', label: 'AI Prediction Accuracy', icon: 'psychology', color: '#ffb95f' },
]

const ROLE_CARDS = [
  {
    role: 'Admin · Command Center',
    desc: 'Full stadium visibility, live crowd density, AI recommendations, incident management, and volunteer coordination.',
    icon: 'shield_person',
    color: '#62df7d',
    features: ['Live Crowd Heatmap', 'AI Rerouting Engine', 'Dispatch Orders', 'Egress Protocol'],
    path: '/command'
  },
  {
    role: 'Volunteer · Ground Staff',
    desc: 'Assigned zone monitoring, task queue, emergency protocols, and real-time check-in with command.',
    icon: 'volunteer_activism',
    color: '#ffb95f',
    features: ['Zone Assignment', 'Task Queue', 'Incident Reporting', 'Emergency Alert'],
    path: '/dispatch'
  },
]

export default function Hero({ onSimulateClick }) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [countFans, setCountFans] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    let frame
    const target = 82450
    const start = performance.now()
    const dur = 1800
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setCountFans(Math.round(ease * target))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [visible])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 z-0" style={{ background: '#03080F' }} />
      <div className="absolute inset-0 z-[1] opacity-15"
        style={{ backgroundImage: 'linear-gradient(rgba(98,223,125,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(98,223,125,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute z-[2] top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(ellipse,#62df7d,transparent 70%)' }} />
      <div className="absolute z-[2] bottom-0 right-[10%] w-[500px] h-[400px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(ellipse,#ffb4ab,transparent 70%)' }} />

      {/* Cricket oval SVG */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none">
        <svg viewBox="0 0 800 540" className="w-full h-full max-w-5xl opacity-[0.08]">
          <defs>
            <radialGradient id="oval-glow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#62df7d" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#62df7d" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="385" y="220" width="30" height="100" rx="3" fill="#8C7965" opacity="0.5" />
          <ellipse cx="400" cy="270" rx="145" ry="100" fill="none" stroke="#62df7d" strokeWidth="1" strokeDasharray="6 5" />
          <ellipse cx="400" cy="270" rx="340" ry="230" fill="url(#oval-glow)" stroke="#62df7d" strokeWidth="1.5" strokeDasharray="8 7" />
          <ellipse cx="400" cy="270" rx="240" ry="165" fill="none" stroke="#9ddf2e" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.5" />
          <line x1="400" y1="40" x2="400" y2="500" stroke="#62df7d" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.3" />
          <line x1="60" y1="270" x2="740" y2="270" stroke="#62df7d" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.3" />
          {[
            { x: 60, y: 270 }, { x: 200, y: 75 }, { x: 600, y: 75 },
            { x: 740, y: 270 }, { x: 400, y: 490 },
          ].map((g, i) => (
            <g key={i}>
              <circle cx={g.x} cy={g.y} r="5" fill="#62df7d" opacity="0.7" />
              <circle cx={g.x} cy={g.y} r="12" fill="none" stroke="#62df7d" strokeWidth="0.7" opacity="0.3" />
            </g>
          ))}
        </svg>
      </div>

      {/* Crowd particles */}
      <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
        {CROWD.map((d, i) => <CrowdDot key={i} {...d} />)}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #03080F 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[5] pointer-events-none" style={{ background: 'linear-gradient(to top, #03080F, transparent)' }} />

      {/* ── Content ── */}
      <div className={`relative z-10 mx-auto px-6 max-w-5xl flex flex-col items-center text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* APL Live badge */}
        <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full border"
          style={{ background: 'rgba(98,223,125,0.04)', borderColor: 'rgba(98,223,125,0.18)', backdropFilter: 'blur(12px)' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-white/70">
            APL Season 3 · Bangalore vs Mumbai · Live Match Day
          </span>
          <span className="font-mono text-[9px] font-black text-emerald-400 bg-emerald-400/8 px-2.5 py-0.5 rounded-full border border-emerald-400/20 uppercase">
            {countFans.toLocaleString()} fans
          </span>
        </div>

        {/* Powered by badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Powered by</span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[8.5px] font-black uppercase tracking-wider"
            style={{ borderColor: 'rgba(98,223,125,0.2)', background: 'rgba(98,223,125,0.06)', color: '#62df7d' }}>
            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
            Gemini 2.5 Pro
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[8.5px] font-black uppercase tracking-wider"
            style={{ borderColor: 'rgba(255,180,171,0.2)', background: 'rgba(255,180,171,0.06)', color: '#ffb4ab' }}>
            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
            Emergency AI
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-black text-[clamp(40px,7vw,80px)] text-white mb-3 tracking-[-0.03em] leading-[0.95]">
          Stadium<span style={{ background: 'linear-gradient(135deg, #62df7d, #9ddf2e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pulse</span>
        </h1>
        <p className="text-[clamp(18px,3vw,32px)] font-black tracking-[0.06em] text-white/50 uppercase mb-5"
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.7),rgba(255,255,255,0.3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Live Stadium Intelligence
        </p>

        <p className="text-sm md:text-base text-white/40 max-w-2xl mb-10 leading-relaxed font-medium">
          The world&apos;s first <span className="text-emerald-400 font-bold">agentic AI platform</span> for cricket stadium crowd intelligence — detecting bottlenecks, autonomously rerouting 90,000 fans, and triggering emergency response in real time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <button onClick={() => navigate('/command')}
            className="relative group font-mono text-[10px] font-black tracking-[0.2em] uppercase px-8 py-3.5 rounded-xl cursor-pointer overflow-hidden transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#62df7d,#4ac76a)', color: '#002109', boxShadow: '0 0 30px rgba(98,223,125,0.35)' }}>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: 'linear-gradient(135deg,white,transparent)' }} />
            <span className="relative flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              Launch Command Center
            </span>
          </button>
          <button onClick={onSimulateClick || (() => document.getElementById('sim-engine')?.scrollIntoView({ behavior: 'smooth' }))}
            className="group font-mono text-[10px] font-black tracking-[0.2em] uppercase px-8 py-3.5 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(98,223,125,0.03)', borderColor: 'rgba(98,223,125,0.25)', color: '#62df7d', backdropFilter: 'blur(12px)' }}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">vital_signs</span>
              Run Scenario Simulation
            </span>
          </button>
          <button onClick={() => navigate('/dispatch')}
            className="group font-mono text-[10px] font-black tracking-[0.2em] uppercase px-8 py-3.5 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">groups</span>
              Volunteer Grid
            </span>
          </button>
        </div>

        {/* ── Impact Metrics Row ── */}
        <div className="w-full max-w-3xl mb-14">
          <p className="text-[8px] font-mono text-white/25 uppercase tracking-[0.3em] text-center mb-4 font-black">Measurable Impact · Bangalore APL Match Day</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(4,10,18,0.8)', backdropFilter: 'blur(20px)' }}>
            {IMPACT_STATS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center px-5 py-5 gap-1.5 transition-all hover:bg-white/[0.02]"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span className="material-symbols-outlined text-sm mb-1" style={{ color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <span className="font-mono text-2xl font-black tracking-tight" style={{ color: s.color }}>{s.val}</span>
                <span className="font-mono text-[7.5px] text-white/35 uppercase tracking-widest font-black text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Role Cards (Admin vs Volunteer) ── */}
        <div className="w-full max-w-3xl mb-10">
          <p className="text-[8px] font-mono text-white/25 uppercase tracking-[0.3em] text-center mb-4 font-black">Multi-Role Access · Built for Stadium Teams</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLE_CARDS.map(card => (
              <button key={card.role} onClick={() => navigate(card.path)}
                className="group text-left rounded-2xl p-5 border transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                style={{ background: 'rgba(4,10,18,0.85)', borderColor: `${card.color}18`, backdropFilter: 'blur(20px)' }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity opacity-40 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }} />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ background: `${card.color}10`, borderColor: `${card.color}30` }}>
                    <span className="material-symbols-outlined text-base" style={{ color: card.color, fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] font-black uppercase tracking-widest" style={{ color: card.color }}>{card.role}</p>
                    <p className="text-[8px] text-white/30 font-mono uppercase tracking-wider">Click to enter →</p>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed mb-3">{card.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {card.features.map(f => (
                    <span key={f} className="text-[7px] font-mono font-black uppercase tracking-wider px-2 py-1 rounded-md border"
                      style={{ borderColor: `${card.color}20`, background: `${card.color}06`, color: `${card.color}90` }}>{f}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-emerald-400/60 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
