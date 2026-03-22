const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
export const API_URL = isLocal
  ? 'http://127.0.0.1:8000'
  : 'https://cab-optimizer.onrender.com'
export const MAP_CENTER = [12.8406, 80.1534]     // centered on VIT campus
export const MAP_ZOOM = 15
export const STEP_LABELS = ['PLACE USER', 'PLACE DRIVER', 'PLACE DESTINATION']
