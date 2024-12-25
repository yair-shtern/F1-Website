import { useState, useEffect } from 'react'
import ErgastService from '../services/ergastService'

const useTeamData = (teamId = null) => {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const fetchedTeams = await ErgastService.getAllTeams()
        setTeams(fetchedTeams)

        if (teamId) {
          const team = fetchedTeams.find(t => t.id === teamId)
          setSelectedTeam(team || null)
        }

        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [teamId])

  const getTeamById = (id) => {
    return teams.find(team => team.id === id)
  }

  return {
    teams,
    selectedTeam,
    loading,
    error,
    getTeamById
  }
}

export default useTeamData