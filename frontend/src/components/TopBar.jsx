import { useState } from 'react'

export default function TopBar({ onMenuToggle }) {
  const [search, setSearch] = useState('')

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6"
      style={{
        height: '56px',
        minHeight: '56px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {/* Left: hamburger (mobile) + brand */}
      <div className="flex items-center gap-3">
        {/* Hamburger — visible only on mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden cursor-pointer"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            color: '#22c55e',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            menu
          </span>
        </button>

        <span
          className="font-mono font-bold tracking-widest"
          style={{ color: '#22c55e', fontSize: '16px' }}
        >
          SWIFTCAB
        </span>
      </div>

      {/* Center: search — hidden on small screens */}
      <div className="relative hidden sm:block" style={{ width: 'clamp(200px, 30vw, 400px)' }}>
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
          style={{ fontSize: '18px', color: '#22c55e' }}
        >
          search
        </span>
        <input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full font-mono outline-none"
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px 16px 8px 40px',
            fontSize: '13px',
            color: '#0f172a',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#22c55e')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
      </div>

      {/* Right: spacer to balance layout */}
      <div className="hidden md:block" style={{ width: '80px' }} />
    </header>
  )
}
