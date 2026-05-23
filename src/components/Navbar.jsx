import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const navItems = [
    { name: 'Elite Operations', path: '/' },
    { name: 'Scenario Engine', path: '/simulation' },
    { name: 'Dispatch Operations', path: '/dispatch' },
    { name: 'Dynamic Routing', path: '/routing' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-white/10 z-50 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary animate-pulse text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          sensors
        </span>
        <span className="font-display-lg text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
          StadiumPulse <span className="text-primary text-xs bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-mono">AI Command</span>
        </span>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded text-xs font-label-caps tracking-widest transition-all duration-300 ${
                isActive
                  ? 'bg-primary/10 border border-primary/40 text-primary shadow-[0_0_15px_rgba(98,223,125,0.15)]'
                  : 'border border-transparent text-on-surface-variant hover:text-white hover:bg-white/5'
              }`
            }
          >
            {item.name.toUpperCase()}
          </NavLink>
        ))}
      </nav>

      {/* Live System Indicator */}
      <div className="flex items-center gap-2 bg-surface/50 border border-white/5 px-4 py-1.5 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="font-status-badge text-[10px] text-primary tracking-widest uppercase">
          System Optimal
        </span>
      </div>
    </header>
  )
}
