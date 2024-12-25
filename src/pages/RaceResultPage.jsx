import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"; // Import useParams hook
import { ExternalLink } from "lucide-react";
import ErgastService from "../services/ergastService";
import XMLParser from "../utils/xmlParser";
import Layout from "../components/Layout";
import Card from "../components/Card";

const RaceResultsPage = () => {
  const { state } = useLocation(); 
  const [raceDetails, setRaceDetails] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const race = state?.race;
  const year = race.year
  const round = race.round

  useEffect(() => {
    const fetchRaceResults = async () => {
      if (!year || !round) {
        setError("Missing race information");
        setLoading(false);
        return;
      }

      try {
        const response = await ErgastService.getRaceResults(year, round);
        const xmlDoc = XMLParser.parseXML(response);

        if (!xmlDoc) throw new Error("Failed to parse XML.");

        const raceData = XMLParser.extractRaceResults(xmlDoc);
        if (!raceData || !raceData.allResults) {
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
  }, [year, round]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-gray-700">Loading Race Results...</div>
      </div>
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

  if (raceResults.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-red-600">No race results available.</div>
        </div>
      </Layout>
    );
  }

  const raceDate = new Date(`${race.date}T${race.time}`); // Adjust as needed

  return (
    <Layout>  
      <div className="max-w-7xl">
        {/* Circuit Image, Race Info Header, and Circuit Information */}
        <div className="relative mb-8 overflow-hidden">
          <img 
            src={race?.circuitImage} 
            alt={race?.circuitName}
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{race?.circuitName}</h1>
              {race?.wikipediaUrl && (
                <a 
                  href={race?.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-200"
                >
                  <ExternalLink size={24} />
                </a>
              )}
            </div>
            <p className="text-lg opacity-90">
              Round {round} - {raceDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
  
        {/* Circuit Information and Race Statistics */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Circuit Information</h3>
          <div className="space-y-2">
            <p><strong>Circuit:</strong> {race?.circuitName}</p>
            <p><strong>Location:</strong> {race?.location.locality}, {race?.location.country}</p>
            <p><strong>Race Start:</strong> {raceDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p>
            <p><strong>Total Entries:</strong> {raceResults.length}</p>
            <p><strong>Finishers:</strong> {raceResults.filter(r => r.statusId === "1").length}</p>
            <p><strong>Circuit ID:</strong> {race?.circuitId}</p>
          </div>
        </div>
  
        {/* Race Results Table */}
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
                    <td className="p-3 font-bold">
                      {result.positionText !== "R" ? result.positionText : "NC"}
                    </td>
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
      </div>
    </Layout>
  );
  
  
};

export default RaceResultsPage;
