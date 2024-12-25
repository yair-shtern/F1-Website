import React, { useState, useEffect } from 'react'
import OpenF1Service from '../services/openF1Service'
import DataFormatter from '../utils/dataFormatter'

const LiveTiming = ({ raceId }) => {
  const [liveTiming, setLiveTiming] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLiveTiming = async () => {
      try {
        const timingData = await OpenF1Service.getLiveTiming(raceId)
        setLiveTiming(timingData)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    // Initial fetch
    fetchLiveTiming()

    // Set up polling for live updates
    const intervalId = setInterval(fetchLiveTiming, 30000) // Update every 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [raceId])

  if (loading) return <div>Loading live timing...</div>
  if (error) return <div>Error loading live timing</div>

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-f1-blue mb-4">Live Race Timing</h2>
      <table className="w-full">
        <thead className="bg-f1-red text-white">
          <tr>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Driver</th>
            <th className="p-3 text-right">Last Lap</th>
            <th className="p-3 text-right">Gap</th>
            <th className="p-3 text-right">Top Speed</th>
          </tr>
        </thead>
        <tbody>
          {liveTiming.map((driver, index) => (
            <tr 
              key={driver.driverId} 
              className="border-b last:border-b-0 hover:bg-gray-100"
            >
              <td className="p-3 font-bold">{index + 1}</td>
              <td className="p-3">{driver.driverName}</td>
              <td className="p-3 text-right">
                {DataFormatter.formatLapTime(driver.lastLapTime)}
              </td>
              <td className="p-3 text-right">{driver.gap || '+0.000'}</td>
              <td className="p-3 text-right">
                {DataFormatter.kphToMph(driver.topSpeed)} mph
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LiveTiming