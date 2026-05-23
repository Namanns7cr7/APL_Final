import React, { useState, useEffect } from 'react'

export default function GeminiCommand({
  alertTitle = 'TOP RISK DETECTED',
  alertDesc = 'Gate A Congestion approaching critical mass. Current queue length exceeds safe operational limits by 24%.',
  recTitle = 'AI RECOMMENDATION',
  recDesc = 'Reroute incoming Metro pedestrian traffic to Gate C. Deploy 6 standby volunteers to assist redirection.',
  recConfidence = '94%',
  opsTasks = [],
  onGeneratePlan = () => {}
}) {
  const confNum = parseFloat(recConfidence)
  const confColor = confNum >= 90 ? 'text-primary' : confNum >= 75 ? 'text-tertiary' : 'text-error'
  const confCircle = confNum >= 90 ? '#62df7d' : confNum >= 75 ? '#ffb95f' : '#ffb4ab'
  const r = 28, circ = 2 * Math.PI * r

  // Typewriter effect state
  const [typedAlert, setTypedAlert] = useState('')
  const [typedRec, setTypedRec] = useState('')
  const [isAlertDone, setIsAlertDone] = useState(false)
  const [isRecDone, setIsRecDone] = useState(false)

  useEffect(() => {
    setTypedAlert('')
    setTypedRec('')
    setIsAlertDone(false)
    setIsRecDone(false)

    let alertTimer
    let recTimer
    let currentAlertStr = ''
    let currentRecStr = ''
    let alertIdx = 0
    let recIdx = 0

    const typeAlert = () => {
      if (alertIdx < alertDesc.length) {
        currentAlertStr += alertDesc[alertIdx]
        setTypedAlert(currentAlertStr)
        alertIdx++
        alertTimer = setTimeout(typeAlert, Math.random() * 8 + 4)
      } else {
        setIsAlertDone(true)
        typeRec()
      }
    }

    const typeRec = () => {
      if (recIdx < recDesc.length) {
        currentRecStr += recDesc[recIdx]
        setTypedRec(currentRecStr)
        recIdx++
        recTimer = setTimeout(typeRec, Math.random() * 6 + 3)
      } else {
        setIsRecDone(true)
      }
    }

    typeAlert()

    return () => {
      clearTimeout(alertTimer)
      clearTimeout(recTimer)
    }
  }, [alertDesc, recDesc])

  return (
    <div className="lg:col-span-4 glass-panel rounded-xl flex flex-col border border-white/8 sticky top-20 animate-up delay-300 overflow-hidden shadow-2xl">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-error pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8"
        style={{ background: 'rgba(6,16,30,0.7)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
          </div>
          <div>
            <h2 className="font-mono text-[9.5px] text-primary tracking-widest uppercase font-black">Gemini Command Agent</h2>
            <p className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider font-bold mt-0.5">gemini-2.5-pro · realtime</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[8px] font-mono font-black text-secondary uppercase tracking-widest">
          <span className={`w-1.5 h-1.5 rounded-full bg-secondary ${(!isAlertDone || !isRecDone) ? 'animate-ping' : 'animate-pulse'}`}></span>
          {(!isAlertDone || !isRecDone) ? 'ANALYZING' : 'LIVE'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-grow overflow-y-auto">

        {/* Alert Box */}
        <div className="relative bg-error/5 border border-error/25 rounded-xl p-4 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-error rounded-l-xl shadow-[0_0_8px_rgba(255,180,171,0.6)]"></div>
          <div className="flex items-center gap-2 mb-2 pl-2">
            <span className="material-symbols-outlined text-error text-sm animate-pulse">warning</span>
            <span className="font-mono text-[9px] text-error tracking-widest uppercase font-black">{alertTitle}</span>
          </div>
          <p className="font-sans text-[11px] text-on-surface leading-relaxed pl-2 min-h-[30px]">
            {typedAlert}
            {!isAlertDone && <span className="text-error animate-pulse ml-0.5 font-bold">▋</span>}
          </p>
        </div>

        {/* Recommendation + Confidence */}
        <div className="relative bg-primary/4 border border-primary/18 rounded-xl p-4 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-xl shadow-[0_0_8px_rgba(98,223,125,0.5)]"></div>
          <div className="flex items-center gap-2 mb-2 pl-2">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <span className="font-mono text-[9px] text-primary tracking-wider uppercase font-black">{recTitle}</span>
          </div>
          <p className="font-sans text-[11px] text-on-surface mb-4 leading-relaxed pl-2 min-h-[40px]">
            {typedRec}
            {isAlertDone && !isRecDone && <span className="text-primary animate-pulse ml-0.5 font-bold">▋</span>}
          </p>

          {/* Confidence gauge */}
          <div className="flex items-center gap-4 pt-3 border-t border-white/8 pl-2">
            <svg width="68" height="68" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
              <circle cx="34" cy="34" r={r} fill="none" stroke={confCircle} strokeWidth="5"
                strokeDasharray={`${(confNum / 100) * circ} ${circ}`}
                strokeLinecap="round" transform="rotate(-90 34 34)"
                style={{ filter: `drop-shadow(0 0 5px ${confCircle})`, transition: 'stroke-dasharray 0.8s ease' }}
              />
              <text x="34" y="38" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="JetBrains Mono, monospace">
                {recConfidence}
              </text>
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[8.5px] text-on-surface-variant uppercase tracking-widest font-bold">Confidence Score</span>
              <span className={`font-mono text-xl font-black ${confColor}`}>{recConfidence}</span>
              <span className="font-mono text-[8px] text-on-surface-variant">Gemini 2.5 Pro analysis</span>
            </div>
          </div>
        </div>

        {/* Dispatch Tasks */}
        {opsTasks && opsTasks.length > 0 && (
          <div className="bg-tertiary/4 border border-tertiary/18 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-tertiary rounded-l-xl"></div>
            <div className="flex items-center gap-2 mb-3 pl-2">
              <span className="material-symbols-outlined text-tertiary text-sm">campaign</span>
              <span className="font-mono text-[9px] text-tertiary tracking-wider uppercase font-black">Dispatch Tasks</span>
            </div>
            <ul className="flex flex-col gap-2 pl-2">
              {opsTasks.slice(0, 4).map((task, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[10.5px] text-on-surface-variant leading-snug">
                  <span className="text-tertiary font-mono font-black mt-0.5 shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0">
        <button
          onClick={onGeneratePlan}
          className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-mono text-[9.5px] font-black tracking-widest px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(98,223,125,0.18)] hover:shadow-[0_0_28px_rgba(98,223,125,0.35)] hover:-translate-y-0.5 cursor-pointer uppercase"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
          GENERATE AI PLAN
        </button>
      </div>
    </div>
  )
}
