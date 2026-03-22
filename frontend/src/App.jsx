import { useState, useRef } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MapView from './components/MapView'
import { useRideOptimizer } from './hooks/useRideOptimizer'
import { MAP_CENTER, MAP_ZOOM } from './constants'

export default function App() {
  // points: { user, driver, destination }
  const [points, setPoints] = useState({})
  const [clickStep, setClickStep] = useState(0)
  const mapRef = useRef(null)
  const { result, loading, error, optimize, reset } = useRideOptimizer()

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
      <Sidebar
        clickStep={clickStep}
        result={result}
        loading={loading}
        error={error}
        onOptimize={handleOptimize}
        onReset={handleReset}
      />

      <main className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 relative">
          <MapView
            points={points}
            clickStep={clickStep}
            onMapClick={handleMapClick}
            result={result}
            mapRef={mapRef}
          />
        </div>
      </main>
    </div>
  )
}
