import React, { useState, useEffect, useRef } from 'react'

// ─── Animated Counter ───────────────────────────────────────────────────────
function AnimatedCounter({ value, decimals = 0, suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const start = prev.current
    const end   = value
    const t0 = performance.now()
    const dur = 700
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      const cur = start + (end - start) * e
      setDisplay(decimals > 0 ? cur.toFixed(decimals) : Math.round(cur))
      if (p < 1) requestAnimationFrame(tick)
      else { setDisplay(decimals > 0 ? end.toFixed(decimals) : end); prev.current = end }
    }
    requestAnimationFrame(tick)
  }, [value])
  return <>{prefix}{typeof display === 'number' ? display.toLocaleString() : display}{suffix}</>
}

// ─── Waveform ──────────────────────────────────────────────────────────────
function Waveform({ color = '#62df7d', bars = 14, className = '' }) {
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className="wave-bar rounded-sm w-[3px]"
          style={{ height: `${14 + Math.abs(Math.sin(i * 1.1)) * 14}px`, background: color, animationDelay: `${i * 0.06}s`, opacity: 0.55 + Math.abs(Math.sin(i)) * 0.45 }} />
      ))}
    </div>
  )
}

// ─── Alert Toast ───────────────────────────────────────────────────────────
function AlertToast({ alerts }) {
  return (
    <div className="fixed top-20 right-5 z-[999] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 340 }}>
      {alerts.map(a => (
        <div key={a.id} className={`alert-enter rounded-2xl px-4 py-3 border flex items-start gap-3 shadow-2xl pointer-events-auto ${
          a.level === 'error' ? 'border-red-500/40 bg-red-950/80 backdrop-blur-xl' :
          a.level === 'warn'  ? 'border-amber-500/40 bg-amber-950/80 backdrop-blur-xl' :
                                'border-emerald-500/40 bg-emerald-950/80 backdrop-blur-xl'
        }`}>
          <span className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${a.level === 'error' ? 'text-red-400' : a.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {a.level === 'error' ? 'warning' : a.level === 'warn' ? 'info' : 'check_circle'}
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-white">{a.title}</p>
            <p className="text-[9px] text-white/60 mt-0.5 leading-relaxed">{a.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Mini Spark Bar ────────────────────────────────────────────────────────
function SparkBar({ value, max = 100, color }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }} />
    </div>
  )
}

// ─── Radial Gauge ─────────────────────────────────────────────────────────
function RadialGauge({ value, max = 100, color, size = 76, label }) {
  const r = 29, c = 2 * Math.PI * r, fill = (value / max) * c
  const danger = value >= 85
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
      <div className="relative">
        <svg width={size} height={size} viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
          <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${fill} ${c}`} strokeLinecap="round" transform="rotate(-90 35 35)"
            style={{ filter: `drop-shadow(0 0 ${danger ? 10 : 5}px ${color})`, transition: 'stroke-dasharray 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
          <text x="35" y="39" textAnchor="middle" fill="white" fontSize="12" fontWeight="900" fontFamily="JetBrains Mono,monospace">{value}</text>
        </svg>
        {danger && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border border-[#03080F] animate-pulse" />}
      </div>
      <span className="text-[7.5px] font-mono font-black uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors text-center leading-tight">{label}</span>
    </div>
  )
}

// ─── Dispatch Order Modal ──────────────────────────────────────────────────
function DispatchModal({ onClose, onSubmit, stands }) {
  const [zone, setZone] = useState(stands[0])
  const [type, setType] = useState('Security')
  const [units, setUnits] = useState(2)
  const [note, setNote] = useState('')
  const [priority, setPriority] = useState('High')

  const TYPES = ['Security', 'Medical', 'Steward', 'Fire', 'VIP Escort']
  const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
  const PCOLORS = { Low: '#9ddf2e', Medium: '#ffb95f', High: '#ff8c42', Critical: '#ff4444' }

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: 'rgba(4,10,18,0.98)' }}>
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400" />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </div>
            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400">New Dispatch Order</p>
              <p className="text-[8px] text-white/40 font-mono uppercase tracking-wider">StadiumPulse Command · Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer">
            <span className="material-symbols-outlined text-white/50 text-sm">close</span>
          </button>
        </div>

        {/* Form body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Zone */}
          <div>
            <label className="text-[8.5px] font-mono font-black uppercase tracking-widest text-white/40 mb-1.5 block">Target Zone</label>
            <div className="grid grid-cols-3 gap-1.5">
              {stands.map(s => (
                <button key={s} onClick={() => setZone(s)}
                  className={`py-2 px-3 rounded-xl text-[8px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer border ${zone === s ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/3 border-white/6 text-white/40 hover:border-white/15 hover:text-white/70'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Type + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8.5px] font-mono font-black uppercase tracking-widest text-white/40 mb-1.5 block">Unit Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full bg-[#040A12] border border-white/8 rounded-xl px-3 py-2.5 text-[10px] text-white font-mono focus:outline-none focus:border-emerald-500/40 transition-all cursor-pointer appearance-none">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[8.5px] font-mono font-black uppercase tracking-widest text-white/40 mb-1.5 block">Priority</label>
              <div className="grid grid-cols-2 gap-1">
                {PRIORITIES.map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`py-1.5 rounded-lg text-[7.5px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer border ${priority === p ? 'border-current' : 'bg-white/3 border-white/6 text-white/30 hover:text-white/60'}`}
                    style={priority === p ? { color: PCOLORS[p], borderColor: `${PCOLORS[p]}50`, background: `${PCOLORS[p]}15` } : {}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Units */}
          <div>
            <label className="text-[8.5px] font-mono font-black uppercase tracking-widest text-white/40 mb-1.5 block">Units to Deploy: <span className="text-emerald-400">{units}</span></label>
            <input type="range" min={1} max={12} value={units} onChange={e => setUnits(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer" />
            <div className="flex justify-between text-[7px] font-mono text-white/25 mt-1">
              <span>1</span><span>6</span><span>12</span>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-[8.5px] font-mono font-black uppercase tracking-widest text-white/40 mb-1.5 block">Field Notes (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              placeholder="e.g. Gate scanner down, barrier needed at row 14..."
              className="w-full bg-[#040A12] border border-white/8 rounded-xl px-3 py-2.5 text-[10px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/30 resize-none transition-all" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all cursor-pointer">
              Cancel
            </button>
            <button onClick={() => onSubmit({ zone, type, units, priority, note, id: Date.now(), status: 'Active', ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
              className="flex-1 py-3 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #62df7d, #9ddf2e)', color: '#002109', boxShadow: '0 0 20px rgba(98,223,125,0.3)' }}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              Deploy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Constants ─────────────────────────────────────────────────────────────
const STAND_NAMES  = ['North Upper', 'South Stand', 'East Upper', 'West Stand', 'VIP Pavilion', 'Press Box']
const STAND_COLORS = ['#62df7d', '#ff5555', '#9ddf2e', '#9ddf2e', '#ffb95f', '#62df7d']
const GATE_NAMES   = ['GATE A', 'GATE B', 'GATE C', 'GATE D', 'GATE E']

const RADIO_MSGS = [
  { cs: '[Alpha-1]', msg: 'Gate C clear, moving to D.', col: 'text-emerald-400' },
  { cs: '[Command]', msg: 'Confirmed Alpha. Standby all units.', col: 'text-cyan-400' },
  { cs: '[Bravo-2]', msg: 'SURGE forming West concourse!', col: 'text-red-400' },
  { cs: '[Med-Unit]', msg: 'Responder en route Block 104.', col: 'text-amber-400' },
  { cs: '[Delta-1]', msg: 'VIP lane nominal. Flow clear.', col: 'text-emerald-400' },
  { cs: '[Echo-Lead]', msg: 'Stand density 92%. Requesting control.', col: 'text-red-400' },
  { cs: '[Command]', msg: 'Gemini rerouting engaged. Hold position.', col: 'text-cyan-400' },
  { cs: '[Foxtrot]', msg: 'South exit sealed. Alternate active.', col: 'text-amber-400' },
  { cs: '[Golf-3]', msg: 'Medical unit cleared Block 104.', col: 'text-emerald-400' },
  { cs: '[Command]', msg: 'All gates: increase throughput. Gemini alert.', col: 'text-cyan-400' },
]

const GEMINI_RESPONSES = [
  "Crowd density surge detected at South Stand (92%). Recommending immediate diversion of 3,200 fans via East Concourse Route B. Estimated pressure reduction: 34%. Confidence: 98.7%.",
  "Gate B wait time exceeding 18 minutes. Activating scanner backup protocol. Gemini predicts clearance by 14:42 with current throughput of 440 fans/min.",
  "Rain probability 78% in next 45 minutes. Pre-positioning shelter assets at North Concourse. Auto-alert dispatched to 22 stewards.",
  "Post-match egress modelling complete. Recommended staggered exit sequence: VIP (14:55) → North Stand (15:02) → South (15:08) → East/West simultaneous (15:14).",
  "Medical alert escalated at Block 104. Nearest unit (Med-1) ETA: 2m 15s. Route cleared by STAD-PULSE auto-routing. Hospital pre-notified.",
  "Optimal fan dispersal achieved. All 5 gates now operating within 18% of theoretical maximum. Crowd flow index: 94.3/100.",
]

const EGRESS_PHASES = [
  { stand: 'VIP Pavilion',  wave: 'Wave 1', gate: 'GATE E (Priority)',  fans: 3200,  delay: 0,  color: '#ffb95f' },
  { stand: 'Press Box',     wave: 'Wave 2', gate: 'GATE A (Staff)',     fans: 800,   delay: 5,  color: '#62df7d' },
  { stand: 'North Upper',   wave: 'Wave 3', gate: 'GATE B + GATE C',   fans: 18400, delay: 12, color: '#62df7d' },
  { stand: 'South Stand',   wave: 'Wave 4', gate: 'GATE D (Main)',      fans: 22100, delay: 20, color: '#ff5555' },
  { stand: 'East Upper',    wave: 'Wave 5', gate: 'GATE C (Secondary)', fans: 16800, delay: 28, color: '#9ddf2e' },
  { stand: 'West Stand',    wave: 'Wave 6', gate: 'GATE A + GATE B',   fans: 21150, delay: 36, color: '#9ddf2e' },
]

// density → hsl color helper
function densityColor(d) {
  if (d >= 90) return '#ff2244'
  if (d >= 75) return '#ff6633'
  if (d >= 55) return '#ffb95f'
  if (d >= 35) return '#9ddf2e'
  return '#62df7d'
}

// ═══════════════════════════════════════════════════════════════════════════
export default function CommandCenter() {
  const alertId = useRef(300)

  // Live sim state
  const [tick, setTick]             = useState(0)
  const [attendance, setAttendance] = useState(82450)
  const [density, setDensity]       = useState([65, 92, 55, 45, 38, 12])
  const [gateWait, setGateWait]     = useState([32, 14, 8, 11, 5])
  const [incidents, setIncidents]   = useState(2)
  const [aiConf, setAiConf]         = useState(98.4)
  const [score, setScore]           = useState('224 / 4')
  const [overs, setOvers]           = useState('28.3')
  const [chartEntry, setChartEntry] = useState([90, 74, 60, 45, 33, 22, 14, 5])
  const [chartExit, setChartExit]   = useState([95, 90, 83, 76, 71, 66, 60, 55])

  // UI state
  const [toasts, setToasts]             = useState([])
  const [radioLog, setRadioLog]         = useState([
    { id: 1, t: '14:02', cs: '[Alpha-1]', msg: 'Gate C clear.', col: 'text-emerald-400' },
    { id: 2, t: '14:04', cs: '[Command]', msg: 'Copy. All units standby.', col: 'text-cyan-400' },
    { id: 3, t: '14:07', cs: '[Bravo-2]', msg: 'West concourse surge forming!', col: 'text-red-400' },
    { id: 4, t: '14:09', cs: '[Med-Unit]', msg: 'Responder en route Block 104.', col: 'text-amber-400' },
  ])
  const [geminiReply, setGeminiReply]   = useState('')
  const [geminiTyping, setGeminiTyping] = useState(false)
  const [geminiQuery, setGeminiQuery]   = useState('')
  const [geminiIdx, setGeminiIdx]       = useState(0)
  const [activeStand, setActiveStand]   = useState(null)
  const [selectedScenario, setScenario] = useState(null)

  // Dispatch orders
  const [dispatchOrders, setDispatchOrders] = useState([
    { id: 1001, zone: 'South Stand', type: 'Security', units: 4, priority: 'Critical', note: 'Crowd surge at Gate D approach', status: 'Active', ts: '14:02' },
    { id: 1002, zone: 'West Stand',  type: 'Medical',  units: 2, priority: 'High',     note: 'Fan incident near Block 12',   status: 'Active', ts: '14:08' },
    { id: 1003, zone: 'VIP Pavilion',type: 'Security', units: 1, priority: 'Medium',   note: 'VIP escort arrival',           status: 'Done',   ts: '13:55' },
  ])
  const [showDispatchModal, setShowDispatchModal] = useState(false)
  const [dispatchTab, setDispatchTab] = useState('active') // 'active' | 'done'

  // Egress
  const [egressActive, setEgressActive]     = useState(false)
  const [egressPhase, setEgressPhase]       = useState(-1)
  const [egressCountdown, setEgressCountdown] = useState(0)
  const egressTimer = useRef(null)

  const pushToast = (level, title, body) => {
    const id = alertId.current++
    setToasts(p => [...p.slice(-3), { id, level, title, body }])
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 7000)
  }

  // 1Hz tick
  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1)
      setAttendance(v => Math.max(75000, Math.min(88000, v + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 60))))
      setDensity(prev => prev.map(d => Math.max(5, Math.min(99, d + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)))))
      setGateWait(prev => prev.map(w => Math.max(2, Math.min(50, w + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)))))
      setAiConf(v => parseFloat(Math.max(95.0, Math.min(99.9, v + (Math.random() - 0.5) * 0.25)).toFixed(1)))
      setChartEntry(prev => { const n = [...prev.slice(1), Math.max(0, Math.min(100, prev[7] + (Math.random() - 0.55) * 8))]; return n })
      setChartExit(prev => { const n = [...prev.slice(1), Math.max(0, Math.min(100, prev[7] + (Math.random() - 0.45) * 5))]; return n })
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  // Cricket score
  useEffect(() => {
    const iv = setInterval(() => {
      setOvers(prev => {
        const [ov, b] = prev.split('.').map(Number)
        const nb = (b + 1) % 7
        return `${nb === 0 ? ov + 1 : ov}.${nb}`
      })
      if (Math.random() > 0.35) {
        const runs = Math.floor(Math.random() * 6) + 1
        setScore(prev => { const [r, w] = prev.split(' / '); return `${parseInt(r) + runs} / ${w}` })
      }
    }, 9000)
    return () => clearInterval(iv)
  }, [])

  // Radio
  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date()
      const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      const m = RADIO_MSGS[Math.floor(Math.random() * RADIO_MSGS.length)]
      setRadioLog(p => [...p.slice(-14), { id: Date.now(), t, ...m }])
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  // Alerts
  useEffect(() => {
    const alerts = [
      { level: 'error', title: 'SURGE CRITICAL', body: 'South Stand density 92%. Auto-rerouting 3,200 fans.' },
      { level: 'warn',  title: 'GATE B DELAY', body: 'Scanner latency up 22%. Backup teams dispatched.' },
      { level: 'ok',    title: 'AI REROUTE DONE', body: 'East concourse pressure reduced by 34%.' },
      { level: 'error', title: 'MEDICAL INCIDENT', body: 'Block 104 response deployed. ETA: 2m 15s.' },
    ]
    const iv = setInterval(() => {
      const a = alerts[Math.floor(Math.random() * alerts.length)]
      pushToast(a.level, a.title, a.body)
      if (a.level === 'error') setIncidents(v => Math.min(9, v + 1))
    }, 20000)
    return () => clearInterval(iv)
  }, [])

  // Gemini typewriter
  const typeResponse = (text) => {
    setGeminiReply('')
    setGeminiTyping(true)
    let i = 0
    const iv = setInterval(() => {
      setGeminiReply(text.slice(0, i + 1))
      i++
      if (i >= text.length) { clearInterval(iv); setGeminiTyping(false) }
    }, 16)
    return () => clearInterval(iv)
  }

  const handleGeminiSend = () => {
    if (!geminiQuery.trim()) return
    setGeminiQuery('')
    typeResponse(GEMINI_RESPONSES[geminiIdx % GEMINI_RESPONSES.length])
    setGeminiIdx(i => i + 1)
  }

  const handleScenario = (id) => {
    setScenario(id)
    const msgs = {
      surge: { level: 'error', title: 'CROWD SURGE', body: 'South Stand 92% — Gemini rerouting engaged.' },
      rain:  { level: 'warn',  title: 'RAIN PROTOCOL', body: 'Concourse shelter active. 22 stewards alerted.' },
      vip:   { level: 'ok',    title: 'VIP EGRESS', body: 'Staggered timeline deployed via Gemini.' },
      fire:  { level: 'error', title: 'EMERGENCY EVACUATION', body: 'All zones: Evacuate. Follow lit exits.' },
    }
    pushToast(msgs[id].level, msgs[id].title, msgs[id].body)
    if (id === 'surge') { setDensity([68, 97, 60, 88, 42, 14]); setGateWait([48, 18, 10, 14, 6]); setIncidents(3); setAiConf(99.2) }
    if (id === 'rain')  { setDensity([93, 72, 87, 91, 55, 20]); setGateWait([22, 38, 14, 25, 8]); setIncidents(1); setAiConf(97.8) }
    if (id === 'vip')   { setDensity([45, 38, 52, 70, 85, 45]); setGateWait([10, 8, 4, 3, 2]);   setIncidents(0); setAiConf(99.7) }
    if (id === 'fire')  { setDensity([96, 99, 94, 92, 88, 78]); setGateWait([42, 45, 39, 36, 30]);setIncidents(5); setAiConf(95.4);
      pushToast('error', 'BROADCAST', 'All fans: Proceed to nearest exit. Do NOT run.') }
  }

  const handleNewDispatch = (order) => {
    setDispatchOrders(prev => [order, ...prev])
    setShowDispatchModal(false)
    pushToast('warn', 'DISPATCH ORDER SENT', `${order.units}x ${order.type} → ${order.zone}`)
  }

  const resolveOrder = (id) => {
    setDispatchOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Done' } : o))
    pushToast('ok', 'ORDER RESOLVED', 'Dispatch marked complete by Command.')
  }

  const cancelOrder = (id) => {
    setDispatchOrders(prev => prev.filter(o => o.id !== id))
    pushToast('warn', 'ORDER CANCELLED', 'Dispatch order removed from queue.')
  }

  const activateEgress = () => {
    if (egressActive) {
      clearInterval(egressTimer.current)
      setEgressActive(false); setEgressPhase(-1); setEgressCountdown(0)
      pushToast('warn', 'EGRESS CANCELLED', 'Protocol aborted.')
      return
    }
    setEgressActive(true); setEgressPhase(0); setEgressCountdown(0)
    pushToast('ok', 'EGRESS PROTOCOL ACTIVE', 'Wave 1: VIP Pavilion → Gate E.')
    let phase = 0, t = 0
    egressTimer.current = setInterval(() => {
      t++
      const next = phase + 1 < EGRESS_PHASES.length ? EGRESS_PHASES[phase + 1].delay : null
      if (next !== null && t >= next) {
        phase++
        setEgressPhase(phase)
        setEgressCountdown(t)
        pushToast('ok', `WAVE ${phase + 1}`, `${EGRESS_PHASES[phase].stand} → ${EGRESS_PHASES[phase].gate}`)
      }
      if (phase >= EGRESS_PHASES.length - 1) {
        clearInterval(egressTimer.current)
        setTimeout(() => { setEgressActive(false); setEgressPhase(-1); setEgressCountdown(0); pushToast('ok', 'EGRESS COMPLETE', 'All stands cleared.') }, 4000)
      }
    }, 1000)
  }

  // SVG chart helpers
  const buildPath = pts => { const w=320,h=80,s=w/(pts.length-1); return pts.map((v,i)=>`${i===0?'M':'L'} ${i*s},${h-v}`).join(' ') }
  const buildArea = pts => { const w=320,h=80,s=w/(pts.length-1); return pts.map((v,i)=>`${i===0?'M':'L'} ${i*s},${h-v}`).join(' ')+` L ${w},${h} L 0,${h} Z` }

  const activeOrders  = dispatchOrders.filter(o => o.status === 'Active')
  const resolvedOrders = dispatchOrders.filter(o => o.status === 'Done')
  const PCOLORS = { Low: '#9ddf2e', Medium: '#ffb95f', High: '#ff8c42', Critical: '#ff2244' }

  // ─── Stadium SVG sub-component (inline) ─────────────────────────────────
  const StadiumMap = () => {
    const GATES = [
      { cx: 110, cy: 215, lbl: 'A', col: densityColor(density[3]), wait: gateWait[0] },
      { cx: 218, cy: 95,  lbl: 'B', col: densityColor(density[0]), wait: gateWait[1] },
      { cx: 382, cy: 95,  lbl: 'C', col: densityColor(density[2]), wait: gateWait[2] },
      { cx: 490, cy: 215, lbl: 'D', col: densityColor(density[2]), wait: gateWait[3] },
      { cx: 300, cy: 355, lbl: 'E', col: densityColor(density[1]), wait: gateWait[4] },
    ]

    const northDensity  = density[0]
    const southDensity  = density[1]
    const eastDensity   = density[2]
    const westDensity   = density[3]
    const vipDensity    = density[4]

    return (
      <svg viewBox="0 0 600 440" className="w-full h-full" style={{ maxHeight: 420 }}>
        <defs>
          {/* Radial gradients for each stand — dynamic density color */}
          <radialGradient id="fn" cx="50%" cy="100%"><stop offset="0%" stopColor={densityColor(northDensity)} stopOpacity="0.45"/><stop offset="100%" stopColor={densityColor(northDensity)} stopOpacity="0"/></radialGradient>
          <radialGradient id="fs" cx="50%" cy="0%"><stop offset="0%" stopColor={densityColor(southDensity)} stopOpacity="0.45"/><stop offset="100%" stopColor={densityColor(southDensity)} stopOpacity="0"/></radialGradient>
          <radialGradient id="fe" cx="0%" cy="50%"><stop offset="0%" stopColor={densityColor(eastDensity)} stopOpacity="0.45"/><stop offset="100%" stopColor={densityColor(eastDensity)} stopOpacity="0"/></radialGradient>
          <radialGradient id="fw" cx="100%" cy="50%"><stop offset="0%" stopColor={densityColor(westDensity)} stopOpacity="0.45"/><stop offset="100%" stopColor={densityColor(westDensity)} stopOpacity="0"/></radialGradient>
          <radialGradient id="fg-field" cx="50%" cy="50%"><stop offset="0%" stopColor="#1a3a20" stopOpacity="0.9"/><stop offset="100%" stopColor="#0a1a0f" stopOpacity="0.95"/></radialGradient>
          <filter id="glow-sm"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-md"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-lg"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Blueprint grid */}
        {[80,160,240].map(r => <ellipse key={r} cx="300" cy="220" rx={r*1.4} ry={r} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" strokeDasharray="4 6"/>)}
        <line x1="300" y1="20" x2="300" y2="430" stroke="rgba(255,255,255,0.02)" strokeWidth="0.6" strokeDasharray="3 8"/>
        <line x1="20" y1="220" x2="580" y2="220" stroke="rgba(255,255,255,0.02)" strokeWidth="0.6" strokeDasharray="3 8"/>

        {/* ── North Stand ── */}
        <path d="M 190,78 A 210,165 0 0,1 410,78 L 388,108 A 175,138 0 0,0 212,108 Z"
          fill="url(#fn)" stroke={densityColor(northDensity)} strokeWidth={activeStand===0?2.5:1.2} opacity={activeStand===0?1:0.85}
          filter={activeStand===0?'url(#glow-sm)':undefined}
          className="cursor-pointer transition-all duration-300 hover:opacity-100"
          onClick={() => setActiveStand(activeStand===0?null:0)} />
        {/* North density fill bars (visual texture) */}
        {Array.from({length:7}).map((_,i)=>(
          <rect key={i} x={200+i*28} y={80} width={22} height={northDensity*0.22} rx="2"
            fill={densityColor(northDensity)} opacity={0.18+i*0.02} className="pointer-events-none"/>
        ))}
        <text x="300" y="64" textAnchor="middle" fill={densityColor(northDensity)} fontSize="8" fontWeight="900" fontFamily="JetBrains Mono,monospace" className="uppercase tracking-widest pointer-events-none">NORTH · {northDensity}%</text>

        {/* ── South Stand ── */}
        <path d="M 190,362 A 210,165 0 0,0 410,362 L 388,332 A 175,138 0 0,1 212,332 Z"
          fill="url(#fs)" stroke={densityColor(southDensity)} strokeWidth={activeStand===1?2.5:1.2} opacity={activeStand===1?1:0.85}
          filter={southDensity>85?'url(#glow-md)':activeStand===1?'url(#glow-sm)':undefined}
          className="cursor-pointer transition-all duration-300 hover:opacity-100"
          onClick={() => setActiveStand(activeStand===1?null:1)} />
        {Array.from({length:7}).map((_,i)=>(
          <rect key={i} x={200+i*28} y={330-southDensity*0.22} width={22} height={southDensity*0.22} rx="2"
            fill={densityColor(southDensity)} opacity={0.2} className="pointer-events-none"/>
        ))}
        <text x="300" y="393" textAnchor="middle" fill={densityColor(southDensity)} fontSize="8" fontWeight="900" fontFamily="JetBrains Mono,monospace" className="uppercase tracking-widest pointer-events-none">SOUTH · {southDensity}%{southDensity>85?' ⚡':''}</text>

        {/* ── West Stand ── */}
        <path d="M 108,148 A 185,148 0 0,0 108,292 L 138,270 A 147,112 0 0,1 138,170 Z"
          fill="url(#fw)" stroke={densityColor(westDensity)} strokeWidth={activeStand===3?2.5:1.2} opacity={activeStand===3?1:0.85}
          filter={activeStand===3?'url(#glow-sm)':undefined}
          className="cursor-pointer transition-all duration-300 hover:opacity-100"
          onClick={() => setActiveStand(activeStand===3?null:3)} />
        <text x="72" y="224" textAnchor="middle" fill={densityColor(westDensity)} fontSize="8" fontWeight="900" fontFamily="JetBrains Mono,monospace" className="pointer-events-none">WEST</text>
        <text x="72" y="234" textAnchor="middle" fill={densityColor(westDensity)} fontSize="7" fontFamily="JetBrains Mono,monospace" className="pointer-events-none">{westDensity}%</text>

        {/* ── East Stand ── */}
        <path d="M 492,148 A 185,148 0 0,1 492,292 L 462,270 A 147,112 0 0,0 462,170 Z"
          fill="url(#fe)" stroke={densityColor(eastDensity)} strokeWidth={activeStand===2?2.5:1.2} opacity={activeStand===2?1:0.85}
          filter={activeStand===2?'url(#glow-sm)':undefined}
          className="cursor-pointer transition-all duration-300 hover:opacity-100"
          onClick={() => setActiveStand(activeStand===2?null:2)} />
        <text x="526" y="224" textAnchor="middle" fill={densityColor(eastDensity)} fontSize="8" fontWeight="900" fontFamily="JetBrains Mono,monospace" className="pointer-events-none">EAST</text>
        <text x="526" y="234" textAnchor="middle" fill={densityColor(eastDensity)} fontSize="7" fontFamily="JetBrains Mono,monospace" className="pointer-events-none">{eastDensity}%</text>

        {/* ── VIP Pavilion corner highlight ── */}
        <path d="M 385,94 L 415,82 L 435,100 L 415,110 Z" fill={densityColor(vipDensity)} opacity="0.25" stroke={densityColor(vipDensity)} strokeWidth="1"/>
        <text x="412" y="92" fill={densityColor(vipDensity)} fontSize="6.5" fontWeight="900" fontFamily="JetBrains Mono,monospace" className="pointer-events-none">VIP</text>

        {/* ── Outer boundary ring ── */}
        <ellipse cx="300" cy="220" rx="200" ry="145" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

        {/* ── Field ellipse ── */}
        <ellipse cx="300" cy="220" rx="156" ry="112" fill="url(#fg-field)" />
        <ellipse cx="300" cy="220" rx="156" ry="112" fill="none" stroke="rgba(98,223,125,0.35)" strokeWidth="1.5" strokeDasharray="5 5"/>
        {/* Inner circle */}
        <ellipse cx="300" cy="220" rx="118" ry="80" fill="none" stroke="rgba(157,223,46,0.15)" strokeWidth="1" strokeDasharray="8 6"/>
        {/* Field lines */}
        <ellipse cx="300" cy="220" rx="78" ry="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>

        {/* ── Pitch ── */}
        <rect x="288" y="192" width="24" height="56" rx="2" fill="#8c7a62" opacity="0.9" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
        <line x1="288" y1="202" x2="312" y2="202" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6"/>
        <line x1="288" y1="238" x2="312" y2="238" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6"/>
        {[294,300,306].map(x => <React.Fragment key={x}><circle cx={x} cy="196" r="1" fill="white" opacity="0.8"/><circle cx={x} cy="244" r="1" fill="white" opacity="0.8"/></React.Fragment>)}

        {/* ── Animated fan flow paths ── */}
        {/* Flow 1: North → Pitch */}
        <path d="M 300,110 Q 300,160 300,192" fill="none" stroke="#62df7d" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.4"/>
        <circle r="3.5" fill="#62df7d" opacity="0.8" filter="url(#glow-sm)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 300,110 Q 300,160 300,192"/>
          <animate attributeName="opacity" values="0;0.9;0" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        {/* Flow 2: West egress arc */}
        <path d="M 138,220 A 80,60 0 0,0 190,310" fill="none" stroke="#9ddf2e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35"/>
        <circle r="3" fill="#9ddf2e" opacity="0.7">
          <animateMotion dur="3s" begin="0.8s" repeatCount="indefinite" path="M 138,220 A 80,60 0 0,0 190,310"/>
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin="0.8s" repeatCount="indefinite"/>
        </circle>
        {/* Flow 3: East egress arc */}
        <path d="M 462,220 A 80,60 0 0,1 410,310" fill="none" stroke="#9ddf2e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35"/>
        <circle r="3" fill="#9ddf2e" opacity="0.7">
          <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M 462,220 A 80,60 0 0,1 410,310"/>
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
        </circle>
        {/* Emergency flow: south surge */}
        {southDensity > 85 && (
          <path d="M 300,332 Q 300,360 300,370" fill="none" stroke="#ff2244" strokeWidth="2" opacity="0.6" strokeDasharray="3 3"/>
        )}

        {/* ── Gate nodes ── */}
        {GATES.map((g, i) => (
          <g key={g.lbl}>
            {/* Pulse ring */}
            <circle cx={g.cx} cy={g.cy} r="14" fill="none" stroke={g.col} strokeWidth="0.8" opacity="0.6">
              <animate attributeName="r" from="14" to="22" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/>
            </circle>
            {/* Gate circle */}
            <circle cx={g.cx} cy={g.cy} r="8" fill={g.col} opacity="0.9" filter="url(#glow-sm)"/>
            <circle cx={g.cx} cy={g.cy} r="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
            {/* Gate label */}
            <text x={g.cx} y={g.cy - 14} fill={g.col} fontSize="7.5" fontWeight="900" fontFamily="JetBrains Mono,monospace" textAnchor="middle">{`G${g.lbl}`}</text>
            {/* Wait pill */}
            <rect x={g.cx - 11} y={g.cy + 10} width={22} height={10} rx="5" fill="rgba(0,0,0,0.7)" stroke={g.col} strokeWidth="0.5"/>
            <text x={g.cx} y={g.cy + 18} fill={g.col} fontSize="6" fontWeight="900" fontFamily="JetBrains Mono,monospace" textAnchor="middle">{g.wait}m</text>
          </g>
        ))}

        {/* ── Incident marker ── */}
        {incidents > 0 && (
          <g>
            <polygon points="130,200 142,218 118,218" fill="#ff2244">
              <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="indefinite"/>
            </polygon>
            <circle cx="130" cy="210" r="18" fill="none" stroke="#ff2244" strokeWidth="0.8" opacity="0.5">
              <animate attributeName="r" from="18" to="28" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="130" y="232" fill="#ff2244" fontSize="7" fontWeight="900" fontFamily="JetBrains Mono,monospace" textAnchor="middle">⚡SURGE</text>
          </g>
        )}

        {/* ── Patrol dot ── */}
        <g>
          <circle cx="300" cy="305" r="5.5" fill="#9ddf2e">
            <animate attributeName="r" values="5;7;5" dur="1.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="300" cy="305" r="14" fill="none" stroke="#9ddf2e" strokeWidth="0.8" opacity="0.5">
            <animate attributeName="r" from="14" to="24" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.5" to="0" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <text x="300" y="294" fill="#9ddf2e" fontSize="6.5" fontWeight="900" fontFamily="JetBrains Mono,monospace" textAnchor="middle">PATROL</text>
        </g>

        {/* ── Active stand detail popup ── */}
        {activeStand !== null && (
          <g>
            <rect x="180" y="186" width="240" height="68" rx="8" fill="rgba(4,10,18,0.95)" stroke={STAND_COLORS[activeStand]} strokeWidth="1"/>
            <line x1="180" y1="194" x2="420" y2="194" stroke={STAND_COLORS[activeStand]} strokeWidth="2"/>
            <text x="194" y="206" fill="white" fontSize="8.5" fontWeight="900" fontFamily="JetBrains Mono,monospace">{STAND_NAMES[activeStand].toUpperCase()}</text>
            <text x="194" y="218" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="JetBrains Mono,monospace">DENSITY</text>
            <text x="252" y="218" fill={STAND_COLORS[activeStand]} fontSize="7" fontWeight="900" fontFamily="JetBrains Mono,monospace">{density[activeStand]}%</text>
            <text x="194" y="230" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="JetBrains Mono,monospace">STATUS</text>
            <text x="242" y="230" fill={density[activeStand] > 85 ? '#ff2244' : '#62df7d'} fontSize="7" fontWeight="900" fontFamily="JetBrains Mono,monospace">{density[activeStand] > 85 ? 'CRITICAL' : density[activeStand] > 65 ? 'ELEVATED' : 'NORMAL'}</text>
            <rect x="194" y="238" width={density[activeStand] * 2} height="5" rx="2.5" fill={STAND_COLORS[activeStand]} opacity="0.8"/>
            <rect x="194" y="238" width="200" height="5" rx="2.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
            <text x="410" y="198" fill="rgba(255,255,255,0.4)" fontSize="6.5" textAnchor="end" fontFamily="JetBrains Mono,monospace" className="cursor-pointer" onClick={() => setActiveStand(null)}>✕</text>
          </g>
        )}


      </svg>
    )
  }

  return (
    <>
      {showDispatchModal && (
        <DispatchModal onClose={() => setShowDispatchModal(false)} onSubmit={handleNewDispatch} stands={STAND_NAMES} />
      )}
      <AlertToast alerts={toasts} />

      <div className="min-h-screen text-white antialiased overflow-x-hidden pb-10 selection:bg-emerald-500/20"
        style={{ background: '#03080F' }}>

        {/* ── Ambient background ── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.013) 1px,transparent 1px)', backgroundSize: '32px 32px' }}/>
          <div className="absolute top-[5%] left-[10%] w-[700px] h-[700px] rounded-full blur-[200px]" style={{ background: 'rgba(98,223,125,0.04)' }}/>
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full blur-[180px]" style={{ background: 'rgba(157,223,46,0.03)' }}/>
          <div className="absolute top-[45%] right-[20%] w-[500px] h-[500px] rounded-full blur-[160px]" style={{ background: 'rgba(255,34,68,0.03)' }}/>
        </div>

        {/* ── Live Ticker ── */}
        <div className="relative z-10 px-4 pt-4 pb-0">
          <div className="overflow-hidden flex items-center rounded-full px-4 py-1.5 border" style={{ background: 'rgba(4,10,18,0.95)', borderColor: 'rgba(98,223,125,0.18)', boxShadow: '0 0 20px rgba(98,223,125,0.05)' }}>
            <div className="flex items-center gap-3 shrink-0 border-r border-white/8 pr-4 mr-4">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75"/><span className="relative h-2 w-2 rounded-full bg-red-500"/></span>
              <span className="text-red-400 font-mono text-[9px] font-black uppercase tracking-widest">APL LIVE</span>
            </div>
            <div className="flex-1 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg,transparent,black 3%,black 97%,transparent)' }}>
              <div className="ticker-scroll">
                {[1,2].map(k => (
                  <span key={k} className="text-white/40 font-mono text-[9px] font-bold tracking-widest pr-16 whitespace-nowrap">
                    🏏 BANGALORE vs MUMBAI &nbsp;·&nbsp; {score} ({overs} OV) &nbsp;·&nbsp; 🔵 CAPACITY: {attendance.toLocaleString()} / 90,000 &nbsp;·&nbsp; ⚡ AI: {aiConf}% &nbsp;·&nbsp; 🚨 INCIDENTS: {incidents} &nbsp;·&nbsp; 🛡 GATES: {gateWait.map((w,i)=>`${GATE_NAMES[i]}:${w}m`).join(' · ')} &nbsp;·&nbsp;
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 px-4 pt-4 max-w-[1920px] w-full mx-auto">

          {/* ── Top Bar ── */}
          <div className="flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5 border relative overflow-hidden"
            style={{ background: 'rgba(4,10,18,0.9)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>
            <div className="scan-line pointer-events-none opacity-20" />
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #62df7d, #9ddf2e, #ffb95f)' }}/>
            <div className="flex items-center gap-4 pl-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(98,223,125,0.1)', borderColor: 'rgba(98,223,125,0.25)', boxShadow: '0 0 16px rgba(98,223,125,0.15)' }}>
                <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-white uppercase">StadiumPulse</span>
                  <span className="text-[9px] text-emerald-400 font-mono px-2 py-0.5 rounded-full font-black uppercase border" style={{ background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.2)' }}>AI Command</span>
                  <span className="text-[9px] text-red-400 font-mono px-2 py-0.5 rounded-full font-black uppercase animate-pulse border" style={{ background: 'rgba(255,34,68,0.08)', borderColor: 'rgba(255,34,68,0.2)' }}>◉ LIVE</span>
                </div>
                <span className="text-[8px] text-white/35 font-mono uppercase tracking-widest font-bold">APL Matchday Digital Twin · v3.0</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Waveform color="#62df7d" bars={12} />
              <div className="flex items-center gap-2 rounded-full px-3.5 py-2 border" style={{ background: 'rgba(98,223,125,0.05)', borderColor: 'rgba(98,223,125,0.18)' }}>
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative h-2 w-2 rounded-full bg-emerald-400"/></span>
                <span className="font-mono text-[9px] text-emerald-400 font-black uppercase tracking-widest">System Optimal</span>
              </div>
            </div>
          </div>

          {/* ── Main 3-column grid ── */}
          <div className="grid grid-cols-12 gap-5">

            {/* ── COL 1: KPIs + Gauges + Gates ── */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

              {/* KPI tiles */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Attendance',  val: attendance, suf: '', col: '#ffffff', icon: 'groups',    sub: '/ 90k cap',    border: 'rgba(255,255,255,0.06)' },
                  { label: 'Incidents',   val: incidents,  suf: '', col: '#ff4455', icon: 'warning',   sub: 'active alerts', border: incidents > 2 ? 'rgba(255,68,85,0.3)' : 'rgba(255,255,255,0.06)', glow: incidents > 2 },
                  { label: 'AI Conf.',    val: aiConf,     suf: '%',col: '#62df7d', icon: 'psychology',sub: 'gemini pro',   dec: 1, border: 'rgba(98,223,125,0.15)' },
                  { label: 'Responders',  val: 12,         suf: '', col: '#ffb95f', icon: 'security',  sub: 'on ground',    border: 'rgba(255,185,95,0.12)' },
                ].map(k => (
                  <div key={k.label} className={`rounded-xl p-3.5 flex flex-col transition-all hover:scale-[1.02] cursor-default`}
                    style={{ background: 'rgba(4,10,18,0.95)', border: `1px solid ${k.border}`, boxShadow: k.glow ? '0 0 14px rgba(255,68,85,0.15)' : undefined }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[7.5px] text-white/35 uppercase tracking-widest font-mono font-black">{k.label}</span>
                      <span className="material-symbols-outlined text-[12px] text-white/25">{k.icon}</span>
                    </div>
                    <div className="text-xl font-black font-mono" style={{ color: k.col }}>
                      <AnimatedCounter value={typeof k.val === 'number' ? k.val : 0} decimals={k.dec || 0} suffix={k.suf} />
                    </div>
                    <span className="text-[7px] text-white/25 mt-1.5 uppercase tracking-wider font-bold font-mono">{k.sub}</span>
                  </div>
                ))}
              </div>

              {/* Stand Density Gauges */}
              <div className="rounded-2xl p-4 flex flex-col gap-3 border" style={{ background: 'rgba(4,10,18,0.85)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">Stand Density</span>
                  <span className="text-[8px] text-red-400 font-mono font-black animate-pulse">◉ LIVE</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STAND_NAMES.map((n, i) => (
                    <div key={n} onClick={() => setActiveStand(i === activeStand ? null : i)}
                      className={`cursor-pointer rounded-xl p-2 flex flex-col items-center transition-all hover:bg-white/5 ${activeStand === i ? 'bg-white/8 ring-1' : ''}`}
                      style={activeStand === i ? { ringColor: STAND_COLORS[i] } : {}}>
                      <RadialGauge value={density[i]} color={densityColor(density[i])} label={n.split(' ')[0]} size={68} />
                    </div>
                  ))}
                </div>
                {activeStand !== null && (
                  <div className="bg-black/40 rounded-xl p-3 border flex flex-col gap-2" style={{ borderColor: `${STAND_COLORS[activeStand]}30` }}>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-black text-white uppercase">{STAND_NAMES[activeStand]}</span>
                      <span className="text-[9px] font-mono font-black" style={{ color: densityColor(density[activeStand]) }}>{density[activeStand]}%</span>
                    </div>
                    <SparkBar value={density[activeStand]} color={densityColor(density[activeStand])} />
                    <button onClick={() => setShowDispatchModal(true)}
                      className="w-full py-2 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 border"
                      style={{ background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.25)', color: '#62df7d' }}>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
                      Deploy to {STAND_NAMES[activeStand].split(' ')[0]}
                    </button>
                  </div>
                )}
              </div>

              {/* Gate Wait Times */}
              <div className="rounded-2xl p-4 flex flex-col gap-3 border" style={{ background: 'rgba(4,10,18,0.85)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Gate Scanner Wait</span>
                {GATE_NAMES.map((g, i) => {
                  const w = gateWait[i], col = w > 25 ? '#ff4455' : w > 15 ? '#ffb95f' : '#62df7d'
                  return (
                    <div key={g} className="flex items-center gap-2.5 text-[8.5px] font-mono font-black">
                      <span className="w-12 text-white/60 uppercase">{g}</span>
                      <div className="flex-grow bg-white/5 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(w/50)*100}%`, background: col, boxShadow: `0 0 6px ${col}60` }}/>
                      </div>
                      <span className="w-7 text-right" style={{ color: col }}>{w}m</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── COL 2: Stadium Map + Flow Chart ── */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">

              {/* Stadium Map */}
              <div className="rounded-2xl flex flex-col relative overflow-hidden shadow-2xl neon-border-pulse" style={{ background: 'rgba(4,10,18,0.92)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 380 }}>
                <div className="scan-line pointer-events-none opacity-12"/>
                {/* Map header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative h-2 w-2 rounded-full bg-emerald-400"/></span>
                    <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest font-black">Digital Twin – Realtime HUD</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Density legend */}
                    <div className="flex items-center gap-2">
                      {[['#62df7d','Normal'],['#ffb95f','Elevated'],['#ff4455','Critical']].map(([c,l])=>(
                        <div key={l} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 4px ${c}` }}/>
                          <span className="text-[7px] font-mono text-white/30 uppercase">{l}</span>
                        </div>
                      ))}
                    </div>
                    <span className="font-mono text-[7px] text-white/30">{tick % 2 === 0 ? '23.135°N 72.584°E' : '23.136°N 72.584°E'}</span>
                  </div>
                </div>
                {/* Map SVG */}
                <div className="flex-grow flex items-center justify-center p-3 relative">
                  <StadiumMap />

                </div>
                {/* Map footer quick actions */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/5">
                  <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">Click stand to inspect</span>
                  <div className="ml-auto flex items-center gap-2">
                    <button onClick={() => setShowDispatchModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer border"
                      style={{ background: 'rgba(255,185,95,0.08)', borderColor: 'rgba(255,185,95,0.25)', color: '#ffb95f' }}>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                      New Dispatch
                    </button>
                    <button onClick={() => setScenario(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer border border-white/8 text-white/40 hover:text-white/70 hover:border-white/15">
                      <span className="material-symbols-outlined text-xs">refresh</span>
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Flow Chart */}
              <div className="rounded-2xl p-4 border" style={{ background: 'rgba(4,10,18,0.85)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-0.5 h-4 rounded-full bg-emerald-400"/>
                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-white/40">Gemini Live Flow Velocity</span>
                  </div>
                  <div className="flex gap-3 text-[8px] font-mono font-black text-white/40">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded-full"/><span className="text-emerald-400">ENTRY</span></span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-lime-400 inline-block rounded-full"/><span className="text-lime-400">EXIT</span></span>
                    <span className="text-red-400 animate-pulse">◉ LIVE</span>
                  </div>
                </div>
                <div className="h-[100px] w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 320 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ge2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#62df7d" stopOpacity="0.3"/><stop offset="100%" stopColor="#62df7d" stopOpacity="0"/></linearGradient>
                      <linearGradient id="gx2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9ddf2e" stopOpacity="0.2"/><stop offset="100%" stopColor="#9ddf2e" stopOpacity="0"/></linearGradient>
                    </defs>
                    {[20,50,80].map(y => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.75"/>)}
                    <path d={buildArea(chartEntry)} fill="url(#ge2)"/>
                    <path d={buildPath(chartEntry)} fill="none" stroke="#62df7d" strokeWidth="2" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(98,223,125,0.7))' }}/>
                    <path d={buildArea(chartExit)} fill="url(#gx2)"/>
                    <path d={buildPath(chartExit)} fill="none" stroke="#9ddf2e" strokeWidth="2" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(157,223,46,0.7))' }}/>
                    <circle cx="320" cy={80-chartEntry[7]} r="4" fill="#62df7d" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #62df7d)' }}/>
                    <circle cx="320" cy={80-chartExit[7]}  r="4" fill="#9ddf2e" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #9ddf2e)' }}/>
                  </svg>
                  <div className="flex justify-between text-[7px] font-mono text-white/25 mt-1 uppercase font-black tracking-widest">
                    <span>14:00</span><span>14:15</span><span>14:30</span><span>14:45</span><span className="text-emerald-400">LIVE ◉</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── COL 3: Gemini + Scenarios + Radio ── */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

              {/* Gemini AI */}
              <div className="rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden neon-border-pulse border" style={{ background: 'rgba(4,10,18,0.92)', borderColor: 'rgba(98,223,125,0.1)' }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg,#62df7d,#9ddf2e,#ffb95f)' }}/>
                <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center border" style={{ background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.2)' }}>
                    <span className="material-symbols-outlined text-emerald-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  </div>
                  <div>
                    <p className="font-mono text-[9.5px] font-black uppercase tracking-widest text-emerald-400">Gemini AI Command</p>
                    <p className="text-[8px] text-white/30 font-mono uppercase tracking-wider font-bold">gemini-2.5-pro · {aiConf}% conf</p>
                  </div>
                  <div className="ml-auto"><Waveform color="#62df7d" bars={6}/></div>
                </div>
                {/* Output */}
                <div className="rounded-xl p-3.5 border border-white/5 min-h-[110px] max-h-[150px] overflow-y-auto" style={{ background: 'rgba(2,6,12,0.9)' }}>
                  {!geminiReply && !geminiTyping && (
                    <p className="text-[10px] text-white/25 font-mono italic leading-relaxed">Ask Gemini anything about the stadium — crowd status, gate delays, emergency protocols, egress routes...</p>
                  )}
                  {(geminiReply || geminiTyping) && (
                    <p className="text-[10.5px] text-white/90 leading-relaxed font-mono">
                      {geminiReply}
                      {geminiTyping && <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse align-middle"/>}
                    </p>
                  )}
                </div>
                {/* Input */}
                <div className="flex gap-2">
                  <input value={geminiQuery} onChange={e => setGeminiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGeminiSend()}
                    placeholder="Ask Gemini AI..."
                    className="flex-grow rounded-xl px-3 py-2.5 text-[10px] text-white font-mono placeholder-white/20 focus:outline-none transition-all"
                    style={{ background: 'rgba(2,6,12,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}/>
                  <button onClick={handleGeminiSend}
                    className="px-3 rounded-xl transition-all cursor-pointer flex items-center border"
                    style={{ background: 'rgba(98,223,125,0.1)', borderColor: 'rgba(98,223,125,0.25)', color: '#62df7d' }}>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
                {/* Quick prompts */}
                <div className="flex flex-wrap gap-1.5">
                  {['Crowd status', 'Gate delays', 'Emergency plan', 'Egress route'].map(q => (
                    <button key={q} onClick={() => { setGeminiQuery(q); setTimeout(handleGeminiSend, 50) }}
                      className="text-[7.5px] font-mono font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-white/6 text-white/35 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenario Triggers */}
              <div className="rounded-2xl p-4 flex flex-col gap-3 border" style={{ background: 'rgba(4,10,18,0.85)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                  <span className="material-symbols-outlined text-lime-400 text-sm">bolt</span>
                  <span className="font-mono text-[9.5px] font-black uppercase tracking-widest text-lime-400">Scenario Triggers</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'surge', label: 'Crowd Surge', icon: 'groups', col: '#ff4455', bg: 'rgba(255,68,85,0.08)', border: 'rgba(255,68,85,0.25)', desc: 'South Stand 92%' },
                    { id: 'rain',  label: 'Rain Delay',  icon: 'thunderstorm', col: '#ffb95f', bg: 'rgba(255,185,95,0.08)', border: 'rgba(255,185,95,0.25)', desc: 'Shelter active' },
                    { id: 'vip',   label: 'VIP Egress',  icon: 'stars', col: '#62df7d', bg: 'rgba(98,223,125,0.08)', border: 'rgba(98,223,125,0.25)', desc: 'Staged exit' },
                    { id: 'fire',  label: 'Emergency',   icon: 'local_fire_department', col: '#ff4455', bg: 'rgba(255,68,85,0.12)', border: 'rgba(255,68,85,0.4)', desc: 'Full evacuation' },
                  ].map(s => (
                    <button key={s.id} onClick={() => handleScenario(s.id)}
                      className={`p-3 rounded-xl border flex flex-col gap-1.5 text-left transition-all cursor-pointer hover:-translate-y-0.5 ${selectedScenario === s.id ? 'ring-1' : ''}`}
                      style={{ background: selectedScenario === s.id ? s.bg : 'rgba(4,10,18,0.6)', borderColor: selectedScenario === s.id ? s.border : 'rgba(255,255,255,0.06)', color: s.col, ringColor: s.col }}>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        <span className="font-mono font-black text-[8.5px] uppercase tracking-wide">{s.label}</span>
                      </div>
                      <span className="font-mono text-[7.5px] text-white/30 uppercase">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Radio Log */}
              <div className="rounded-2xl p-4 flex flex-col gap-3 border flex-grow" style={{ background: 'rgba(4,10,18,0.85)', borderColor: 'rgba(255,255,255,0.07)', minHeight: 160 }}>
                <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                  <span className="material-symbols-outlined text-lime-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>headset_mic</span>
                  <span className="font-mono text-[9.5px] font-black uppercase tracking-widest text-lime-400">Staff Radio</span>
                  <span className="ml-auto text-[8px] font-mono text-red-400 font-black animate-pulse">◉ RX</span>
                </div>
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[160px] scrollbar-none" style={{ maskImage: 'linear-gradient(transparent, black 8%, black 92%, transparent)' }}>
                  {[...radioLog].reverse().map(entry => (
                    <div key={entry.id} className="flex items-start gap-1.5 text-[8.5px] font-mono alert-enter shrink-0">
                      <span className="text-white/25 shrink-0 tabular-nums">{entry.t}</span>
                      <span className={`font-black shrink-0 ${entry.col}`}>{entry.cs}</span>
                      <span className="text-white/60 leading-snug">{entry.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── DISPATCH ORDERS PANEL ── */}
          <div className="rounded-2xl overflow-hidden border" style={{ background: 'rgba(4,10,18,0.9)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="absolute h-[2px] left-0 right-0" style={{ background: 'linear-gradient(90deg,#ffb95f,#ff8c42,#ff4455)' }}/>
            {/* Panel header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(255,185,95,0.1)', borderColor: 'rgba(255,185,95,0.3)', boxShadow: '0 0 14px rgba(255,185,95,0.1)' }}>
                  <span className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-amber-400 uppercase tracking-widest font-black">Command Centre</p>
                  <h3 className="font-black text-sm text-white uppercase tracking-wide">Dispatch Orders</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ background: 'rgba(255,68,85,0.08)', borderColor: 'rgba(255,68,85,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                  <span className="font-mono text-[8px] font-black text-red-400 uppercase tracking-widest">{activeOrders.length} Active</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Tab toggle */}
                <div className="flex rounded-xl overflow-hidden border border-white/6 p-0.5 gap-0.5" style={{ background: 'rgba(2,6,12,0.6)' }}>
                  {[['active','Active'],['done','Resolved']].map(([v,l]) => (
                    <button key={v} onClick={() => setDispatchTab(v)}
                      className={`px-3 py-1.5 rounded-lg text-[8.5px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${dispatchTab === v ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                      style={dispatchTab === v ? { background: 'rgba(255,255,255,0.08)' } : {}}>
                      {l}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowDispatchModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#62df7d,#9ddf2e)', color: '#001a09', boxShadow: '0 0 20px rgba(98,223,125,0.25)' }}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                  New Dispatch Order
                </button>
              </div>
            </div>

            {/* Orders list */}
            <div className="p-5">
              {(dispatchTab === 'active' ? activeOrders : resolvedOrders).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <span className="material-symbols-outlined text-white/15 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{dispatchTab === 'active' ? 'check_circle' : 'inbox'}</span>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">{dispatchTab === 'active' ? 'No active dispatch orders' : 'No resolved orders yet'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {(dispatchTab === 'active' ? activeOrders : resolvedOrders).map(order => (
                    <div key={order.id} className="rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden border transition-all hover:-translate-y-0.5"
                      style={{ background: 'rgba(2,6,12,0.7)', borderColor: order.status === 'Done' ? 'rgba(98,223,125,0.12)' : `${PCOLORS[order.priority]}20` }}>
                      {/* Priority accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl" style={{ background: PCOLORS[order.priority] }}/>
                      <div className="pl-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[7.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ color: PCOLORS[order.priority], borderColor: `${PCOLORS[order.priority]}40`, background: `${PCOLORS[order.priority]}12` }}>{order.priority}</span>
                            <span className="font-mono text-[7px] text-white/25">{order.ts}</span>
                          </div>
                          <span className={`font-mono text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${order.status === 'Done' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/8' : 'text-amber-400 border-amber-500/30 bg-amber-500/8 animate-pulse'}`}>
                            {order.status === 'Done' ? '✓ Resolved' : '● Active'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-white/30 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                          <span className="font-mono text-[9px] font-black text-white uppercase tracking-wide">{order.zone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[8px] font-mono text-white/40 mb-2">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">security</span>{order.type}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">group</span>{order.units} units</span>
                        </div>
                        {order.note && (
                          <p className="text-[8.5px] font-mono text-white/35 italic leading-relaxed border-l-2 border-white/8 pl-2">{order.note}</p>
                        )}
                        {order.status === 'Active' && (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => resolveOrder(order.id)}
                              className="flex-1 py-2 rounded-lg font-mono text-[8px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1 border transition-all hover:-translate-y-0.5"
                              style={{ background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.25)', color: '#62df7d' }}>
                              <span className="material-symbols-outlined text-xs">check</span> Resolve
                            </button>
                            <button onClick={() => cancelOrder(order.id)}
                              className="py-2 px-3 rounded-lg font-mono text-[8px] font-black uppercase tracking-wider cursor-pointer border border-white/6 text-white/30 hover:text-red-400 hover:border-red-500/25 transition-all">
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── STAGGERED EGRESS PROTOCOL ── */}
          <div className="rounded-2xl p-5 border relative overflow-hidden" style={{ background: 'rgba(4,10,18,0.9)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="scan-line pointer-events-none opacity-8"/>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg,#ffb95f,#62df7d,#9ddf2e)' }}/>

            {/* Egress Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(255,185,95,0.1)', borderColor: 'rgba(255,185,95,0.3)', boxShadow: '0 0 14px rgba(255,185,95,0.1)' }}>
                  <span className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-amber-400 uppercase tracking-widest font-black">Gemini AI · Post-Match</p>
                  <h3 className="font-black text-sm text-white uppercase tracking-wide">Staggered Departure Protocol</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {egressActive && (
                  <div className="flex items-center gap-2 rounded-full px-3 py-1.5 border" style={{ background: 'rgba(98,223,125,0.05)', borderColor: 'rgba(98,223,125,0.2)' }}>
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative h-2 w-2 rounded-full bg-emerald-400"/></span>
                    <span className="font-mono text-[9px] text-emerald-400 font-black uppercase tracking-widest">Protocol Running · Wave {egressPhase + 1}</span>
                  </div>
                )}
                <button onClick={activateEgress}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer"
                  style={egressActive ? { background: 'rgba(255,68,85,0.1)', borderColor: 'rgba(255,68,85,0.3)', color: '#ff4455' } : { background: 'rgba(255,185,95,0.1)', borderColor: 'rgba(255,185,95,0.3)', color: '#ffb95f' }}>
                  <span className="material-symbols-outlined text-sm">{egressActive ? 'stop_circle' : 'play_circle'}</span>
                  {egressActive ? 'Cancel Protocol' : 'Activate Egress'}
                </button>
              </div>
            </div>

            {/* Egress grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Timeline */}
              <div className="lg:col-span-3 flex flex-col gap-0">
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 font-black mb-3">Departure Timeline</p>
                <div className="relative flex flex-col gap-0">
                  <div className="absolute left-[17px] top-0 bottom-0 w-[1px] bg-white/6"/>
                  {EGRESS_PHASES.map((p, i) => {
                    const isActive = egressActive && egressPhase === i
                    const isPast = egressActive && egressPhase > i
                    return (
                      <div key={i} className={`flex items-start gap-3 relative pb-4 transition-all duration-500 ${isActive ? 'opacity-100' : isPast ? 'opacity-40' : 'opacity-55'}`}>
                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${isActive ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_14px_rgba(98,223,125,0.4)]' : isPast ? 'border-white/15 bg-white/4' : 'border-white/8 bg-[#040A12]'}`}>
                          {isPast
                            ? <span className="material-symbols-outlined text-xs text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            : <span className="font-mono text-[9px] font-black" style={{ color: p.color }}>{i + 1}</span>
                          }
                        </div>
                        <div className="flex flex-col pt-1">
                          <span className="font-mono text-[9px] font-black text-white uppercase tracking-wide">{p.wave}</span>
                          <span className="font-mono text-[8px] text-white/40 mt-0.5">{p.stand}</span>
                          <span className="font-mono text-[7.5px] uppercase tracking-wider mt-0.5 font-black" style={{ color: p.color }}>T+{p.delay}min</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stand exit cards */}
              <div className="lg:col-span-9">
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 font-black mb-3">Stand Exit Status</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {EGRESS_PHASES.map((p, i) => {
                    const isActive = egressActive && egressPhase === i
                    const isPast   = egressActive && egressPhase > i
                    const flowPct  = isPast ? 100 : isActive ? 45 : 0
                    return (
                      <div key={i} className={`rounded-xl p-3.5 flex flex-col gap-2.5 relative overflow-hidden transition-all duration-700 border ${isActive ? 'shadow-[0_0_16px_rgba(98,223,125,0.12)]' : ''}`}
                        style={{ background: 'rgba(2,6,12,0.7)', borderColor: isActive ? 'rgba(98,223,125,0.3)' : isPast ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)', opacity: isPast ? 0.6 : 1 }}>
                        {isActive && <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(98,223,125,0.025)' }}/>}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[8.5px] font-black text-white uppercase tracking-wide">{p.stand}</span>
                            <p className="font-mono text-[7.5px] text-white/30 mt-0.5 uppercase tracking-wider">{p.gate}</p>
                          </div>
                          <span className={`font-mono text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${isActive ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/8 animate-pulse' : isPast ? 'text-white/35 border-white/8 bg-white/4' : 'text-white/25 border-white/6 bg-white/3'}`}>
                            {isActive ? '⬡ ACTIVE' : isPast ? '✓ CLEARED' : '◌ QUEUED'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[10px]" style={{ color: p.color }}>groups</span>
                          <span className="font-mono text-[8px] font-black text-white">{p.fans.toLocaleString()} fans</span>
                        </div>
                        <div>
                          <div className="flex justify-between text-[7px] font-mono text-white/30 uppercase tracking-wider mb-1">
                            <span>Exit Flow</span><span style={{ color: p.color }}>{flowPct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full transition-all duration-[2s] ease-out" style={{ width: `${flowPct}%`, background: p.color, boxShadow: `0 0 8px ${p.color}` }}/>
                          </div>
                        </div>
                        <div className="font-mono text-[7px] text-white/25 uppercase tracking-wider">Wave {i+1} · T+{p.delay}min</div>
                      </div>
                    )
                  })}
                </div>

                {/* Gemini Traffic Forecast */}
                <div className="mt-4 rounded-xl border p-3.5 flex flex-col md:flex-row items-start md:items-center gap-4" style={{ background: 'rgba(2,6,12,0.6)', borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                    <span className="font-mono text-[8.5px] font-black text-emerald-400 uppercase tracking-widest">Gemini Traffic Forecast</span>
                  </div>
                  <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Peak Reduction',  val: egressActive ? '−62%'     : '—', col: '#62df7d' },
                      { label: 'Gate Throughput', val: egressActive ? '5,200/min': '—', col: '#9ddf2e' },
                      { label: 'Clear ETA',       val: egressActive ? '15:46'    : '—', col: '#ffb95f' },
                      { label: 'Confidence',      val: '99.1%', col: 'white' },
                    ].map(m => (
                      <div key={m.label} className="flex flex-col gap-0.5">
                        <span className="font-mono text-[7px] text-white/30 uppercase tracking-wider font-bold">{m.label}</span>
                        <span className="font-mono text-[11px] font-black" style={{ color: m.col }}>{m.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
