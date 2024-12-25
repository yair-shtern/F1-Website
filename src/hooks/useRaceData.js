import { useState, useEffect } from 'react'
import ErgastService from '../services/ergastService'
import XMLParser from '../utils/xmlParser'

const useRaceData = (raceId = null) => {
  const [races, setRaces] = useState([])
  const [selectedRace, setSelectedRace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        // Fetch all races
        const response = await ErgastService.getRaceSchedule("2024")

        // Parse the XML
        const xmlDoc = XMLParser.parseXML(response);
        if (!xmlDoc) throw new Error('Failed to parse XML');

        // Extract driver data
        const fetchedRaces = XMLParser.extractRaceSchedule(xmlDoc);
        if (!fetchedRaces) {
          throw new Error('Failed to parse races data');
        }

        setRaces(fetchedRaces)

        // If specific race ID is provided, find and set it
        if (raceId) {
          const race = fetchedRaces.find(r => r.id === raceId)
          setSelectedRace(race || null)
        }

        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchRaceData()
  }, [raceId])

  const getRaceResults = async (raceId) => {
    try {
      return await ErgastService.getRaceResults(raceId)
    } catch (err) {
      console.error('Failed to fetch race results:', err)
      return null
    }
  }

  return {
    races,
    selectedRace,
    loading,
    error,
    getRaceResults
  }
}

export default useRaceData