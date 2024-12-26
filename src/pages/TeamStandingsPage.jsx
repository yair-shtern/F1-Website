import React, { useState, useEffect } from 'react';
import ErgastService from '../services/ergastService';
import XMLParser from '../utils/xmlParser';
import Layout from '../components/Layout';

const TeamCard = ({ team, position, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const year = '2024';
  const teamColors = {
    'red_bull': 'from-blue-900 to-purple-800',
    'ferrari': 'from-red-600 to-red-800',
    'mercedes': 'from-teal-500 to-gray-800',
    'mclaren': 'from-orange-500 to-blue-800',
    'aston_martin': 'from-emerald-600 to-emerald-800',
    'alpine': 'from-pink-500 to-blue-800',
    'williams': 'from-blue-600 to-blue-800',
    'haas': 'from-red-600 to-gray-900',
    'kick_sauber': 'from-green-500 to-green-700',
    'rb': 'from-blue-600 to-purple-900',
  };

  const gradientClass = teamColors[team.constructorId] || 'from-gray-700 to-gray-900';
  const imageName = team.constructorId === 'red_bull' ? 'red-bull-racing' : team.constructorId.replace('_', '-');
  const carImage = `https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/${year}/${imageName}.png`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-102 ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(team)}
    >
      <div className={`h-72 bg-gradient-to-br ${gradientClass} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-4 right-4 bg-white text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
          {position}
        </div>

        <div className="h-full flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">{team.teamName}</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-semibold">{team.points} PTS</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-semibold">{team.wins} Wins</span>
              </div>
            </div>
          </div>

          <div className={`relative h-40 transition-transform duration-500`}>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-lg z-10"></div>
            <img
              src={team.logo}
              alt={`${team.teamName} logo`}
              className="w-full h-full object-cover rounded-lg z-20 relative"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamStandingsPage = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchTeamStandings = async () => {
      try {
        const response = await ErgastService.getTeamStandings('2024', '24');
        const xmlDoc = XMLParser.parseXML(response);
        if (!xmlDoc) throw new Error('Failed to parse XML');
        const teamStandings = await XMLParser.extractTeamStandings(xmlDoc);
        if (!teamStandings) throw new Error('Failed to parse team data');

        setStandings(teamStandings);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTeamStandings();
  }, []);

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
  };

  const closeFloatingCard = () => setSelectedTeam(null);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-700">Loading Teams...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-600">Error loading team standings</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {selectedTeam && (
          <div className="fixed top-16 right-16 bg-white shadow-xl rounded-lg p-6 w-96 z-50">
            <button
              onClick={closeFloatingCard}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-f1-red mb-4">{selectedTeam.teamName}</h2>
            <img
              src={selectedTeam.logo}
              alt={`${selectedTeam.teamName} logo`}
              className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
            />
            <ul className="text-gray-700">
              <li><strong>Wins:</strong> {selectedTeam.wins}</li>
              <li><strong>Points:</strong> {selectedTeam.points}</li>
              <li><strong>Position:</strong> {standings.indexOf(selectedTeam) + 1}</li>
            </ul>
          </div>
        )}
        <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="bg-white px-4 py-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-f1-blue mb-2">2024 Constructor's Championship</h1>
            <p className="text-gray-600">Current standings after the latest race</p>
          </div>
        </div>

          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standings.map((team, index) => (
                <TeamCard
                  key={team.constructorId}
                  team={team}
                  position={index + 1}
                  onClick={handleTeamClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamStandingsPage;
