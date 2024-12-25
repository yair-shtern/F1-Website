import React, { useState } from 'react';
import RaceSchedule from './SchedulePage';
import RaceResults from './ResultsPage';

const RacesPage = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedRace, setSelectedRace] = useState({ year: null, round: null });

  const tabs = [
    { id: 'schedule', label: 'Race Schedule' },
    { id: 'results', label: 'Race Results' },
  ];

  const handleRaceSelect = (year, round) => {
    setSelectedRace({ year, round });
    setActiveTab('results');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-f1-red mb-6">F1 2024 Races</h1>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab.id
                ? 'text-f1-red border-b-2 border-f1-red'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'schedule' && (
          <RaceSchedule onRaceSelect={handleRaceSelect} year={'2024'} />
        )}

        {activeTab === 'results' && selectedRace.year && selectedRace.round ? (
          <RaceResults year={selectedRace.year} round={selectedRace.round} />
        ) : activeTab === 'results' ? (
          <div className="text-gray-600">Please select a race to view results.</div>
        ) : null}
      </div>
    </div>
  );
};

export default RacesPage;
