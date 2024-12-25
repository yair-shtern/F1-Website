import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const TeamPerformance = ({ performanceData }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-f1-blue mb-6">Team Performance Metrics</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="space-y-3">
            {performanceData.map((team) => (
              <div 
                key={team.id} 
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
              >
                <span className="font-medium">{team.name}</span>
                <div className="flex items-center">
                  <span className="text-f1-blue font-bold mr-2">
                    {team.averageLapTime}s
                  </span>
                  <span 
                    className={`text-sm ${
                      team.performance > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}
                  >
                    {team.performance > 0 ? '▲' : '▼'} {Math.abs(team.performance)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Lap Time Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="averageLapTime" 
                fill="#E10600" 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default TeamPerformance