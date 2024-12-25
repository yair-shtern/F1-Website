/**
 * Constants for application routes
 */
const ROUTE_CONSTANTS = {
    PUBLIC: {
      HOME: '/',
      LOGIN: '/login',
      REGISTER: '/register',
      ABOUT: '/about'
    },
    
    DRIVERS: {
      BASE: '/drivers',
      DETAILS: '/drivers/:driverId',
      STANDINGS: '/drivers/standings'
    },
    
    RACES: {
      BASE: '/races',
      SCHEDULE: '/races/schedule',
      RESULTS: '/races/results',
      DETAILS: '/races/:raceId'
    },
    
    TEAMS: {
      BASE: '/teams',
      STANDINGS: '/teams/standings',
      DETAILS: '/teams/:teamId'
    },
    
    PROFILE: {
      BASE: '/profile',
      SETTINGS: '/profile/settings'
    },
    
    ADMIN: {
      DASHBOARD: '/admin',
      USERS: '/admin/users',
      CONTENT_MANAGEMENT: '/admin/content'
    }
  }
  
  export default ROUTE_CONSTANTS