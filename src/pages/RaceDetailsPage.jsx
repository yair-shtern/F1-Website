import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import OpenF1Service from '../services/openF1Service'
import LiveTiming from '../components/LiveTiming'
import DataFormatter from '../utils/dataFormatter'

const RaceDetailsPage = () => {
  const { raceId } = useParams()
  const [raceDetails, setRaceDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRaceDetails = async () => {
      try {
        const details = await OpenF1Service.getRaceDetails(raceId)
        setRaceDetails(details)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchRaceDetails()
  }, [raceId])

  if (loading) return <div>Loading race details...</div>
  if (error) return <div>Error loading race details</div>
  if (!raceDetails) return <div>No race details found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-f1-red mb-4">
          {raceDetails.raceName}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-f1-blue mb-3">Race Information</h2>
            <div className="space-y-2">
              <p><strong>Location:</strong> {raceDetails.location}, {raceDetails.country}</p>
              <p><strong>Date:</strong> {raceDetails.date}</p>
              <p><strong>Circuit:</strong> {raceDetails.circuitName}</p>
              <p><strong>Lap Length:</strong> {DataFormatter.formatLargeNumber(raceDetails.circuitLength)} km</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-f1-blue mb-3">Race Conditions</h2>
            <div className="space-y-2">
              <p><strong>Temperature:</strong> {raceDetails.temperature}°C</p>
              <p><strong>Track Condition:</strong> {raceDetails.trackCondition}</p>
              <p><strong>Weather:</strong> {raceDetails.weather}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <LiveTiming raceId={raceId} />
        </div>
      </div>
    </div>
  )
}

export default RaceDetailsPage