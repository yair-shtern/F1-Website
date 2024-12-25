import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DriversPage from './pages/DriversPage'
import RacesPage from './pages/RacesPage'
import TeamStandingsPage from './pages/TeamStandingsPage'
import ResultsPage from './pages/ResultsPage'
import SchedulePage from './pages/SchedulePage'
import RaceResultsPage from './pages/RaceResultPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/races" element={<RacesPage />} />
        <Route path="/results" element={<ResultsPage/>} />
        <Route path="/results/:year/:round" element={<RaceResultsPage />} />
        <Route path="/teams" element={<TeamStandingsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </div>
  )
}

export default App