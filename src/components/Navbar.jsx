import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { name: 'Live Intelligence',  path: '/',         exact: true,  icon: 'monitoring' },
    { name: 'Command Center',     path: '/command',  exact: false, icon: 'shield' },
    { name: 'Volunteer Grid',     path: '/dispatch', exact: false, icon: 'groups' },
    { name: 'Smart Routing',      path: '/routing',  exact: false, icon: 'route' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-5 lg:px-8"
      style={{ background: 'rgba(3,8,15,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Brand */}
      <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border"
          style={{ background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.2)' }}>
          <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-[13px] tracking-wider text-white uppercase leading-none">StadiumPulse</span>
          <span className="text-[7.5px] text-white/30 font-mono uppercase tracking-widest font-bold leading-none mt-0.5">AI Stadium Intelligence</span>
        </div>
      </button>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-lg text-[9px] font-mono font-black tracking-widest transition-all duration-250 uppercase flex items-center gap-1.5 ${
                isActive
                  ? 'text-emerald-400 border'
                  : 'border border-transparent text-white/35 hover:text-white/70 hover:bg-white/[0.03]'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.2)' } : {}}
          >
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{ background: 'rgba(98,223,125,0.04)', borderColor: 'rgba(98,223,125,0.15)' }}>
          <span className="material-symbols-outlined text-emerald-400 text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
          <span className="font-mono text-[8px] text-emerald-400 font-black uppercase tracking-widest">Admin Mode</span>
        </div>

        {/* Launch CTA */}
        <button
          onClick={() => navigate('/command')}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer border"
          style={{ background: 'rgba(98,223,125,0.08)', borderColor: 'rgba(98,223,125,0.2)', color: '#62df7d' }}
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          <span className="font-mono text-[9px] font-black uppercase tracking-widest">Command</span>
        </button>

        {/* Status */}
        <div className="hidden lg:flex items-center gap-2 bg-[#040A12]/80 border border-white/6 px-3 py-1.5 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="font-mono text-[8px] text-emerald-400 tracking-widest uppercase font-black">Optimal</span>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/8 bg-white/[0.03] cursor-pointer">
          <span className="material-symbols-outlined text-white/60 text-lg">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden flex flex-col p-4 gap-1 border-b"
          style={{ background: 'rgba(3,8,15,0.97)', backdropFilter: 'blur(24px)', borderColor: 'rgba(255,255,255,0.06)' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.exact}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-2.5 transition-all ${
                  isActive ? 'text-emerald-400 bg-emerald-400/[0.06] border border-emerald-400/20' : 'text-white/40 border border-transparent hover:text-white/70 hover:bg-white/[0.03]'
                }`
              }>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
          <div className="flex items-center gap-2 mt-2 px-4 py-2">
            <span className="material-symbols-outlined text-emerald-400 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            <span className="font-mono text-[8px] text-emerald-400/60 font-black uppercase tracking-widest">Admin Mode · APL Season 3</span>
          </div>
        </div>
      )}
    </header>
  )
}
