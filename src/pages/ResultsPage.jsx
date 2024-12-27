import React, { useState, useEffect } from "react";
import { ExternalLink, Calendar, Flag } from "lucide-react";
import ErgastService from "../services/ergastService";
import Layout from "../components/Layout";
import XMLParser from "../utils/xmlParser";

const ResultsPage = () => {
  const [years, setYears] = useState([]);
  const [raceDetails, setRaceDetails] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [numRounds, setNumRounds] = useState(0);
  const [selectedRound, setSelectedRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYears(Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i));
    setSelectedYear(currentYear);
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    setLoading(true);
    setError("");

    ErgastService.getRaceSchedule(selectedYear)
      .then((data) => {
        setNumRounds(data.length);
        setRaceDetails(null);
      })
      .catch(() => setError("Failed to fetch race schedule."))
      .finally(() => setLoading(false));
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear || !selectedRound) return;
    setLoading(true);
    setError("");

    ErgastService.getRaceResults(selectedYear, selectedRound)
      .then(async (data) => {
        data.circuitImage = await XMLParser.getCiruitImg(
          data.Circuit.Location.country,
          data.Circuit.Location.locality
        );
        console.log(data)
        setRaceDetails(data);
        setRaceResults(data.Results);
      })
      .catch(() => setError("Failed to fetch race results."))
      .finally(() => setLoading(false));
  }, [selectedYear, selectedRound]);

  if (loading) {
    return (
      <Layout title="Race Results">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-semibold text-gray-700">Loading Race Results...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Race Results">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-600 font-medium">{error}</div>
        </div>
      </Layout>
    );
  }

  const renderSelection = () => (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-around gap-10">
        
        {/* Year Selection */}
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
  
        {/* Race Selection */}
        <div>
          <label
            htmlFor="raceSelect"
            className="block text-lg font-medium text-gray-700 mb-2 flex items-center space-x-2 justify-center"
          >
            <Flag size={18} className="text-gray-600" />
            <span>Race</span>
          </label>
          <select
            id="raceSelect"
            className="w-40 p-2 rounded-lg border-gray-300 shadow-sm text-sm text-center appearance-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
          >
            {Array.from({ length: numRounds }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Round {i + 1}
              </option>
            ))}
          </select>
        </div>
        
      </div>
    </div>
  );
  

  const renderRaceDetails = () => {
    if (!raceDetails) return null;

    return (
      <div>
        <img
  src={raceDetails.circuitImage}
  alt={raceDetails.Circuit.circuitName}
  className="w-full h-full object-cover rounded-lg shadow-md"
/>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Flag size={18} className="text-gray-600" />
              <span className="text-lg font-medium">
                {raceDetails.Circuit.circuitName}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar size={18} className="text-gray-600" />
              <span>
                {raceDetails.Circuit.Location.locality}, {raceDetails.Circuit.Location.country}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ExternalLink size={18} className="text-gray-600" />
              <a
                href={raceDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View on Wikipedia
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Race Results">
      <div className="w-full px-4 pb-8 space-y-6">
        {renderSelection()}
        {renderRaceDetails()}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse border-spacing-0">
            <thead>
              <tr>
                {["Position", "Driver", "Team", "Time", "Points"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 bg-gray-100 text-gray-800 font-medium border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {raceResults.map((result, idx) => (
                <tr
                  key={result.Driver.driverId}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4">{result.position}</td>
                  <td className="px-6 py-4">
                    <a
                      href={result.Driver.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {result.Driver.givenName} {result.Driver.familyName}
                    </a>
                  </td>
                  <td className="px-6 py-4">{result.Constructor.name}</td>
                  <td className="px-6 py-4">{result.Time?.time || result.positionText}</td>
                  <td className="px-6 py-4">{result.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
