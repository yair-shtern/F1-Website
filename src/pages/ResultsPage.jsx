import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import ErgastService from "../services/ergastService";
import XMLParser from "../utils/xmlParser";
import Layout from "../components/Layout";
import Card from "../components/Card";

const ResultsPage = () => {
  const [raceDetails, setRaceDetails] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [years, setYears] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch available years
    const fetchYears = async () => {
      try {
        const response = [2024, 2023, 2022, 2021, 2020] // await ErgastService.getYears();
        setYears(response);
        setSelectedYear(response[0]);  // Set default year to the first in the list
      } catch (error) {
        console.error("Failed to fetch years:", error);
        setError("Unable to fetch years. Please try again later.");
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    // Fetch races based on the selected year
    const fetchRaces = async () => {
      if (!selectedYear) return;
      
      try {
        const response = await ErgastService.getRaceSchedule(selectedYear);
        setRaces(response);
        setSelectedRound(response[0]?.round);  // Set default race to the first round
      } catch (error) {
        console.error("Failed to fetch races:", error);
        setError("Unable to fetch races. Please try again later.");
        setLoading(false);
      }
    };

    fetchRaces();
  }, [selectedYear]);

  useEffect(() => {
    // Fetch race results based on selected year and round
    const fetchRaceResults = async () => {
      if (!selectedYear || !selectedRound) {
        setError("Missing race information");
        setLoading(false);
        return;
      }

      try {
        const response = await ErgastService.getRaceResults(selectedYear, selectedRound);
        const xmlDoc = XMLParser.parseXML(response);

        if (!xmlDoc) throw new Error("Failed to parse XML.");

        const raceData = XMLParser.extractRaceResults(xmlDoc);
        if (!raceData || !raceData.raceDetails || !raceData.allResults) {
          throw new Error("Incomplete race results data.");
        }

        setRaceResults(raceData.allResults);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch race results:", error);
        setError("Unable to fetch race results. Please try again later.");
        setLoading(false);
      }
    };

    fetchRaceResults();
  }, [selectedYear, selectedRound]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-700">Loading Race Results...</div>
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

  if (!raceResults.length) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-600">No race results available.</div>
        </div>
      </Layout>
    );
  }

  const raceDate = new Date(`${raceDetails.date}T${raceDetails.time}`);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Year and Race Selectors */}
        <div className="flex gap-4 mb-6">
          <div>
            <label htmlFor="yearSelect" className="block text-lg font-medium">Select Year</label>
            <select
              id="yearSelect"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="raceSelect" className="block text-lg font-medium">Select Race</label>
            <select
              id="raceSelect"
              className="mt-1 block w-full rounded-md border-gray-300"
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
            >
              {races.map(race => (
                <option key={race.round} value={race.round}>
                  {`Round ${race.round} - ${race.name}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Circuit Image and Race Info Header */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <img
            src={raceDetails.circuitImage}
            alt={raceDetails.circuitName}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{raceDetails.raceName}</h1>
              {raceDetails.wikipediaUrl && (
                <a
                  href={raceDetails.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-200"
                >
                  <ExternalLink size={24} />
                </a>
              )}
            </div>
            <p className="text-lg opacity-90">
              Round {selectedRound} - {raceDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Circuit Information and Race Statistics Cards */}
        <div className="mb-8 grid md:grid-cols-2 gap-6">
          <Card
            title="Circuit Information"
            details={[
              { text: `Circuit: ${raceDetails.circuitName}` },
              { text: `Location: ${raceDetails.location.locality}, ${raceDetails.location.country}` },
              { text: `Race Start: ${raceDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}` }
            ]}
            imageSrc={raceDetails.circuitImage}
            imageAlt={raceDetails.circuitName}
          />

          <Card
            title="Race Statistics"
            details={[
              { text: `Total Entries: ${raceResults.length}` },
              { text: `Finishers: ${raceResults.filter(r => r.statusId === "1").length}` },
              { text: `Circuit ID: ${raceDetails.circuit.circuitId}` }
            ]}
          />
        </div>

        {/* Results Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Race Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-f1-red text-white">
                  <tr>
                    <th className="p-3 text-left">Position</th>
                    <th className="p-3 text-left">Driver</th>
                    <th className="p-3 text-left">Team</th>
                    <th className="p-3 text-left">Grid</th>
                    <th className="p-3 text-left">Time/Status</th>
                    <th className="p-3 text-left">Fastest Lap</th>
                    <th className="p-3 text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {raceResults.map((result) => (
                    <tr key={result.driver.driverId} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-3 font-bold">{result.positionText !== "R" ? result.positionText : "NC"}</td>
                      <td className="p-3">
                        {result.driver.givenName} {result.driver.familyName}
                      </td>
                      <td className="p-3">{result.constructor.constructorName}</td>
                      <td className="p-3">{result.gridPosition}</td>
                      <td className="p-3">
                        {result.statusId === "1"
                          ? result.raceTimeText
                          : result.statusId === "11"
                          ? result.status
                          : "DNF"}
                      </td>
                      <td className="p-3">{result.fastestLap ? result.fastestLap.fastestLapTime : "—"}</td>
                      <td className="p-3">{result.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ResultsPage;
