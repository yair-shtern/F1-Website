import axios from 'axios'

const BASE_URL = import.meta.env.VITE_ERGAST_API_BASE_URL

class ErgastService {
  static async getTeamStandings(year, round) {
    try {
      const response = await axios.get(`${BASE_URL}/${year}/${round}/constructorStandings`)
      return response.data
    } catch (error) {
      console.error('Error fetching team standings:', error)
      throw error
    }
  }

  static async getDetailedTeamPerformance(teamId) {
    try {
      const response = await axios.get(`${BASE_URL}/team-performance/${teamId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching team performance:', error)
      throw error
    }
  }
  
  static async getDrivers(year) {
    try {
      const response = await axios.get(`${BASE_URL}/${year}/drivers`)
      return response.data
    } catch (error) {
      console.error('Error fetching drivers:', error)
      throw error
    }
  }

  static async getRaceSchedule(year) {
    try {
      const response = await axios.get(`${BASE_URL}/${year}.json`)
      return response.data.MRData.RaceTable.Races
    } catch (error) {
      console.error('Error fetching race schedule:', error)
      throw error
    }
  }

  static async getRaceResults(year, round) {
    try {
      const response = await axios.get(`${BASE_URL}/${year}/${round}/results.json`)
      return response.data.MRData.RaceTable.Races[0]
    } catch (error) {
      console.error('Error fetching race results:', error)
      throw error
    }
  }

  static async getLiveTiming(raceId) {
    try {
      const response = await axios.get(`${BASE_URL}/live-timing/${raceId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching live timing:', error)
      throw error
    }
  }
}

export default ErgastService