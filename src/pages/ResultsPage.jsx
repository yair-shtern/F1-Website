import React, { useState, useEffect } from "react";
import { ExternalLink, Calendar, Flag } from "lucide-react";
import ErgastService from "../services/ergastService";
import Layout from "../components/Layout";
import Card from "../components/Card";
import XMLParser from "../utils/xmlParser";

const ResultsPage = () => {
  const [years, setYears] = useState([]);
  const [raceDetails, setRaceDetails] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [numRounds, setNumRounds] = useState(0);
  const [selectedRound, setSelectedRound] = useState("last");
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
        setSelectedRound(data.length);
        setRaceDetails(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch race schedule.");
      })
      .finally(() => setLoading(false));
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear || !selectedRound) return;
    setLoading(true);
    setError("");

    ErgastService.getRaceResults(selectedYear, selectedRound)
      .then(async(data) => {
        data.circuitImage = await XMLParser.getCiruitImg(
          data.Circuit.Location.country,
          data.Circuit.Location.locality
        );
        setRaceDetails(data);
        setRaceResults(data.Results);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch race results.");
      })
      .finally(() => setLoading(false));
  }, [selectedYear, selectedRound]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-semibold text-gray-700">Loading Race Results...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-600 font-medium">{error}</div>
        </div>
      </Layout>
    );
  }

  const renderSelectionCard = () => {
    const selectionDetails = [
      {
        icon: Calendar,
        text: (
          <div className="w-full">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="space-y-2">
                  <label 
                    htmlFor="yearSelect" 
                    className="block text-base font-semibold text-gray-700"
                  >
                    Season
                  </label>
                  <div className="relative">
                    <select
                      id="yearSelect"
                      className="block w-full px-4 py-3 rounded-lg bg-white border border-gray-300 
                               shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                               focus:outline-none transition-colors duration-200
                               text-base font-medium"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>{year} Season</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <Calendar size={20} className="text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label 
                    htmlFor="raceSelect" 
                    className="block text-base font-semibold text-gray-700"
                  >
                    Race
                  </label>
                  <div className="relative">
                    <select
                      id="raceSelect"
                      className="block w-full px-4 py-3 rounded-lg bg-white border border-gray-300 
                               shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                               focus:outline-none transition-colors duration-200
                               text-base font-medium"
                      value={selectedRound}
                      onChange={(e) => setSelectedRound(e.target.value)}
                    >
                      {Array.from({ length: numRounds }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Round {i + 1}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <Flag size={20} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ];

    return (
      <Card
        title="Race Selection"
        details={selectionDetails}
      />
    );
  };

  const renderRaceDetailsCard = () => {
    if (!raceDetails) return null;

    const details = [
      { text: raceDetails.Circuit.circuitName },
      { text: `${raceDetails.Circuit.Location.locality}, ${raceDetails.Circuit.Location.country}` },
      { text: `${new Date(raceDetails.date).toLocaleDateString()} ${new Date(raceDetails.date + "T" + raceDetails.time).toLocaleTimeString()}` },
      {
        text: (
          <div className="flex items-center">
            <span className="font-medium mr-2">Wikipedia:</span>
            <a
              href={raceDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        ),
      },
      {
        text: (
          <div className="w-full mt-6">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="sticky top-0 border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900">Position</th>
                      <th className="sticky top-0 border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                      <th className="sticky top-0 border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900">Team</th>
                      <th className="sticky top-0 border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                      <th className="sticky top-0 border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900">Points</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {raceResults.map((result, idx) => (
                      <tr 
                        key={result.Driver.driverId}
                        className={`
                          transition-colors hover:bg-gray-50
                          ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        `}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {result.position}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <a 
                            href={result.Driver.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {result.Driver.givenName} {result.Driver.familyName}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <a
                            href={result.Constructor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {result.Constructor.name}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {result.Time ? result.Time.time : result.positionText}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {result.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ),
      },
    ];

    return (
      <Card
        imageSrc={raceDetails.circuitImage}
        imageAlt={`${raceDetails.Circuit.circuitName}`}
        title={raceDetails.raceName}
        details={details}
      />
    );
  };

  return (
    <Layout>
      <div className="w-full px-4 py-8 space-y-6">
        {renderSelectionCard()}
        {renderRaceDetailsCard()}
      </div>
    </Layout>
  );
};

export default ResultsPage;