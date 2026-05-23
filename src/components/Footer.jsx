import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="relative z-40 border-t" style={{ background: 'rgba(3,8,15,0.95)', borderColor: 'rgba(255,255,255,0.06)' }}>
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(98,223,125,0.2), transparent)' }} />

      <div className="container mx-auto max-w-[1920px] px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center border" style={{ background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.2)' }}>
                <span className="material-symbols-outlined text-emerald-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
              </div>
              <span className="font-black text-xs tracking-wider text-white uppercase">StadiumPulse AI</span>
            </div>
            <p className="text-[9px] text-white/30 font-mono leading-relaxed max-w-xs">
              AI-powered stadium crowd intelligence platform for real-time safety, volunteer coordination, and emergency response during live cricket events.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[7.5px] font-mono font-black uppercase tracking-widest px-2 py-1 rounded-md border" style={{ borderColor: 'rgba(98,223,125,0.2)', background: 'rgba(98,223,125,0.06)', color: '#62df7d' }}>Built for APL Season 3</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-[8px] font-mono font-black uppercase tracking-widest text-white/30 mb-1">Platform</span>
            {[
              { label: 'Live Intelligence', path: '/', icon: 'monitoring' },
              { label: 'Command Center', path: '/command', icon: 'shield' },
              { label: 'Volunteer Grid', path: '/dispatch', icon: 'groups' },
              { label: 'Smart Routing', path: '/routing', icon: 'route' },
            ].map(link => (
              <button key={link.path} onClick={() => navigate(link.path)}
                className="flex items-center gap-2 text-[9px] font-mono font-bold text-white/35 hover:text-emerald-400 transition-colors cursor-pointer uppercase tracking-wider text-left">
                <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>

          {/* Col 3: Tech Stack + Status */}
          <div className="flex flex-col gap-3">
            <span className="text-[8px] font-mono font-black uppercase tracking-widest text-white/30 mb-1">Technology</span>
            <div className="flex flex-wrap gap-1.5">
              {['Gemini 2.5 Pro', 'React 19', 'Vite 8', 'TailwindCSS', 'Google Cloud'].map(tech => (
                <span key={tech} className="text-[7px] font-mono font-black uppercase tracking-wider px-2 py-1 rounded-md border border-white/8 text-white/30 bg-white/[0.02]">{tech}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg border" style={{ borderColor: 'rgba(98,223,125,0.15)', background: 'rgba(98,223,125,0.03)' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[8px] text-emerald-400 tracking-widest uppercase font-black">All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-white/5 gap-3">
          <span className="font-mono text-[8px] text-white/20 tracking-widest uppercase font-bold">
            © 2026 StadiumPulse · Agentic Premier League · All Rights Reserved
          </span>
          <span className="font-mono text-[8px] text-white/20 tracking-widest uppercase font-bold">
            Powered by Google Gemini AI · Cloud Functions · Firebase
          </span>
        </div>
      </div>
    </footer>
  )
}
