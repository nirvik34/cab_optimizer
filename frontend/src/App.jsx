import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MapView from './components/MapView'
import { useRideOptimizer } from './hooks/useRideOptimizer'
import { MAP_CENTER, MAP_ZOOM } from './constants'

export default function App() {
  // points: { user, driver, destination }
  const [points, setPoints] = useState({})
  const [clickStep, setClickStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mapRef = useRef(null)
  const { result, loading, error, optimize, reset } = useRideOptimizer()

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Step 0: click map → USER location
  // Step 1: click map → DRIVER location
  // Step 2: click map → DESTINATION
  const handleMapClick = (latlng) => {
    if (clickStep === 0) {
      setPoints({ user: { lat: latlng.lat, lng: latlng.lng } })
      setClickStep(1)
    } else if (clickStep === 1) {
      setPoints((p) => ({ ...p, driver: { lat: latlng.lat, lng: latlng.lng } }))
      setClickStep(2)
    } else if (clickStep === 2) {
      setPoints((p) => ({ ...p, destination: { lat: latlng.lat, lng: latlng.lng } }))
      setClickStep(3)
    }
  }

  const handleOptimize = () => {
    if (clickStep < 3) return
    optimize({
      user: points.user,
      driver: points.driver,
      destination: points.destination,
    })
  }

  const handleReset = () => {
    setPoints({})
    setClickStep(0)
    reset()
    if (mapRef.current) {
      mapRef.current.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 1.5 })
    }
  }

  return (
    <div className="flex h-screen" style={{ background: '#f0fdf4' }}>
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:block">
        <Sidebar
          clickStep={clickStep}
          result={result}
          loading={loading}
          error={error}
          onOptimize={handleOptimize}
          onReset={handleReset}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div
            className="fixed inset-y-0 left-0 z-50 md:hidden"
            style={{ width: '300px', maxWidth: '85vw' }}
          >
            <Sidebar
              clickStep={clickStep}
              result={result}
              loading={loading}
              error={error}
              onOptimize={handleOptimize}
              onReset={handleReset}
              onClose={() => setSidebarOpen(false)}
              isMobile
            />
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className="relative z-10">
          <TopBar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        </div>
        <div className="flex-1 relative z-0">
          <MapView
            points={points}
            clickStep={clickStep}
            onMapClick={handleMapClick}
            result={result}
            mapRef={mapRef}
          />
        </div>

        {/* Mobile bottom bar — shows step status + buttons */}
        <div
          className="md:hidden flex items-center gap-2 px-3 py-2 relative z-10"
          style={{
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          {/* Step indicator pills */}
          <div className="flex gap-1 flex-1 min-w-0">
            {['U', 'D', 'X'].map((label, i) => (
              <span
                key={i}
                className="font-mono font-bold"
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: clickStep > i ? '#dcfce7' : clickStep === i ? '#fef9c3' : '#f1f5f9',
                  color: clickStep > i ? '#16a34a' : clickStep === i ? '#d97706' : '#94a3b8',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Optimize button */}
          <button
            onClick={handleOptimize}
            disabled={clickStep < 3 || loading}
            className="font-mono font-bold uppercase tracking-wide"
            style={{
              fontSize: '12px',
              color: '#fff',
              background: clickStep < 3 || loading ? '#22c55e66' : '#22c55e',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 14px',
              opacity: clickStep < 3 || loading ? 0.5 : 1,
              cursor: clickStep < 3 || loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'ROUTING...' : 'OPTIMIZE'}
          </button>

          {/* Reset */}
          <span
            onClick={handleReset}
            className="font-mono uppercase tracking-wide cursor-pointer"
            style={{ fontSize: '11px', color: '#94a3b8' }}
          >
            ↺
          </span>
        </div>
      </main>
    </div>
  )
}
