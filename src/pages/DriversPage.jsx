import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import XMLParser from '../utils/xmlParser';
import ErgastService from '../services/ergastService';
import { ExternalLink } from "lucide-react";

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchAllDriverData = async () => {
      try {
        const response = await ErgastService.getDrivers('2024');
        const xmlDoc = XMLParser.parseXML(response);
        if (!xmlDoc) throw new Error('Failed to parse XML');
        
        const driverData = XMLParser.extractDriverData(xmlDoc);
        
        // Fetch additional info for all drivers
        const enrichedDrivers = await Promise.all(
          driverData.map(async (driver) => {
            try {
              const additionalInfo = await XMLParser.fetchAdditionalDriverDetails(driver.wikipediaUrl);
              return { ...driver, additionalInfo };
            } catch (error) {
              console.error(`Failed to fetch details for ${driver.givenName}:`, error);
              return driver;
            }
          })
        );
        
        setDrivers(enrichedDrivers);
      } catch (error) {
        console.error('Failed to fetch driver details:', error);
      }
      setLoading(false);
    };

    fetchAllDriverData();
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && selectedDriver) {
        setSelectedDriver(null);
      }
    };

    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setSelectedDriver(null);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    if (selectedDriver) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [selectedDriver]);

  if (loading) return <Layout><div className="flex items-center justify-center h-screen">Loading Drivers...</div></Layout>;

  const sortedDrivers = [...drivers].sort((a, b) => a.driverNumber - b.driverNumber);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
        <header className="bg-gradient-to-r from-f1-red to-f1-blue py-12 mb-8 shadow-lg">
          <h1 className="text-5xl text-center font-bold text-white">F1 Drivers 2024</h1>
        </header>

        <main className="container mx-auto px-4 pb-8">
          <div className="grid md:grid-cols-3 gap-8">
            {sortedDrivers.map((driver) => (
              <div key={driver.driverId} className="transform hover:scale-105 transition-transform">
                <Card
                  imageSrc={driver.imageUrl}
                  imageAlt={`${driver.givenName} ${driver.familyName}`}
                  badgeContent={
                    <img
                      src={driver.numberImage}
                      alt={`Driver number ${driver.driverNumber}`}
                      className="w-16 h-16 object-contain"
                    />
                  }
                  title={`${driver.givenName} ${driver.familyName}`}
                  details={[
                    {
                      text: (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Country:</span> {driver.nationality}
                          <img src={driver.flagUrl} alt={`${driver.nationality} flag`} className="w-6 h-4" />
                        </div>
                      )
                    },
                    {
                      text: (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Team:</span> {driver.additionalInfo.currentTeam}
                        </div>
                      )
                    }
                  ]}
                  onCardClick={() => setSelectedDriver(driver)}
                />
              </div>
            ))}
          </div>
        </main>

        {selectedDriver && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={cardRef} className="bg-white rounded-2xl max-w-4xl max-w-2/3 max-h-[80vh] flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex gap-6">
                  <img
                    src={selectedDriver.profileImageUrl}
                    alt={selectedDriver.givenName}
                    className="w-48 h-48 object-cover rounded-xl"
                  />
            <div className="flex-1">
  <div className="grid grid-cols-3 gap-6 items-center">
    <div className="col-span-2">
      <h2 className="text-3xl font-bold text-f1-red">
        {selectedDriver.givenName} {selectedDriver.familyName}
      </h2>
      <div className="mt-4 space-y-2">
  <p><span className="font-bold">Country:</span> {selectedDriver.nationality}</p>
  <p><span className="font-bold">Number:</span> {selectedDriver.driverNumber}</p>
  <p className="flex items-center">
    <span className="font-bold mr-2">Wikipedia Page:</span>
    <a
      href={selectedDriver.wikipediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-blue-600 hover:underline"
    >
      <ExternalLink size={18} />
    </a>
  </p>
</div>

    </div>
    
    {/* Number Image (Takes up 1/3 of the space) */}
    <div className="flex justify-center">
      <img
        src={selectedDriver.numberImage}
        alt={`#${selectedDriver.driverNumber}`}
        className="w-full h-auto max-w-[150px] object-contain"
      />
    </div>
  </div>
</div>

                </div>
              </div>

              {selectedDriver.additionalInfo && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Career Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-y-2 gap-x-8 max-h-[300px] overflow-y-auto px-2">
                    {Object.entries(selectedDriver.additionalInfo.careerHighlights)
                      .filter(([_, value]) => value && value !== 'N/A' && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-semibold">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-gray-200 flex justify-center">
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="bg-gradient-to-r from-f1-red to-f1-blue text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DriversPage;