import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-surface-container-low/90 backdrop-blur-md border-t border-white/10 fixed bottom-0 left-0 right-0 flex justify-between items-center px-panel-padding h-8 z-50">
      <div className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
        © 2026 CRICKET OPS | SYSTEM OPTIMAL
      </div>
      <div className="flex gap-4">
        <a className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase" href="#logs">
          Logs
        </a>
        <a className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase" href="#protocol">
          Protocol 4.1
        </a>
        <a className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase" href="#support">
          Support
        </a>
      </div>
    </footer>
  )
}
