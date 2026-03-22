import { useState } from 'react'
import { API_URL } from '../constants'

export function useRideOptimizer() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const optimize = async (points) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/book-ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: points.user,
          driver: points.driver,
          destination: points.destination,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || `HTTP ${res.status}`)
      }
      setResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { result, loading, error, optimize, reset }
}
