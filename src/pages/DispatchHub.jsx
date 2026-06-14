import React, { useState, useEffect } from 'react'
import AnalyticsSuite from '../components/AnalyticsSuite'

function DispatchHub() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('/api/dispatch-hub-data')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <h1>Dispatch Hub</h1>
      <AnalyticsSuite loading={loading} error={error} />
      {/* Render data or error messages here as needed */}
    </div>
  )
}

export default DispatchHub
