import React, { useState, useEffect } from 'react'; 
import ErgastService from '../services/ergastService';
import XMLParser from '../utils/xmlParser';

const DriverDetails = ({ driverId }) => {
  const [driverInfo, setDriverInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [imageUrl, setImageUrl] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await ErgastService.getDrivers('2024');

        // Parse the XML
        const xmlDoc = XMLParser.parseXML(response);
        if (!xmlDoc) throw new Error('Failed to parse XML');

        // Extract driver data
        const drivers = XMLParser.extractDriverData(xmlDoc);
        if (!drivers) {
          throw new Error('Failed to parse driver data');
        }

        const driver = drivers.find((d) => d.driverId === driverId);

        const additionalDetails = await XMLParser.fetchAdditionalDriverDetails(driver.wikipediaUrl);
        console.log(additionalDetails)
        setDriverInfo(driver);
        setAdditionalInfo(additionalDetails);
        // setImageUrl(additionalDetails.profileImageUrl);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch driver details:', error);
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [driverId]);

  if (loading) {
    return <div className="text-center text-xl text-gray-700">Loading driver details...</div>;
  }

  if (!driverInfo) {
    return <div className="text-center text-xl text-red-500">Driver not found</div>;
  }
  
  const nameCode = `${driverInfo.givenName.substring(0, 3)}${driverInfo.familyName.substring(0, 3)}`;
  // console.log(`https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${driverInfo.driverCode.charAt(0)}/${nameCode}01_${driverInfo.givenName}_${driverInfo.familyName}_${driverInfo.familyName}/${nameCode}01.png`)
  return (    
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto w-full h-full">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Driver Image */}
        <div className=" mb-6 md:mb-0 md:mr-6 flex-shrink-0 border-4 border-f1-red shadow-sm rounded-lg flex justify-center items-center overflow-hidden">
          <img
            // src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/${driverInfo.familyName}`}
            src={`https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${driverInfo.givenName.charAt(0)}/${nameCode}01_${driverInfo.givenName}_${driverInfo.familyName}/${nameCode}01.png`}
            alt="Driver"
            className="w-full h-full object-cover"
            style={{ width: '200px', height: 'auto' }}  // Resize to 200px width, height auto
          />
        </div>


        {/* Driver Info */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-f1-red mb-2">
            {driverInfo.givenName} {driverInfo.familyName}
          </h2>
          <p className="text-lg text-gray-700 mb-2"> 
            <strong>Country:</strong> {driverInfo.nationality} 
            <img
              src={driverInfo.flagUrls.flagcdn}
              alt={`${driverInfo.nationality} flag`}
              className="inline-block w-10 h-6 rounded border ml-2"
            />
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Number:</strong> {driverInfo.permanentNumber || 'N/A'}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Wikipedia:</strong>{' '}
            <a
              href={driverInfo.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visit Page
            </a>
          </p>
        </div>
      </div>

      {/* Additional Info */}
      {additionalInfo && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Career Highlights</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Current Team:</strong> {additionalInfo.currentTeam}</li>
            <li><strong>Championships:</strong> {additionalInfo.careerHighlights.championships}</li>
            <li><strong>Entries:</strong> {additionalInfo.careerHighlights.entries}</li>
            <li><strong>Wins:</strong> {additionalInfo.careerHighlights.wins}</li>
            <li><strong>Podiums:</strong> {additionalInfo.careerHighlights.podiums}</li>
            <li><strong>Career Points:</strong> {additionalInfo.careerHighlights.careerPoints}</li>
            <li><strong>Pole Positions:</strong> {additionalInfo.careerHighlights.polePositions}</li>
            <li><strong>Fastest Laps:</strong> {additionalInfo.careerHighlights.fastestLaps}</li>
            <li><strong>First Entry:</strong> {additionalInfo.careerHighlights.firstEntry}</li>
            <li><strong>First Win:</strong> {additionalInfo.careerHighlights.firstWin}</li>
            <li><strong>Last Win:</strong> {additionalInfo.careerHighlights.lastWin}</li>
            <li><strong>Last Entry:</strong> {additionalInfo.careerHighlights.lastEntry}</li>
            <li><strong>2024 Position:</strong> {additionalInfo.careerHighlights.lastPosition}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DriverDetails;
