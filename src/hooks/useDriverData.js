import { useState, useEffect } from 'react'
import ErgastService from '../services/ergastService'
import XMLParser from '../utils/xmlParser';

const useDriverData = (driverId = null) => {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await ErgastService.getDrivers("2024")

        // Parse the XML
        const xmlDoc = XMLParser.parseXML(response);
        if (!xmlDoc) throw new Error('Failed to parse XML');

        // Extract driver data
        const fetchedDrivers = XMLParser.extractDriverData(xmlDoc);
        if (!fetchedDrivers) {
          throw new Error('Failed to parse driver data');
        }
        setDrivers(fetchedDrivers)

        if (driverId) {
          const driver = fetchedDrivers.find(d => d.permanentNumber === driverId)
          setSelectedDriver(driver || null)
        }

        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchDriverData()
  }, [driverId])

  return {
    drivers,
    selectedDriver,
    loading,
    error
  }
}

export default useDriverData