import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErgastService from "../services/ergastService";
import XMLParser from "../utils/xmlParser";
import Layout from "../components/Layout";
import RaceCard from "../components/RaceCard";
import RaceResults from "./RaceResultPage";
import { Calendar } from "lucide-react";

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize available years
    const currentYear = new Date().getFullYear();
    setYears(Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i));
    setSelectedYear(currentYear);
  }, []);

  useEffect(() => {
    const fetchRaceSchedule = async () => {
      if (!selectedYear) return;
      
      setLoading(true);
      try {
        const response = await ErgastService.getRaceSchedule(selectedYear.toString());
        
        for (let index = 0; index < response.length; index++) {
          const race = response[index];
          race.circuitImage = await XMLParser.getCiruitImg(
            race.Circuit.Location.country,
            race.Circuit.Location.locality
          );
          race.round = index + 1;
        }
        
        setSchedule(response);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch race schedule:", error);
        setError("Failed to load race schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchRaceSchedule();
  }, [selectedYear]);

  const handleRaceSelect = (race) => {
    navigate(`/results/${race.season}/${race.round}`, {
      state: { race }
    });
  };

  const renderYearSelection = () => (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-center">
        <div>
          <label
            htmlFor="yearSelect"
            className="block text-lg font-medium text-gray-700 mb-2 flex items-center space-x-2 justify-center"
          >
            <Calendar size={18} className="text-gray-600" />
            <span>Season</span>
          </label>
          <select
            id="yearSelect"
            className="w-40 p-2 rounded-lg border-gray-300 shadow-sm text-sm text-center appearance-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year} className="px-2">
                {year} Season
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout title={`F1 Race Schedule ${selectedYear}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-700">
            Loading Race Schedule...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={`F1 Race Schedule ${selectedYear}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`F1 Race Schedule ${selectedYear}`}>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4 pb-8">
          {renderYearSelection()}
          
          {selectedRace && <RaceResults race={selectedRace} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedule.map((race, index) => (
              <RaceCard
                key={race.Circuit.circuitId || index}
                race={race}
                index={index}
                onSelect={() => handleRaceSelect(race)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SchedulePage;