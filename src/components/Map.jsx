import React, { useState } from 'react'

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
    <div className="lg:col-span-8 glass-panel glow-border-active rounded-xl flex flex-col overflow-hidden h-[600px] border-outline-variant animate-up delay-200 relative">
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
        
        {/* Simulated Map Container */}
        <div 
          className="relative w-full max-w-[620px] aspect-[4/3] bg-surface rounded-lg border border-surface-variant overflow-hidden shadow-2xl transition-all duration-500"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIhhtx8gkvFMouW65i-Z679qCnv2zExzhyUU3nRSswc7y6CgbbmtlJaU-m2g_WgEP2u7vpylVeirmGMDZ8592yD8zx5-PMZZiN4DD--zA2JNJNjopbOT5a4MQ2rdLR3MDOvQrMBsnPXw-0leMB5oGSSe433GGY_OiEg4HW1TQWHr9vuEzTpDDEXhcjGSDcBzdE1Gl0gAegF_Skexw_mJxCWULb_uKNs8ixEWBoDeNOQQWQGV1pLEI58PYThvdGDxllb-m19skFIHNb')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Tactical Radar Sweep */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-primary/10 to-transparent rotate-0 animate-[spin_10s_linear_infinite] z-20"></div>

          {/* SVG Vector Layer for concentric sectors, grid blueprint, and route paths */}
          <svg viewBox="0 0 600 450" className="absolute inset-0 w-full h-full z-10 select-none">
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

            {/* Pitch Target Crosshair */}
            <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(98, 223, 125, 0.4)" strokeWidth="1.5" />
            <line x1={cx - 12} y1={cy} x2={cx + 12} y2={cy} stroke="rgba(98, 223, 125, 0.4)" strokeWidth="1" />
            <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke="rgba(98, 223, 125, 0.4)" strokeWidth="1" />

            {/* 1. Curved Concentric Stand Strips (Annular Sectors) */}
            {sectors.map((sec) => {
              const isHovered = hoveredSectorId === sec.id
              const isSelected = activeSectorId === sec.id
              const riskColor = colorMap[sec.risk] || colorMap.primary

              // Generate mathematical arched path
              const pathD = makeAnnularSectorPath(cx, cy, sec.rIn, sec.rOut, sec.startAngle, sec.endAngle)

              return (
                <path
                  key={sec.id}
                  d={pathD}
                  fill={isHovered || isSelected ? riskColor.fill : 'rgba(0,0,0,0)'}
                  stroke={isSelected ? '#ffffff' : isHovered ? riskColor.text : 'rgba(255, 255, 255, 0.04)'}
                  strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1'}
                  strokeDasharray={isSelected ? 'none' : isHovered ? '3 2' : 'none'}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSectorId(sec.id)}
                  onMouseLeave={() => setHoveredSectorId(null)}
                  onClick={() => setActiveSectorId(isSelected ? null : sec.id)}
                  style={{ filter: isSelected ? 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' : 'none' }}
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
          </svg>

          {/* 3. Dynamic Interactive Map Nodes (Danger points placed exactly on target stands) */}
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

        {/* ====================================================
            FLOATING ADMINISTRATIVE TELEMETRY PANEL (BOTTOM LEFT)
            ==================================================== */}
        {activeSector && (
          <div className="absolute bottom-6 left-6 w-[280px] glass-panel rounded-lg border-outline-variant p-4 z-30 shadow-2xl animate-[cardEnter_0.3s_ease-out] bg-[#07111F]/90 backdrop-blur-md">
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
                className="text-on-surface-variant hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Core Stats details */}
            <div className="flex flex-col gap-2.5">
              {/* Stat 1: Fan count */}
              <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded px-2 py-1.5 font-mono">
                <span className="text-[9px] text-on-surface-variant uppercase font-label-caps">LIVE POPULATION</span>
                <span className="text-xs font-bold text-white">
                  {activeSector.fans.toLocaleString()} pax
                </span>
              </div>

              {/* Stat 2: Density Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-on-surface-variant uppercase font-label-caps">SECTOR DENSITY</span>
                  <span className={`font-bold ${colorMap[activeSector.risk]?.text || 'text-primary'}`}>
                    {activeSector.density}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
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
                  <span className="text-[8px] text-on-surface-variant font-label-caps">STEWARDS</span>
                  <span className="text-xs font-bold text-white font-mono">{activeSector.staff} active</span>
                </div>
                <div className="flex flex-col bg-white/5 border border-white/5 rounded p-1.5 text-center">
                  <span className="text-[8px] text-on-surface-variant font-label-caps">RISK RATING</span>
                  <span className={`text-xs font-bold font-mono uppercase ${colorMap[activeSector.risk]?.text || 'text-primary'}`}>
                    {activeSector.risk === 'error' ? 'Critical' : activeSector.risk === 'tertiary' ? 'Elevated' : 'Safe'}
                  </span>
                </div>
              </div>

              {/* Log commentary details */}
              <p className="text-[10px] text-on-surface-variant italic leading-normal border-t border-white/5 pt-2">
                "{activeSector.details}"
              </p>

              {/* Admin dispatch actions */}
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-2">
                <button 
                  onClick={() => triggerLocalDispatch()}
                  className="w-full glass-panel py-1.5 rounded text-[10px] text-primary hover:text-white border-primary/20 hover:border-primary/50 transition-all font-status-badge cursor-pointer uppercase flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs">local_police</span>
                  {localDispatchStatus || "Deploy Responder Group"}
                </button>
              </div>
            </div>
          </div>
        )}

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
