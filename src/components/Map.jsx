import React, { useState, useEffect } from 'react'

// ============================================
// SUB-COMPONENT: ANIMATED COUNTER
// ============================================
function AnimatedCounter({ value, duration = 600, suffix = "" }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    if (isNaN(end)) {
      setCurrent(value)
      return
    }
    const startTime = performance.now()

    function update(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = progress * (2 - progress) // Ease out quad
      const nextVal = Math.round(start + (end - start) * ease)

      setCurrent(nextVal)

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        setCurrent(end)
      }
    }

    const frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [value, duration])

  return (
    <span>
      {typeof value === 'number' || !isNaN(parseInt(value)) ? current.toLocaleString() : value}{suffix}
    </span>
  )
}

// ============================================
// SUB-COMPONENT: METRIC BADGE
// ============================================
function MetricBadge({ label, value, suffix, status, icon, risk, showProgress }) {
  const isError = risk === 'error'
  const isWarning = risk === 'tertiary'
  
  const statusColor = isError ? 'text-error' : isWarning ? 'text-tertiary' : 'text-primary'
  const glowBorder = isError ? 'border-error/30 shadow-[0_0_12px_rgba(255,180,171,0.15)] bg-error/5' : 
                     isWarning ? 'border-tertiary/30 shadow-[0_0_12px_rgba(255,185,95,0.15)] bg-tertiary/5' : 
                     'border-primary/30 shadow-[0_0_12px_rgba(98,223,125,0.15)] bg-primary/5'

  return (
    <div className={`glass-panel rounded border p-2 flex flex-col justify-between h-[64px] text-left transition-all duration-300 ${glowBorder}`}>
      <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-on-surface-variant font-semibold">
        <span className="uppercase">{label}</span>
        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      
      <div className="flex justify-between items-baseline mt-0.5">
        <span className="text-xs font-bold font-mono text-white">
          <AnimatedCounter value={value} suffix={suffix} />
        </span>
        <span className={`text-[8px] font-mono tracking-wider font-bold uppercase ${statusColor}`}>
          {status}
        </span>
      </div>

      {showProgress && (
        <div className="w-full bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isError ? 'bg-error animate-pulse' : isWarning ? 'bg-tertiary' : 'bg-primary'}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENT: METRIC COLUMN OVERLAY
// ============================================
function MetricColumnOverlay({ activeSector, colorMap }) {
  if (!activeSector) return null

  const badges = [
    {
      label: "Fans Inside",
      value: activeSector.fans,
      suffix: "",
      status: activeSector.fans > 14000 ? "HEAVY" : activeSector.fans > 10000 ? "MODERATE" : "STABLE",
      icon: "group",
      risk: activeSector.risk,
      showProgress: false
    },
    {
      label: "Stand Density",
      value: activeSector.density,
      suffix: "%",
      status: activeSector.density > 85 ? "CRITICAL" : activeSector.density > 60 ? "WARNING" : "SAFE",
      icon: "pie_chart",
      risk: activeSector.risk,
      showProgress: true
    },
    {
      label: "Risk Index",
      value: activeSector.risk === 'error' ? 92 : activeSector.risk === 'tertiary' ? 64 : 24,
      suffix: "%",
      status: activeSector.risk === 'error' ? "SEVERE" : activeSector.risk === 'tertiary' ? "ELEVATED" : "OPTIMAL",
      icon: "warning",
      risk: activeSector.risk,
      showProgress: false
    },
    {
      label: "Deployed Staff",
      value: activeSector.staff,
      suffix: "",
      status: activeSector.staff >= 24 ? "MAX STAFF" : activeSector.staff >= 15 ? "ADEQUATE" : "LOW",
      icon: "security",
      risk: activeSector.risk,
      showProgress: false
    },
    {
      label: "Flow Velocity",
      value: activeSector.risk === 'error' ? 42 : activeSector.risk === 'tertiary' ? 84 : 110,
      suffix: " pax/m",
      status: activeSector.risk === 'error' ? "CONGESTED" : activeSector.risk === 'tertiary' ? "HEAVY" : "FLOWING",
      icon: "speed",
      risk: activeSector.risk,
      showProgress: false
    },
    {
      label: "Emergency Ready",
      value: activeSector.risk === 'error' ? 85 : activeSector.risk === 'tertiary' ? 92 : 98,
      suffix: "%",
      status: activeSector.risk === 'error' ? "STANDBY" : activeSector.risk === 'tertiary' ? "ALERT" : "SECURE",
      icon: "local_hospital",
      risk: activeSector.risk,
      showProgress: false
    }
  ]

  return (
    <div className="absolute right-3 top-[65px] bottom-[15px] w-[110px] sm:w-[130px] md:w-[155px] flex flex-col justify-between z-30 pointer-events-auto">
      {badges.map((badge, idx) => (
        <div 
          key={idx} 
          className="animate-[cardEnter_0.4s_ease-out] transition-all duration-300 hover:-translate-x-1"
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          <MetricBadge 
            label={badge.label}
            value={badge.value}
            suffix={badge.suffix}
            status={badge.status}
            icon={badge.icon}
            risk={badge.risk}
            showProgress={badge.showProgress}
            colorMap={colorMap}
          />
        </div>
      ))}
    </div>
  )
}

// ============================================
// SUB-COMPONENT: SECTOR PANEL
// ============================================
function SectorPanel({ activeSector, setActiveSectorId, localDispatchStatus, triggerLocalDispatch, colorMap }) {
  if (!activeSector) return null
  const colors = colorMap[activeSector.risk] || colorMap.primary

  return (
    <div className="absolute bottom-6 left-6 w-[260px] md:w-[280px] glass-panel rounded-lg border-outline-variant p-4 z-30 shadow-2xl animate-[cardEnter_0.3s_ease-out] bg-[#07111F]/90 backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 pb-2 border-b border-white/10">
        <div>
          <h4 className="font-label-caps text-xs text-white uppercase font-bold tracking-wide">
            {activeSector.name}
          </h4>
          <span className="font-terminal-nano text-[9px] text-on-surface-variant font-mono">
            ADMIN STAND COMMAND
          </span>
        </div>
        <button 
          onClick={() => setActiveSectorId(null)}
          className="text-on-surface-variant hover:text-white cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      {/* Core Stats details */}
      <div className="flex flex-col gap-2.5">
        {/* Stat 1: Fan count */}
        <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded px-2.5 py-1.5 font-mono">
          <span className="text-[9px] text-on-surface-variant uppercase font-label-caps font-semibold">LIVE POPULATION</span>
          <span className="text-xs font-bold text-white">
            <AnimatedCounter value={activeSector.fans} /> pax
          </span>
        </div>

        {/* Stat 2: Density Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className="text-on-surface-variant uppercase font-label-caps font-semibold">SECTOR DENSITY</span>
            <span className={`font-bold ${colors.text}`}>
              <AnimatedCounter value={activeSector.density} />%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                activeSector.risk === 'error' ? 'bg-error animate-pulse' :
                activeSector.risk === 'tertiary' ? 'bg-tertiary' : 'bg-primary'
              }`}
              style={{ width: `${activeSector.density}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Strip: Stewards & Risk */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="flex flex-col bg-white/5 border border-white/5 rounded p-1.5 text-center">
            <span className="text-[8px] text-on-surface-variant font-label-caps font-semibold">STEWARDS</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5">
              <AnimatedCounter value={activeSector.staff} /> active
            </span>
          </div>
          <div className="flex flex-col bg-white/5 border border-white/5 rounded p-1.5 text-center">
            <span className="text-[8px] text-on-surface-variant font-label-caps font-semibold">RISK RATING</span>
            <span className={`text-xs font-bold font-mono uppercase mt-0.5 ${colors.text}`}>
              {activeSector.risk === 'error' ? 'Critical' : activeSector.risk === 'tertiary' ? 'Elevated' : 'Safe'}
            </span>
          </div>
        </div>

        {/* Log commentary details */}
        <p className="text-[10px] text-on-surface-variant italic leading-normal border-t border-white/5 pt-2">
          &ldquo;{activeSector.details}&rdquo;
        </p>

        {/* Admin dispatch actions */}
        <div className="flex flex-col gap-1.5 border-t border-white/5 pt-2">
          <button 
            onClick={triggerLocalDispatch}
            className="w-full glass-panel py-1.5 rounded text-[10px] text-primary hover:text-white border-primary/20 hover:border-primary/50 transition-all font-status-badge cursor-pointer uppercase flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-xs">local_police</span>
            {localDispatchStatus || "Deploy Responder Group"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SUB-COMPONENT: STADIUM MAP
// ============================================
function StadiumMap({ 
  nodes, 
  routes, 
  sectors, 
  activeSectorId, 
  setActiveSectorId, 
  hoveredSectorId, 
  setHoveredSectorId, 
  hoveredNode, 
  setHoveredNode, 
  colorMap, 
  makeAnnularSectorPath, 
  cx, 
  cy,
  localDispatchStatus
}) {
  const activeSector = sectors.find(s => s.id === activeSectorId)

  // 6 specific Y-coordinate connections for the telemetry badges in 600x450 grid space
  const badgeLineYCoords = [56, 119, 182, 245, 308, 371]

  return (
    <div 
      className="relative w-full max-w-[620px] aspect-[4/3] rounded-lg border border-white/8 overflow-hidden shadow-2xl transition-all duration-500"
      style={{ 
        background: 'radial-gradient(ellipse at 50% 50%, #0a1e12 0%, #040d18 55%, #03080F 100%)'
      }}
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
        <div className="w-[400px] h-[300px] rounded-full opacity-10" style={{ background: 'radial-gradient(ellipse, rgba(98,223,125,0.3), transparent 70%)' }}></div>
      </div>

      {/* SVG Vector Layer for concentric sectors, grid blueprint, route paths, and dynamic HUD lines */}
      <svg viewBox="0 0 600 450" className="absolute inset-0 w-full h-full z-10 select-none">
        <defs>
          <radialGradient id="pitchGlow">
            <stop offset="0%" stopColor="#082b14" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#03080F" stopOpacity="0.95"/>
          </radialGradient>
        </defs>

        {/* Blueprint Grid: Concentric Circles (Center: cx, cy) */}
        {[120, 190, 260].map((radius, idx) => (
          <circle
            key={`grid-${idx}`}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(98, 223, 125, 0.12)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        {/* Blueprint Grid: Radial division lines */}
        {[30, 150, 210, 330].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180
          const xStart = cx + 120 * Math.cos(rad)
          const yStart = cy + 120 * Math.sin(rad)
          const xEnd = cx + 260 * Math.cos(rad)
          const yEnd = cy + 260 * Math.sin(rad)
          return (
            <line
              key={`radial-${idx}`}
              x1={xStart}
              y1={yStart}
              x2={xEnd}
              y2={yEnd}
              stroke="rgba(98, 223, 125, 0.1)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          )
        })}

        {/* Curved Concentric Field & Boundaries */}
        <ellipse cx={cx} cy={cy} rx="106" ry="76" fill="url(#pitchGlow)" stroke="rgba(98,223,125,0.4)" strokeWidth="1.5" strokeDasharray="5 5" />
        <ellipse cx={cx} cy={cy} rx="76" ry="52" fill="none" stroke="rgba(157,223,46,0.18)" strokeWidth="1" strokeDasharray="8 6" />

        {/* Central Wicket Pitch */}
        <rect x={cx - 10} y={cy - 22} width="20" height="44" fill="#8C7965" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <line x1={cx - 10} y1={cy - 14} x2={cx + 10} y2={cy - 14} stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
        <line x1={cx - 10} y1={cy + 14} x2={cx + 10} y2={cy + 14} stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
        {[-4, 0, 4].map(x => (
          <React.Fragment key={x}>
            <circle cx={cx + x} cy={cy - 18} r="0.8" fill="#fff" opacity="0.8" />
            <circle cx={cx + x} cy={cy + 18} r="0.8" fill="#fff" opacity="0.8" />
          </React.Fragment>
        ))}

        {/* 1. Curved Concentric Stand Strips (Annular Sectors) */}
        {sectors.map((sec) => {
          const isHovered = hoveredSectorId === sec.id
          const isSelected = activeSectorId === sec.id
          const riskColor = colorMap[sec.risk] || colorMap.primary

          // Generate mathematical arched path
          const pathD = makeAnnularSectorPath(cx, cy, sec.rIn, sec.rOut, sec.startAngle, sec.endAngle)

          const strokeColorMap = { error: '#ffb4ab', tertiary: '#ffb95f', primary: '#62df7d', secondary: '#9ddf2e' }
          const strokeColor = strokeColorMap[sec.risk] || '#62df7d'
          return (
            <path
              key={sec.id}
              d={pathD}
              fill={isHovered || isSelected ? riskColor.fill : 'rgba(0,0,0,0)'}
              stroke={isSelected ? strokeColor : isHovered ? strokeColor : 'rgba(255, 255, 255, 0.06)'}
              strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '0.8'}
              strokeDasharray={isSelected ? 'none' : isHovered ? '3 2' : 'none'}
              style={isSelected ? { filter: `drop-shadow(0 0 6px ${strokeColor})` } : {}}
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSectorId(sec.id)}
              onMouseLeave={() => setHoveredSectorId(null)}
              onClick={() => setActiveSectorId(isSelected ? null : sec.id)}
            />
          )
        })}

        {/* 2. Dynamic Redirection SVG Routes */}
        {routes.map((route, index) => {
          const startX = route.startX || '50%'
          const startY = route.startY || '50%'
          const endX = route.endX || '50%'
          const endY = route.endY || '50%'

          return (
            <g key={index}>
              <line 
                x1={startX} 
                y1={startY} 
                x2={endX} 
                y2={endY} 
                className={`stroke-2 ${
                  route.color === 'error' ? 'text-error' :
                  route.color === 'tertiary' ? 'text-tertiary' :
                  route.color === 'secondary' ? 'text-secondary' : 'text-primary'
                }`}
                style={{ stroke: 'currentColor', opacity: 0.25 }}
              />
              <line 
                x1={startX} 
                y1={startY} 
                x2={endX} 
                y2={endY} 
                className={`stroke-2 marching-ants ${
                  route.color === 'error' ? 'text-error' :
                  route.color === 'tertiary' ? 'text-tertiary' :
                  route.color === 'secondary' ? 'text-secondary' : 'text-primary'
                }`}
                style={{ stroke: 'currentColor' }}
              />
            </g>
          )
        })}

        {/* 3. TACTICAL HUD CONNECTING LINES FOR SELECTED SECTOR */}
        {activeSector && badgeLineYCoords.map((badgeY, idx) => {
          // Calculate centroid of active stand sector
          const rMid = (activeSector.rIn + activeSector.rOut) / 2
          const angleMid = (activeSector.startAngle + activeSector.endAngle) / 2
          const rad = (angleMid * Math.PI) / 180
          const startX = cx + rMid * Math.cos(rad)
          const startY = cy + rMid * Math.sin(rad)
          
          const endX = 485 // Left boundary of the absolute badge column in viewBox pixels
          const endY = badgeY

          // High tech HUD joint
          const midX = startX + (endX - startX) * 0.45
          const activeColorClass = activeSector.risk === 'error' ? 'text-error' : 
                                   activeSector.risk === 'tertiary' ? 'text-tertiary' : 'text-primary'

          return (
            <g key={`hud-line-${idx}`} className="transition-all duration-500 animate-[fadeIn_0.5s_ease-out]">
              {/* Glowing Blur Path */}
              <path 
                d={`M ${startX} ${startY} L ${midX} ${startY} L ${endX} ${endY}`} 
                fill="none" 
                stroke="currentColor" 
                className={`${activeColorClass} stroke-[2] blur-[1.5px] opacity-40 animate-[pulse_2s_infinite]`}
              />
              {/* Sharp Tactical Core Path */}
              <path 
                d={`M ${startX} ${startY} L ${midX} ${startY} L ${endX} ${endY}`} 
                fill="none" 
                stroke="currentColor" 
                className={`${activeColorClass} stroke-[0.75] opacity-80`}
                strokeDasharray="4 2"
              />
              {/* Glowing Dots */}
              <circle cx={startX} cy={startY} r="3" className={`fill-current ${activeColorClass} animate-ping opacity-75`} />
              <circle cx={startX} cy={startY} r="2" className={`fill-current ${activeColorClass}`} />
              <circle cx={midX} cy={startY} r="1.5" className={`fill-current ${activeColorClass}`} />
              <circle cx={endX} cy={endY} r="2.5" className={`fill-current ${activeColorClass} animate-pulse`} />
            </g>
          )
        })}
        {/* Dynamic Local Emergency Dispatch Route in Map.jsx */}
        {localDispatchStatus && activeSectorId && (
          <g>
            <path 
              d={
                activeSectorId.includes('north') ? `M ${cx},${cy} C ${cx+20},${cy-50} ${cx+20},${cy-80} ${cx},${cy-115}` :
                activeSectorId.includes('south') ? `M ${cx},${cy} C ${cx-20},${cy+50} ${cx-20},${cy+80} ${cx},${cy+115}` :
                activeSectorId.includes('east') ? `M ${cx},${cy} C ${cx+50},${cy-20} ${cx+100},${cy-20} ${cx+170},${cy}` :
                activeSectorId.includes('west') ? `M ${cx},${cy} C ${cx-50},${cy-20} ${cx-100},${cy-20} ${cx-170},${cy}` : ""
              }
              fill="none"
              stroke="#ffb95f"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              className="drop-shadow-[0_0_8px_rgba(255,185,95,0.7)] animate-pulse"
            />
            <circle r="5.5" fill="#ffb95f" className="drop-shadow-[0_0_8px_#ffb95f]">
              <animateMotion 
                dur="1.5s" 
                repeatCount="indefinite" 
                path={
                  activeSectorId.includes('north') ? `M ${cx},${cy} C ${cx+20},${cy-50} ${cx+20},${cy-80} ${cx},${cy-115}` :
                  activeSectorId.includes('south') ? `M ${cx},${cy} C ${cx-20},${cy+50} ${cx-20},${cy+80} ${cx},${cy+115}` :
                  activeSectorId.includes('east') ? `M ${cx},${cy} C ${cx+50},${cy-20} ${cx+100},${cy-20} ${cx+170},${cy}` :
                  activeSectorId.includes('west') ? `M ${cx},${cy} C ${cx-50},${cy-20} ${cx-100},${cy-20} ${cx-170},${cy}` : ""
                }
              />
            </circle>
          </g>
        )}
      </svg>

      {/* 4. Danger Nodes Overlay */}
      {nodes.map((node) => {
        const colors = colorMap[node.color] || colorMap.primary
        const positionStyles = {
          top: node.top,
          left: node.left !== 'auto' ? node.left : undefined,
          right: node.right !== 'auto' ? node.right : undefined,
        }
        const isHovered = hoveredNode === node.id

        return (
          <div 
            key={node.id} 
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-500 z-25"
            style={positionStyles}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="relative flex items-center justify-center w-8 h-8">
              {node.hasRing && (
                <div className={`pulse-ring ${colors.ring}`} style={{ color: 'currentColor' }}></div>
              )}
              <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${colors.dot} ${colors.glow} ${isHovered ? 'scale-130' : ''}`}></div>
            </div>

            {/* Node Tooltip */}
            <div 
              className={`absolute -top-12 left-1/2 -translate-x-1/2 glass-panel px-3 py-1.5 rounded font-status-badge text-[10px] whitespace-nowrap transition-all duration-300 border ${
                isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              } ${colors.tooltip}`}
            >
              {node.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// MAIN COMPONENT EXPORT
// ============================================
export default function Map({ nodes = [], routes = [], mapText = 'LIVE FEED', sectors = [] }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [activeSectorId, setActiveSectorId] = useState(null)
  const [hoveredSectorId, setHoveredSectorId] = useState(null)
  const [localDispatchStatus, setLocalDispatchStatus] = useState(null)

  // Mathematically calculated center of concentric seating strips on the stadium image
  const cx = 300
  const cy = 225

  // Color mapping utility for risk classes
  const colorMap = {
    error: {
      text: 'text-error',
      border: 'border-error/30',
      fill: 'rgba(255, 180, 171, 0.16)',
      glow: 'shadow-[0_0_12px_rgba(255,180,171,0.9)]',
      dot: 'bg-error',
      ring: 'border-error text-error',
      tooltip: 'border-error/50 text-error'
    },
    primary: {
      text: 'text-primary',
      border: 'border-primary/30',
      fill: 'rgba(98, 223, 125, 0.12)',
      glow: 'shadow-[0_0_12px_rgba(98,223,125,0.9)]',
      dot: 'bg-primary',
      ring: 'border-primary text-primary',
      tooltip: 'border-primary/30 text-primary'
    },
    tertiary: {
      text: 'text-tertiary',
      border: 'border-tertiary/30',
      fill: 'rgba(255, 185, 95, 0.16)',
      glow: 'shadow-[0_0_12px_rgba(255,185,95,0.9)]',
      dot: 'bg-tertiary',
      ring: 'border-tertiary text-tertiary',
      tooltip: 'border-tertiary/30 text-tertiary'
    },
    secondary: {
      text: 'text-secondary',
      border: 'border-secondary/30',
      fill: 'rgba(157, 223, 46, 0.12)',
      glow: 'shadow-[0_0_12px_rgba(157,223,46,0.9)]',
      dot: 'bg-secondary',
      ring: 'border-secondary text-secondary',
      tooltip: 'border-secondary/30 text-secondary'
    }
  }

  // Helper function to generate mathematically exact concentric annular sectors (seating arcs)
  const makeAnnularSectorPath = (cx, cy, rIn, rOut, startAngle, endAngle) => {
    const toRad = (deg) => (deg * Math.PI) / 180
    
    // Outer starting point
    const x1_out = cx + rOut * Math.cos(toRad(startAngle))
    const y1_out = cy + rOut * Math.sin(toRad(startAngle))
    
    // Outer ending point
    const x2_out = cx + rOut * Math.cos(toRad(endAngle))
    const y2_out = cy + rOut * Math.sin(toRad(endAngle))
    
    // Inner ending point
    const x2_in = cx + rIn * Math.cos(toRad(endAngle))
    const y2_in = cy + rIn * Math.sin(toRad(endAngle))
    
    // Inner starting point
    const x1_in = cx + rIn * Math.cos(toRad(startAngle))
    const y1_in = cy + rIn * Math.sin(toRad(startAngle))
    
    const largeArcOuter = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
    const largeArcInner = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
    
    return `
      M ${x1_out} ${y1_out}
      A ${rOut} ${rOut} 0 ${largeArcOuter} 1 ${x2_out} ${y2_out}
      L ${x2_in} ${y2_in}
      A ${rIn} ${rIn} 0 ${largeArcInner} 0 ${x1_in} ${y1_in}
      Z
    `
  }

  const activeSector = sectors.find(s => s.id === activeSectorId)
  const hoveredSector = sectors.find(s => s.id === hoveredSectorId)

  const triggerLocalDispatch = () => {
    setLocalDispatchStatus("Dispatching Mobile Unit...")
    setTimeout(() => {
      setLocalDispatchStatus("Mobile Unit En Route!")
      setTimeout(() => {
        setLocalDispatchStatus(null)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="lg:col-span-8 glass-panel glow-border-active rounded-xl flex flex-col overflow-hidden h-[480px] sm:h-[540px] lg:h-[600px] border-outline-variant animate-up delay-200 relative">
      {/* Panel Header */}
      <div className="flex justify-between items-center px-panel-padding py-3 border-b border-white/10 bg-surface-container-low/80 backdrop-blur-sm z-30">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            explore
          </span>
          <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase font-bold">DIGITAL TWIN REALTIME MAP</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-status-badge text-[8px] text-on-surface-variant bg-surface/60 px-2 py-0.5 rounded-full border border-white/5 uppercase">
            Click Stadium concentric strips to view stats
          </span>
          <span className="font-status-badge text-[10px] text-on-surface-variant flex items-center gap-2 bg-surface/50 px-3 py-1 rounded-full border border-white/5 uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {mapText}
          </span>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-grow bg-[#050e1c] overflow-hidden flex items-center justify-center p-4">
        
        {/* Modular StadiumMap Component */}
        <StadiumMap 
          nodes={nodes}
          routes={routes}
          sectors={sectors}
          activeSectorId={activeSectorId}
          setActiveSectorId={setActiveSectorId}
          hoveredSectorId={hoveredSectorId}
          setHoveredSectorId={setHoveredSectorId}
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          colorMap={colorMap}
          makeAnnularSectorPath={makeAnnularSectorPath}
          cx={cx}
          cy={cy}
          localDispatchStatus={localDispatchStatus}
        />

        {/* Modular SectorPanel (Bottom Left Administrative Card) */}
        <SectorPanel 
          activeSector={activeSector}
          setActiveSectorId={setActiveSectorId}
          localDispatchStatus={localDispatchStatus}
          triggerLocalDispatch={triggerLocalDispatch}
          colorMap={colorMap}
        />

        {/* Modular MetricColumnOverlay (Telemetry Sensors Right Column) */}
        <MetricColumnOverlay 
          activeSector={activeSector}
          colorMap={colorMap}
        />

        {/* Hover Sector Tooltip (Bottom Left) */}
        {hoveredSector && !activeSector && (
          <div className="absolute bottom-6 left-6 w-[240px] glass-panel rounded-lg border-white/5 p-3 z-30 pointer-events-none bg-[#07111F]/80 backdrop-blur-md animate-[cardEnter_0.2s_ease-out]">
            <h5 className="font-label-caps text-[10px] text-white uppercase mb-1 font-bold">{hoveredSector.name}</h5>
            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-on-surface-variant font-label-caps">Live Load:</span>
              <span className="text-white font-bold">{hoveredSector.fans.toLocaleString()} pax</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono mt-0.5">
              <span className="text-on-surface-variant font-label-caps">Density:</span>
              <span className={`font-bold ${colorMap[hoveredSector.risk]?.text || 'text-primary'}`}>{hoveredSector.density}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
