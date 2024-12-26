import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErgastService from "../services/ergastService";
import XMLParser from "../utils/xmlParser";
import Layout from "../components/Layout";
import YearSelector from "../components/YearSelector";
import RaceCard from "../components/RaceCard";
import RaceResults from "./RaceResultPage";

const SchedulePage = ({ initialYear = "2024" }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(initialYear);
  const [error, setError] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRaceSchedule = async () => {
      setLoading(true);
      try {
        const response = await ErgastService.getRaceSchedule(year);
        // const xmlDoc = XMLParser.parseXML(response);

        // if (!xmlDoc) throw new Error("Failed to parse XML");

        // const raceSchedule = await XMLParser.extractRaceSchedule(xmlDoc);
        // if (!raceSchedule) throw new Error("Failed to parse race data");
        for (let index = 0; index < response.length; index++) {
          const race = response[index];
          race.circuitImage = await XMLParser.getCiruitImg(
              race.Circuit.Location.country,
              race.Circuit.Location.locality
          );
          race.round = index + 1;
        }
        console.log(response)
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
  }, [year]);

  const handleRaceSelect = (race) => {
    navigate(`/results/${race.season}/${race.round}`, {
      state: { race } 
    });
  };

  if (loading) {
    return (
      <Layout>
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
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
        <div className="flex-1 overflow-y-auto h-screen">
        <div className="flex bg-white px-4 pt-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-f1-blue">
                {year} F1 Race Schedule
              </h1>
              <YearSelector selectedYear={year} onYearChange={setYear} />
            </div>
          </div>
        </div>

          <div className="container mx-auto px-4 py-4">
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