import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MAP_CENTER, MAP_ZOOM } from '../constants'

/* ── Teardrop pin factory ── */
const makePin = (color, label) =>
  L.divIcon({
    className: '',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    html: `
      <div style="position:relative;width:28px;height:40px">
        <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26S28 23.333 28 14C28 6.268 21.732 0 14 0z"
            fill="${color}" />
          <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
        </svg>
        <div style="
          position:absolute;
          top:-22px;
          left:50%;
          transform:translateX(-50%);
          white-space:nowrap;
          background:#0f172a;
          color:white;
          font-family:'JetBrains Mono',monospace;
          font-size:9px;
          text-transform:uppercase;
          padding:2px 6px;
          border-radius:3px;
          letter-spacing:0.05em;
        ">${label}</div>
      </div>
    `,
  })

/* ── Click handler (for USER / DRIVER / DESTINATION placement) ── */
function ClickHandler({ onMapClick, clickStep }) {
  useMapEvents({
    click: (e) => {
      if (clickStep <= 2) onMapClick(e.latlng)
    },
  })
  return null
}

/* ── Map ref capture ── */
function MapRefSetter({ mapRef }) {
  const map = useMapEvents({})
  if (mapRef) mapRef.current = map
  return null
}

/* ── MapView ── */
export default function MapView({
  points,
  clickStep,
  onMapClick,
  result,
  mapRef,
}) {
  return (
    <div className="absolute inset-0">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={false}
        style={{ background: '#f1f5f9' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <ClickHandler onMapClick={onMapClick} clickStep={clickStep} />
        <MapRefSetter mapRef={mapRef} />

        {/* ── USER marker (blue) ── */}
        {points.user && (
          <Marker
            position={[points.user.lat, points.user.lng]}
            icon={makePin('#3b82f6', 'USER')}
            interactive={false}
          />
        )}

        {/* ── DRIVER marker (orange) ── */}
        {points.driver && (
          <Marker
            position={[points.driver.lat, points.driver.lng]}
            icon={makePin('#f59e0b', 'DRIVER')}
            interactive={false}
          />
        )}

        {/* ── DESTINATION marker (red) ── */}
        {points.destination && (
          <Marker
            position={[points.destination.lat, points.destination.lng]}
            icon={makePin('#ef4444', 'DESTINATION')}
            interactive={false}
          />
        )}

        {/* ── Chosen pickup marker (green, appears after optimize) ── */}
        {result?.chosen_pickup && (
          <Marker
            position={[result.chosen_pickup.lat, result.chosen_pickup.lng]}
            icon={makePin('#22c55e', 'PICKUP')}
            interactive={false}
          />
        )}

        {/* ── Route: User walking path (green dashed) ── */}
        {result?.user_route && (
          <Polyline
            positions={result.user_route}
            pathOptions={{
              color: '#22c55e',
              weight: 4,
              opacity: 0.85,
              dashArray: '8 6',
            }}
          />
        )}

        {/* ── Route: Driver to pickup (blue) ── */}
        {result?.driver_route && (
          <Polyline
            positions={result.driver_route}
            pathOptions={{
              color: '#3b82f6',
              weight: 5,
              opacity: 0.85,
            }}
          />
        )}

        {/* ── Route: Pickup to destination (purple) ── */}
        {result?.post_pickup_route && (
          <Polyline
            positions={result.post_pickup_route}
            pathOptions={{
              color: '#8b5cf6',
              weight: 6,
              opacity: 0.85,
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
