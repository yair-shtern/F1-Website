/**
 * Constants for API endpoints and configuration
 */
const API_CONSTANTS = {
    BASE_URLS: {
      OPENF1: import.meta.env.VITE_OPENF1_API_BASE_URL,
      ERGAST: import.meta.env.VITE_ERGAST_API_BASE_URL
    },
    
    ENDPOINTS: {
      DRIVERS: {
        LIST: '/drivers',
        DETAILS: '/drivers/{driverId}',
        STANDINGS: '/drivers/standings'
      },
      RACES: {
        SCHEDULE: '/races/schedule',
        RESULTS: '/races/results',
        LIVE_TIMING: '/races/{raceId}/live-timing'
      },
      TEAMS: {
        LIST: '/teams',
        STANDINGS: '/teams/standings',
        PERFORMANCE: '/teams/{teamId}/performance'
      },
      AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VALIDATE_TOKEN: '/auth/validate-token'
      }
    },
  
    REQUEST_TIMEOUTS: {
      SHORT: 5000,
      STANDARD: 10000,
      LONG: 30000
    },
  
    CACHE_DURATIONS: {
      DRIVER_LIST: 1000 * 60 * 60, // 1 hour
      RACE_SCHEDULE: 1000 * 60 * 24, // 24 hours
      TEAM_STANDINGS: 1000 * 60 * 12 // 12 hours
    }
  }
  
  export default API_CONSTANTS