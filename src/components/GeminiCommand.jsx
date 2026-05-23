import React from 'react'

export default function GeminiCommand({
  alertTitle = 'TOP RISK DETECTED',
  alertDesc = 'Gate A Congestion approaching critical mass. Current queue length exceeds safe operational limits.',
  recTitle = 'AI RECOMMENDATION',
  recDesc = 'Reroute incoming Metro pedestrian traffic to Gate C. Deploy 6 standby volunteers to assist redirection.',
  recConfidence = '94%',
  opsTasks = [],
  onGeneratePlan = () => {}
}) {
  return (
    <div className="lg:col-span-4 glass-panel rounded-xl flex flex-col h-[600px] border-outline-variant sticky top-24 animate-up delay-300">
      {/* Panel Header */}
      <div className="flex justify-between items-center px-panel-padding py-3 border-b border-white/10 bg-surface-container-low/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            smart_toy
          </span>
          <h2 className="font-label-caps text-xs text-primary tracking-widest uppercase">GEMINI COMMAND AGENT</h2>
        </div>
      </div>

      {/* Panel Content */}
      <div className="p-panel-padding flex flex-col gap-5 flex-grow overflow-y-auto">
        {/* Alert Box */}
        <div className="bg-error-container/10 border border-error/30 rounded p-4 relative overflow-hidden transition-colors duration-300">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-error shadow-[0_0_8px_rgba(255,180,171,0.8)]"></div>
          <div className="flex items-center gap-2 mb-2 text-error">
            <span className="material-symbols-outlined text-sm">error</span>
            <span className="font-label-caps text-[10px] tracking-widest uppercase">{alertTitle}</span>
          </div>
          <p 
            className="font-body-md text-xs text-on-surface leading-relaxed transition-all duration-300"
            dangerouslySetInnerHTML={{ __html: alertDesc }}
          />
        </div>

        {/* Recommendation Box */}
        <div className="glass-panel interactive rounded p-4 relative overflow-hidden border-primary/20 transition-colors duration-300">
          {/* Left accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary shadow-[0_0_8px_rgba(98,223,125,0.8)]"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
            <span className="font-label-caps text-[10px] text-primary tracking-wider uppercase">{recTitle}</span>
          </div>
          <p 
            className="font-body-md text-xs text-on-surface mb-3 leading-relaxed transition-all duration-300"
            dangerouslySetInnerHTML={{ __html: recDesc }}
          />
          <div className="flex justify-between items-center border-t border-white/10 pt-2">
            <span className="font-label-caps text-[9px] text-on-surface-variant tracking-wider uppercase">CONFIDENCE SCORE</span>
            <span className="font-metric-xl text-lg text-primary font-mono transition-all duration-300">{recConfidence}</span>
          </div>
        </div>

        {/* Operations Updates (Dynamic block for scenario tasks) */}
        {opsTasks && opsTasks.length > 0 && (
          <div className="glass-panel rounded p-4 relative overflow-hidden border-tertiary/20 bg-surface-container-low/30 animate-[cardEnter_0.3s_ease-out]">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-tertiary text-sm">campaign</span>
              <span className="font-label-caps text-[10px] text-tertiary tracking-wider uppercase">DISPATCH TASKS</span>
            </div>
            <ul className="font-body-md text-xs text-on-surface-variant list-disc pl-4 space-y-1">
              {opsTasks.map((task, idx) => (
                <li key={idx} className="leading-relaxed">{task}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <button 
            onClick={onGeneratePlan}
            className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-label-caps text-xs tracking-wider px-4 py-3 rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(98,223,125,0.2)] hover:shadow-[0_0_25px_rgba(98,223,125,0.4)] hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">magic_button</span>
            GENERATE AI PLAN
          </button>
        </div>
      </div>
    </div>
  )
}
