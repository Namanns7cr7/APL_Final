import React from 'react'

export default function AnalyticsSuite({ analytics }) {
  if (!analytics) return null

  const { flowVelocity = [], gateWaitTimes = [] } = analytics

  // ============================================
  // CHART 1: FLOW VELOCITY SPLINE CHART (SVG)
  // ============================================
  // Coordinate calculations for flow velocity line chart
  const width = 500
  const height = 180
  const padding = 35

  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Find max value in entry or exit for scaling
  const maxVal = Math.max(...flowVelocity.map(d => Math.max(d.entry, d.exit)), 500)

  // Map entry data coordinates
  const entryPoints = flowVelocity.map((d, i) => {
    const x = padding + (i / (flowVelocity.length - 1)) * chartWidth
    const y = padding + chartHeight - (d.entry / maxVal) * chartHeight
    return { x, y }
  })

  // Map exit data coordinates
  const exitPoints = flowVelocity.map((d, i) => {
    const x = padding + (i / (flowVelocity.length - 1)) * chartWidth
    const y = padding + chartHeight - (d.exit / maxVal) * chartHeight
    return { x, y }
  })

  // Helper to construct a smooth SVG Bezier path from coordinate list
  const getBezierPath = (points) => {
    if (points.length === 0) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const cpX1 = p0.x + (p1.x - p0.x) / 2
      const cpY1 = p0.y
      const cpX2 = p0.x + (p1.x - p0.x) / 2
      const cpY2 = p1.y
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
    }
    return d
  }

  // Generate paths
  const entryPath = getBezierPath(entryPoints)
  const exitPath = getBezierPath(exitPoints)

  // Area path helpers for gradients
  const entryAreaPath = entryPath ? `${entryPath} L ${entryPoints[entryPoints.length - 1].x} ${height - padding} L ${entryPoints[0].x} ${height - padding} Z` : ''
  const exitAreaPath = exitPath ? `${exitPath} L ${exitPoints[exitPoints.length - 1].x} ${height - padding} L ${exitPoints[0].x} ${height - padding} Z` : ''

  // ============================================
  // CHART 2: GATE WAIT TIMES BAR CHART (SVG)
  // ============================================
  const barWidth = 480
  const barHeight = 180
  const barPadding = 40
  const barChartWidth = barWidth - barPadding * 2
  const barChartHeight = barHeight - barPadding * 2

  const maxWait = Math.max(...gateWaitTimes.map(g => g.wait), 30)

  return (
    <div className="glass-panel rounded-xl flex flex-col border-outline-variant p-6 animate-up delay-300">
      {/* Panel Header */}
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            monitoring
          </span>
          <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">GEMINI LIVE DATA ANALYTICS</h2>
        </div>
        <span className="font-status-badge text-[9px] text-on-surface-variant flex items-center gap-1.5 bg-surface-container-low/50 px-3 py-1 rounded-full border border-white/5 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          REALTIME DATASTREAM
        </span>
      </div>

      {/* Grid containing the two SVG graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Graph 1: Flow Velocity */}
        <div className="flex flex-col gap-2 bg-[#050e1c]/40 rounded border border-white/5 p-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase font-mono">FLOW RATE VELOCITY (PAX/MIN)</span>
            <div className="flex gap-3 text-[9px] font-mono">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(98,223,125,0.7)]"></span> ENTRY
              </span>
              <span className="flex items-center gap-1 text-secondary">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(157,223,46,0.7)]"></span> EXIT
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-[5/2] sm:aspect-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
              {/* Gradients */}
              <defs>
                <linearGradient id="entryGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#62df7d" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#62df7d" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="exitGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ddf2e" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#9ddf2e" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding + ratio * chartHeight
                return (
                  <line 
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                )
              })}

              {/* Y Axis Labels */}
              <text x={padding - 5} y={padding + 4} fill="rgba(255, 255, 255, 0.3)" fontSize="8" fontFamily="monospace" textAnchor="end">
                {Math.round(maxVal)}
              </text>
              <text x={padding - 5} y={padding + chartHeight / 2 + 4} fill="rgba(255, 255, 255, 0.3)" fontSize="8" fontFamily="monospace" textAnchor="end">
                {Math.round(maxVal / 2)}
              </text>
              <text x={padding - 5} y={padding + chartHeight + 4} fill="rgba(255, 255, 255, 0.3)" fontSize="8" fontFamily="monospace" textAnchor="end">
                0
              </text>

              {/* Area fills */}
              {entryAreaPath && <path d={entryAreaPath} fill="url(#entryGlow)" />}
              {exitAreaPath && <path d={exitAreaPath} fill="url(#exitGlow)" />}

              {/* Line paths */}
              {entryPath && (
                <path 
                  d={entryPath} 
                  fill="none" 
                  stroke="#62df7d" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  className="drop-shadow-[0_0_4px_rgba(98,223,125,0.4)]"
                />
              )}
              {exitPath && (
                <path 
                  d={exitPath} 
                  fill="none" 
                  stroke="#9ddf2e" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  className="drop-shadow-[0_0_4px_rgba(157,223,46,0.4)]"
                />
              )}

              {/* Data points */}
              {entryPoints.map((p, idx) => (
                <circle 
                  key={`en-${idx}`} 
                  cx={p.x} 
                  cy={p.y} 
                  r="3.5" 
                  fill="#0a1422" 
                  stroke="#62df7d" 
                  strokeWidth="1.5"
                  className="transition-all hover:scale-150 duration-200 cursor-pointer"
                />
              ))}

              {exitPoints.map((p, idx) => (
                <circle 
                  key={`ex-${idx}`} 
                  cx={p.x} 
                  cy={p.y} 
                  r="3.5" 
                  fill="#0a1422" 
                  stroke="#9ddf2e" 
                  strokeWidth="1.5"
                  className="transition-all hover:scale-150 duration-200 cursor-pointer"
                />
              ))}

              {/* X Axis Labels */}
              {flowVelocity.map((d, idx) => {
                const x = padding + (idx / (flowVelocity.length - 1)) * chartWidth
                return (
                  <text 
                    key={idx} 
                    x={x} 
                    y={height - padding + 15} 
                    fill="rgba(255, 255, 255, 0.4)" 
                    fontSize="8" 
                    fontFamily="monospace" 
                    textAnchor="middle"
                  >
                    {d.time}
                  </text>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Graph 2: Gate delays */}
        <div className="flex flex-col gap-2 bg-[#050e1c]/40 rounded border border-white/5 p-4 relative overflow-hidden">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase mb-2 font-mono">GATE SCANNER WAIT TIMES (MINUTES)</span>
          
          <div className="relative w-full aspect-[5/2] sm:aspect-auto">
            <svg viewBox={`0 0 ${barWidth} ${barHeight}`} className="w-full h-full">
              {/* Grid Lines for wait scale */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const x = barPadding + ratio * barChartWidth
                return (
                  <g key={idx}>
                    <line 
                      x1={x}
                      y1={barPadding}
                      x2={x}
                      y2={barHeight - barPadding}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text 
                      x={x} 
                      y={barHeight - barPadding + 14} 
                      fill="rgba(255, 255, 255, 0.3)" 
                      fontSize="8" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                    >
                      {Math.round(ratio * maxWait)}m
                    </text>
                  </g>
                )
              })}

              {/* Render Bars */}
              {gateWaitTimes.map((gateData, idx) => {
                const ySpacing = barChartHeight / gateWaitTimes.length
                const y = barPadding + idx * ySpacing + ySpacing * 0.2
                const widthOfBar = (gateData.wait / maxWait) * barChartWidth
                const heightOfBar = ySpacing * 0.6

                // Determine bar color based on duration severity
                const isCritical = gateData.wait >= 35
                const isWarning = gateData.wait >= 20 && gateData.wait < 35
                const colorHex = isCritical ? "#ffb4ab" : isWarning ? "#ffb95f" : "#62df7d"
                const glowShadow = isCritical ? "rgba(255, 180, 171, 0.3)" : isWarning ? "rgba(255, 185, 95, 0.3)" : "rgba(98, 223, 125, 0.3)"

                return (
                  <g key={idx}>
                    {/* Gate Name */}
                    <text 
                      x={barPadding - 8} 
                      y={y + heightOfBar / 2 + 3} 
                      fill="white" 
                      fontSize="9" 
                      fontFamily="monospace" 
                      fontWeight="bold"
                      textAnchor="end"
                    >
                      {gateData.gate}
                    </text>

                    {/* Bar Background Track */}
                    <rect 
                      x={barPadding}
                      y={y}
                      width={barChartWidth}
                      height={heightOfBar}
                      fill="rgba(255, 255, 255, 0.02)"
                      rx="3"
                    />

                    {/* Colored Capacity Fill */}
                    <rect 
                      x={barPadding}
                      y={y}
                      width={Math.max(widthOfBar, 4)}
                      height={heightOfBar}
                      fill={colorHex}
                      rx="3"
                      style={{ filter: `drop-shadow(0 0 3px ${glowShadow})` }}
                      className="transition-all duration-500 ease-out"
                    />

                    {/* Value Badge */}
                    <text 
                      x={barPadding + widthOfBar + 8} 
                      y={y + heightOfBar / 2 + 3} 
                      fill={colorHex} 
                      fontSize="9" 
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {gateData.wait} min
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
