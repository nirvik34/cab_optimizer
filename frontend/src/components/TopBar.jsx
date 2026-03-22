import { useState } from 'react'

export default function TopBar() {
  const [search, setSearch] = useState('')

  return (
    <header
      className="flex items-center justify-between px-6"
      style={{
        height: '64px',
        minHeight: '64px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {/* Left: brand */}
      <span
        className="font-mono font-bold tracking-widest"
        style={{ color: '#22c55e', fontSize: '16px' }}
      >
        SWIFTCAB
      </span>

      {/* Center: search */}
      <div className="relative" style={{ width: '400px' }}>
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
      <div style={{ width: '80px' }} />
    </header>
  )
}
