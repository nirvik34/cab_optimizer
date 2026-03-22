import { STEP_LABELS } from '../constants'

export default function Sidebar({
  clickStep,
  result,
  loading,
  error,
  onOptimize,
  onReset,
  onClose,
  isMobile,
}) {
  const totalKm = result ? (result.distance_meters / 1000).toFixed(1) : null
  const walkM = result ? result.user_walk_meters : null
  const driverKm = result ? (result.driver_dist_meters / 1000).toFixed(1) : null
  const postKm = result ? (result.post_pickup_meters / 1000).toFixed(1) : null

  return (
    <aside
      className="flex flex-col no-scrollbar overflow-y-auto"
      style={{
        width: isMobile ? '100%' : '300px',
        minWidth: isMobile ? undefined : '300px',
        height: '100vh',
        background: '#ffffff',
        borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
      }}
    >
      {/* ── 1. HEADER ── */}
      <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <div
            className="font-mono font-bold tracking-widest"
            style={{ fontSize: '20px', color: '#22c55e' }}
          >
            SWIFTCAB
          </div>
          <div
            className="font-mono uppercase tracking-widest mt-1"
            style={{ fontSize: '12px', color: '#94a3b8' }}
          >
            TERMINAL OPS v1.0
          </div>
        </div>
        {/* Close button — mobile only */}
        {isMobile && (
          <button
            onClick={onClose}
            className="cursor-pointer"
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              color: '#64748b',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              close
            </span>
          </button>
        )}
      </div>

      {/* ── 2. NAV ── */}
      <div className="px-4 py-3">
        <div
          className="flex items-center gap-3 px-4 py-3 font-mono uppercase tracking-widest"
          style={{
            fontSize: '14px',
            color: '#22c55e',
            background: '#f0fdf4',
            borderLeft: '3px solid #22c55e',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#22c55e' }}>
            point_scan
          </span>
          OPTIMIZE
        </div>
      </div>

      {/* ── 3. DIVIDER ── */}
      <div className="mx-4" style={{ height: '1px', background: '#e2e8f0' }} />

      {/* ── 4. STEP TRACKER ── */}
      <div className="px-6 py-4">
        <div
          className="font-mono uppercase tracking-widest mb-3"
          style={{ fontSize: '11px', color: '#94a3b8' }}
        >
          INPUT SEQUENCE
        </div>

        {STEP_LABELS.map((label, i) => {
          const stepNum = String(i + 1).padStart(2, '0')
          let status, statusColor
          if (clickStep > i) {
            status = 'LOCKED'
            statusColor = '#22c55e'
          } else if (clickStep === i) {
            status = 'PENDING'
            statusColor = '#f59e0b'
          } else {
            status = '—'
            statusColor = '#cbd5e1'
          }

          return (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="flex gap-3 items-center">
                <span className="font-mono" style={{ fontSize: '13px', color: '#22c55e' }}>
                  {stepNum}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: '13px', color: '#64748b' }}
                >
                  {label}
                </span>
              </div>
              <span
                className={`font-mono ${status === 'PENDING' ? 'animate-pulse' : ''}`}
                style={{ fontSize: '12px', color: statusColor }}
              >
                {status}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── 5. DIVIDER ── */}
      <div className="mx-4" style={{ height: '1px', background: '#e2e8f0' }} />

      {/* ── 6. RESULT PANEL ── */}
      {result && (
        <div className="px-4 py-4">
          <div
            className="px-4 py-4"
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
            }}
          >
            <div
              className="font-mono uppercase tracking-widest mb-2"
              style={{ fontSize: '11px', color: '#16a34a' }}
            >
              ROUTE FOUND
            </div>

            {/* Chosen pickup name */}
            <div className="font-mono mb-3" style={{ fontSize: '14px', color: '#0f172a' }}>
              <span className="font-bold">{result.chosen_pickup.name}</span>
            </div>

            {/* Distance breakdown */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono" style={{ fontSize: '12px' }}>
                <span style={{ color: '#22c55e' }}> Walk</span>
                <span style={{ color: '#0f172a' }}>{walkM} m</span>
              </div>
              <div className="flex justify-between font-mono" style={{ fontSize: '12px' }}>
                <span style={{ color: '#3b82f6' }}> Driver→Pickup</span>
                <span style={{ color: '#0f172a' }}>{driverKm} km</span>
              </div>
              <div className="flex justify-between font-mono" style={{ fontSize: '12px' }}>
                <span style={{ color: '#8b5cf6' }}> Pickup→Dest</span>
                <span style={{ color: '#0f172a' }}>{postKm} km</span>
              </div>
            </div>

            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #bbf7d0' }}>
              <div className="font-mono font-bold" style={{ fontSize: '22px', color: '#0f172a' }}>
                {totalKm} km
              </div>
              <div className="font-mono" style={{ fontSize: '10px', color: '#94a3b8' }}>
                TOTAL DRIVING DISTANCE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. DIVIDER ── */}
      <div className="mx-4" style={{ height: '1px', background: '#e2e8f0' }} />

      {/* ── Error ── */}
      {error && (
        <div
          className="mx-4 mt-3 px-3 py-2 font-mono"
          style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', borderRadius: '6px' }}
        >
          ERR: {error}
        </div>
      )}

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── 8. OPTIMIZE BUTTON ── */}
      <div className="px-4 pb-4">
        <button
          onClick={onOptimize}
          disabled={clickStep < 3 || loading}
          className="w-full font-mono font-bold uppercase tracking-widest cursor-pointer"
          style={{
            fontSize: '14px',
            color: '#ffffff',
            background: clickStep < 3 || loading ? '#22c55e66' : '#22c55e',
            borderRadius: '8px',
            padding: '14px',
            border: 'none',
            opacity: clickStep < 3 || loading ? 0.4 : 1,
            cursor: clickStep < 3 || loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            if (clickStep >= 3 && !loading) e.target.style.background = '#16a34a'
          }}
          onMouseLeave={(e) => {
            if (clickStep >= 3 && !loading) e.target.style.background = '#22c55e'
          }}
        >
          {loading ? 'ROUTING...' : 'EXECUTE OPTIMIZE'}
        </button>
      </div>

      {/* ── 9. RESET ── */}
      <div className="px-6 pb-4 text-center">
        <span
          onClick={onReset}
          className="font-mono uppercase tracking-widest cursor-pointer"
          style={{ fontSize: '12px', color: '#94a3b8', transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.target.style.color = '#64748b')}
          onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
        >
          RESET
        </span>
      </div>

      {/* ── 10. FOOTER ── */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
        <div className="font-mono uppercase" style={{ fontSize: '11px', color: '#94a3b8' }}>
          SERVER_STATUS
        </div>
        <div className="font-mono uppercase" style={{ fontSize: '11px', color: '#22c55e' }}>
          CONNECTED
        </div>
      </div>
    </aside>
  )
}
