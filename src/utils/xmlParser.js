import { data } from 'autoprefixer';
import axios from 'axios';
import * as cheerio from 'cheerio';

class XMLParser {
  /**
   * Parses an XML string into a DOM Document.
   * @param {string} xmlString - The XML string to parse.
   * @returns {Document|null} - The parsed XML document or null if parsing fails.
   */
  static parseXML(xmlString) {
    if (!xmlString || typeof xmlString !== 'string') {
      console.error('Invalid XML input');
      return null;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");

      // More robust error checking
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        console.error("XML Parsing Error:", parseError.textContent);
        return null;
      }

      return xmlDoc;
    } catch (error) {
      console.error('Fatal error parsing XML:', error);
      return null;
    }
  }

  /**
   * Comprehensive mapping of nationalities to country codes
   * @returns {Object} Mapping of nationalities to ISO 3166-1 alpha-2 country codes
   */
  static getNationalityMap() {
    return {
      // European Countries
      'British': 'GB',
      'Finnish': 'FI',
      'German': 'DE',
      'Dutch': 'NL',
      'Spanish': 'ES',
      'French': 'FR',
      'Italian': 'IT',
      'Danish': 'DK',
      'Swiss': 'CH',
      'Swedish': 'SE',
      'Belgian': 'BE',
      'Austrian': 'AT',
      'Portuguese': 'PT',
      'Polish': 'PL',
      'Russian': 'RU',
      'Croatian': 'HR',
      'Czech': 'CZ',
      'Greek': 'GR',

      // North American Countries
      'American': 'US',
      'Canadian': 'CA',
      'Mexican': 'MX',

      // South American Countries
      'Brazilian': 'BR',
      'Argentinian': 'AR',
      'Colombian': 'CO',
      'Venezuelan': 'VE',
      'Chilean': 'CL',

      // Asian Countries
      'Japanese': 'JP',
      'Chinese': 'CN',
      'Thai': 'TH',
      'Malaysian': 'MY',
      'Indian': 'IN',
      'Korean': 'KR',
      'Vietnamese': 'VN',
      'Singaporean': 'SG',

      // Oceania Countries
      'Australian': 'AU',
      'New Zealander': 'NZ',

      // Middle Eastern Countries
      'Saudi Arabian': 'SA',
      'Emirati': 'AE',
      'Bahraini': 'BH',
      'Qatari': 'QA',

      // African Countries
      'South African': 'ZA',
      'Moroccan': 'MA',
      'Egyptian': 'EG',

      // Additional Formula 1 Related Nationalities
      'Monégasque': 'MC', // Monaco
      'Monegasque': 'MC',
      'Monacoan': 'MC',
      'Liechtensteiner': 'LI',
      'Slovenian': 'SI',
    };
  }

  /**
   * Normalize nationality string
   * @param {string} nationality - Original nationality string
   * @returns {string} - Normalized nationality
   */
  static normalizeNationality(nationality) {
    return nationality
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/^./, char => char.toUpperCase())
      .trim();
  }

  /**
   * Get country code based on nationality with enhanced error handling
   * @param {string} nationality - Nationality of the driver/team
   * @returns {string} - Two-letter country code
   */
  static getCountryCode(nationality) {
    if (!nationality) return 'UN';

    const normalizedNationality = this.normalizeNationality(nationality);
    const nationalityMap = this.getNationalityMap();

    if (nationalityMap[normalizedNationality]) {
      return nationalityMap[normalizedNationality];
    }

    const partialMatch = Object.keys(nationalityMap).find(key => 
      normalizedNationality.includes(key) || key.includes(normalizedNationality)
    );

    if (partialMatch) {
      console.warn(`Partial nationality match: ${nationality} -> ${partialMatch}`);
      return nationalityMap[partialMatch];
    }

    console.warn(`Unknown nationality: ${nationality}. Using 'UN' (Unknown)`);
    return 'UN';
  }

  /**
   * Extracts driver data from a parsed XML document.
   * @param {Document} xmlDoc - The parsed XML document.
   * @returns {Array} - List of driver data with enhanced information
   */
  static extractDriverData(xmlDoc) {
    const driverElements = xmlDoc.getElementsByTagName("Driver");
    if (driverElements.length === 0) {
      console.error("No Driver data found in XML.");
      return [];
    }

    return Array.from(driverElements).map((driver) => {
      const nationality = driver.getElementsByTagName("Nationality")[0]?.textContent || 'Unknown';
      const countryCode = this.getCountryCode(nationality);
      const firstName = driver.getElementsByTagName("GivenName")[0]?.textContent
      const lastName = driver.getElementsByTagName("FamilyName")[0]?.textContent
      const nameCode = `${firstName.substring(0, 3)}${lastName.substring(0, 3)}`;

      return {
        driverId: driver.getAttribute("driverId"),
        driverCode: driver.getAttribute("code"),
        givenName: firstName || 'N/A',
        familyName: lastName || 'N/A',
        fullName: `${driver.getElementsByTagName("GivenName")[0]?.textContent} ${driver.getElementsByTagName("FamilyName")[0]?.textContent}`,
        
        // Detailed Nationality Information
        nationality: nationality,
        countryCode: countryCode,
        flagUrl: `https://flagsapi.com/${countryCode}/flat/64.png`,
        
        // Existing fields
        driverNumber: lastName === 'Verstappen'? 1 : driver.getElementsByTagName("PermanentNumber")[0]?.textContent || 'N/A',
        dateOfBirth: driver.getElementsByTagName("DateOfBirth")[0]?.textContent || 'N/A',
        wikipediaUrl: driver.getAttribute("url") || 'N/A',
        
        // Placeholder for additional async-fetched details
        helmetImage: `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1024/content/dam/fom-website/manual/Helmets2024/${lastName}`,
        numberImage: `https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/2018-redesign-assets/drivers/number-logos/${nameCode}01.png`,
        profileImageUrl: `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${firstName.charAt(0)}/${nameCode}01_${firstName}_${lastName}/${nameCode}01.png`,
        imageUrl: lastName === 'Doohan'? `https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/fom-website/drivers/2024Drivers/${lastName}` : `https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2024Drivers/${lastName}`,
        additionalDetails: null
      };
    });
  }

  static async isValidImage(url) {
    try {
      // Perform a fetch request to check the content type
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.startsWith('image/')) {
        // If the content type is an image, try loading the image
        const img = new Image();
        return new Promise((resolve) => {
          img.onload = () => resolve(true); // Image loaded successfully
          img.onerror = () => resolve(false); // Error loading image
          img.src = url;
        });
      }
      return false; // Not an image
    } catch (error) {
      console.error('Error checking image URL:', error);
      return false;
    }
  }
  
  static async extractRaceSchedule(xmlDoc) {
    const raceElements = xmlDoc.getElementsByTagName("Race");
    if (raceElements.length === 0) {
      console.error("No Race data found in XML.");
      return [];
    }
  
    const raceSchedules = new Array()
  
    for (let race of raceElements) {
      // Get country and locality
      let country = race.getElementsByTagName("Country")[0]?.textContent || 'N/A';
      country = country === 'UK' ? 'great britain' : country
      const locality = race.getElementsByTagName("Locality")[0]?.textContent || 'N/A';
  
      let imageUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/${country.replace(' ', '_')}`;
  
      let isValid = await this.isValidImage(imageUrl);
      if (isValid) {
        console.log(`Found ${country} image!`);
      } else {
        // Second attempt: replace underscores with spaces
        imageUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/${country.replace('_', ' ')}`;
        isValid = await this.isValidImage(imageUrl);
        if (isValid) {
          console.log(`Found image with space-replacement for ${country}!`);
        } else {
          // Fallback to locality if both fail
          imageUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/${locality.replace(' ', '_')}`;
          isValid = await this.isValidImage(imageUrl);
          if (isValid) {
            console.log(`Found ${locality} image!`);
          } else {
            // Final fallback: replace underscores with spaces for locality
            imageUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/${locality.replace('_', ' ')}`;
            isValid = await this.isValidImage(imageUrl);
            if (isValid) {
              console.log(`Found image with space-replacement for ${locality}!`);
            } else {
              console.log(`No valid image found for ${country} and ${locality}.`);
            }
          }
        }
      }
  
      raceSchedules.push({
        wikipediaUrl: race.getAttribute("url") || 'N/A',
        date: race.getElementsByTagName("Date")[0]?.textContent || 'N/A',
        time: race.getElementsByTagName("Time")[0]?.textContent || 'N/A',
        circuitName: race.getElementsByTagName("CircuitName")[0]?.textContent || 'N/A',
        location: {
          locality: locality,
          country: country
        },
        circuit: {
          circuitId: race.getElementsByTagName("Circuit")[0]?.getAttribute("circuitId") || 'N/A',
          circuitRef: race.getElementsByTagName("Circuit")[0]?.getAttribute("circuitRef") || 'N/A',
        },
        circuitImage: imageUrl
      });
    }
    
    return raceSchedules;
  }
  
    
  /**
   * Async method to fetch team logo from constructor's Wikipedia page
   * @param {string} url - The constructor's Wikipedia URL
   * @returns {Promise<string|null>} - URL of the team logo or null
   */
  static async fetchTeamLogo(url) {
    try {
      const match = url.match(/wiki\/(.+)/);
      const response = await axios.get(`/wikipedia/wiki/${match[1]}`);
      const $ = cheerio.load(response.data);

      // Look for logo-specific selectors
      let logoUrl = null;

      // Try multiple approaches to find the logo
      // 1. Look for images with logo-related class or alt text
      logoUrl = $('img[alt*="logo"], img.logo, .logo img').first().attr('src');

      // 2. If not found, look in the infobox for distinctly sized logos
      if (!logoUrl) {
        logoUrl = $('.infobox img').filter((i, el) => {
          const width = $(el).attr('width');
          const height = $(el).attr('height');
          // Look for images with reasonable logo dimensions
          return width && height && 
                parseInt(width) > 50 && parseInt(width) < 300 &&
                parseInt(height) > 30 && parseInt(height) < 200;
        }).first().attr('src');
      }
      // Ensure full URL
      return logoUrl ? `https:${logoUrl}` : null;
    } catch (error) {
      console.error(`Error fetching team logo:`, error);
      return null;
    }
  }

  /**
   * Extracts team standings data from a parsed XML document.
   * @param {Document} xmlDoc - The parsed XML document.
   * @returns {Array} - List of team standings or an empty array if no data is found.
   */
  static async extractTeamStandings(xmlDoc) {
    const teamElements = xmlDoc.getElementsByTagName("ConstructorStanding");
    if (teamElements.length === 0) {
      console.error("No Team data found in XML.");
      return [];
    }

    const teamStandings = await Promise.all(
      Array.from(teamElements).map(async (teamElement) => {
              // Extract Name and Nationality directly
      const teamName = teamElement.getElementsByTagName("Name")[0]?.textContent || 'N/A';
      const nationality = teamElement.getElementsByTagName("Nationality")[0]?.textContent || 'Unknown';
      const points = teamElement.getAttribute("points") || '0';
      const wins = teamElement.getAttribute("wins") || '0';
      const position = teamElement.getAttribute("position") || '0';
      const constructorElement = teamElement.getElementsByTagName("Constructor")[0];
      let constructorId = constructorElement?.getAttribute("constructorId") || 'N/A';
      constructorId = constructorId === "sauber"? "kick_sauber" : constructorId
      const url = constructorElement?.getAttribute("url") || 'N/A';
      const logo = `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/${constructorId.replace('_', ' ')}`;
      const flagUrls = this.getFlagUrls(nationality);

      return {
        teamName,
        nationality,
        points,
        wins,
        position,
        constructorId,
        url,
        logo,
        flagUrls
      };
    })
    );
    return teamStandings;
  }

  /**
   * Async method to fetch additional driver details from Wikipedia
   * @param {string} url - The driver Wikipedia URL
   * @returns {Promise<Object>} - Additional driver details
   */
  static async fetchAdditionalDriverDetails(url) {
    try {
      const match = url.match(/wiki\/(.+)/);
      const response = await axios.get(`/wikipedia/wiki/${match[1]}`);
      const $ = cheerio.load(response.data);

      const infobox = $('.infobox');
      // const imageUrl = infobox.find('img').first().attr('src');
      // const fullImageUrl = imageUrl ? `https:${imageUrl}` : null;

      // Extract additional details from Wikipedia
      const extractInfoboxDetail = (label) => {
        const rowWithLabel = infobox.find(`th:contains("${label}")`).closest('tr');
        return rowWithLabel.find('td').text().trim() || 'N/A';
      };

      return {
        height: extractInfoboxDetail('Height'),
        weight: extractInfoboxDetail('Weight'),
        teamHistory: this.extractTeamHistory($),
        currentTeam: extractInfoboxDetail('2024 team').split("[")[0],
        careerHighlights: {
          championships: parseInt(extractInfoboxDetail('Championships'), 10) || 0,
          entries: parseInt(extractInfoboxDetail('Entries'), 10) || 0,
          wins: parseInt(extractInfoboxDetail('Wins'), 10) || 0,
          podiums: parseInt(extractInfoboxDetail('Podiums'), 10) || 0,
          careerPoints: parseFloat(extractInfoboxDetail('Career points')) || 0,
          polePositions: parseInt(extractInfoboxDetail('Pole positions'), 10) || 0,
          fastestLaps: parseInt(extractInfoboxDetail('Fastest laps'), 10) || 0,
          firstEntry: extractInfoboxDetail('First entry'),
          firstWin: extractInfoboxDetail('First win'),
          lastWin: extractInfoboxDetail('Last win'),
          lastEntry: extractInfoboxDetail('Last entry'),
          lastPosition: extractInfoboxDetail('2024 position')
        }
      };
    } catch (error) {
      console.error(`Error fetching additional details:`, error);
      return { 
        // profileImageUrl: null,
        height: 'N/A',
        weight: 'N/A',
        teamHistory: [],
        currentTeam: 'N/A',
        careerHighlights: {}
      };
    }
  }

  /**
   * Extract driver's team history from Wikipedia
   * @param {Function} $ - Cheerio loaded page
   * @returns {Array} - List of teams driver has raced for
   */
  static extractTeamHistory($) {
    try {
      const teamSection = $('.mw-parser-output').find('h2:contains("Formula One career")').next('ul');
      return teamSection.find('li')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.includes('with'));
    } catch (error) {
      console.error('Error extracting team history:', error);
      return [];
    }
  }

  /**
   * Extract world championships from Wikipedia
   * @param {Function} $ - Cheerio loaded page
   * @returns {number} - Number of world championships won
   */
  static extractWorldChampionships($) {
    try {
      const statsTable = $('.infobox').find('tr:contains("Championships")');
      const championshipsText = statsTable.find('td').text().trim();
      const championships = parseInt(championshipsText, 10);
      return !isNaN(championships) ? championships : 0;
    } catch (error) {
      console.error('Error extracting world championships:', error);
      return 0;
    }
  }

  /**
   * Extracts race results data from a parsed XML document.
   * @param {Document} xmlDoc - The parsed XML document.
   * @returns {Array} - List of race results or an empty array if no data is found.
   */
  static extractRaceResults(xmlDoc) {
    const raceElement = xmlDoc.getElementsByTagName("Race")[0];
    if (raceElement.length === 0) {
      console.error("No Race data found in XML.");
      return [];
    }

    // Collect results from all races
    const allResults = [];
    const raceName = raceElement.getElementsByTagName("RaceName")[0]?.textContent || 'N/A';
    const season = raceElement.getAttribute("season") || 'N/A';
    const round = raceElement.getAttribute("round") || 'N/A';
    const raceDate = raceElement.getElementsByTagName("Date")[0]?.textContent || 'N/A';
    const raceTime = raceElement.getElementsByTagName("Time")[0]?.textContent || 'N/A';

    const circuitElement = raceElement.getElementsByTagName("Circuit")[0];
    const locationElement = circuitElement?.getElementsByTagName("Location")[0];
    const raceDetails = {
      raceName,
      season,
      round,
      raceDate,
      raceTime,
      circuitName: circuitElement?.getElementsByTagName("CircuitName")[0]?.textContent || 'N/A',
      location: {
        locality: locationElement?.getElementsByTagName("Locality")[0]?.textContent || 'N/A',
        country: locationElement?.getElementsByTagName("Country")[0]?.textContent || 'N/A',
        latitude: locationElement?.getAttribute("lat") || 'N/A',
        longitude: locationElement?.getAttribute("long") || 'N/A',
      },
    };

    const resultElements = raceElement.getElementsByTagName("Result");

    Array.from(resultElements).forEach((result) => {
      const driverElement = result.getElementsByTagName("Driver")[0];
      const constructorElement = result.getElementsByTagName("Constructor")[0];
      const fastestLapElement = result.getElementsByTagName("FastestLap")[0];

      const driverDetails = {
        driverId: driverElement?.getAttribute("driverId") || 'N/A',
        driverCode: driverElement?.getAttribute("code") || 'N/A',
        permanentNumber: driverElement?.getElementsByTagName("PermanentNumber")[0]?.textContent || 'N/A',
        givenName: driverElement?.getElementsByTagName("GivenName")[0]?.textContent || 'N/A',
        familyName: driverElement?.getElementsByTagName("FamilyName")[0]?.textContent || 'N/A',
        dateOfBirth: driverElement?.getElementsByTagName("DateOfBirth")[0]?.textContent || 'N/A',
        nationality: driverElement?.getElementsByTagName("Nationality")[0]?.textContent || 'N/A',
      };

      const constructorDetails = {
        constructorId: constructorElement?.getAttribute("constructorId") || 'N/A',
        constructorName: constructorElement?.getElementsByTagName("Name")[0]?.textContent || 'N/A',
        constructorNationality: constructorElement?.getElementsByTagName("Nationality")[0]?.textContent || 'N/A',
      };

      const fastestLapDetails = fastestLapElement ? {
        fastestLapRank: fastestLapElement.getAttribute("rank") || 'N/A',
        fastestLapLap: fastestLapElement.getAttribute("lap") || 'N/A',
        fastestLapTime: fastestLapElement.getElementsByTagName("Time")[0]?.textContent || 'N/A',
        fastestLapAverageSpeed: fastestLapElement.getElementsByTagName("AverageSpeed")[0]?.textContent || 'N/A',
        fastestLapSpeedUnits: fastestLapElement.getElementsByTagName("AverageSpeed")[0]?.getAttribute("units") || 'N/A',
      } : null;

      allResults.push({
        position: result.getAttribute("position") || 'N/A',
        positionText: result.getAttribute("positionText") || 'N/A',
        points: result.getAttribute("points") || '0',
        gridPosition: result.getElementsByTagName("Grid")[0]?.textContent || 'N/A',
        laps: result.getElementsByTagName("Laps")[0]?.textContent || 'N/A',
        status: result.getElementsByTagName("Status")[0]?.textContent || 'N/A',
        statusId: result.getElementsByTagName("Status")[0]?.getAttribute("statusId") || 'N/A',
        raceTime: result.getElementsByTagName("Time")[0]?.getAttribute("millis") || null,
        raceTimeText: result.getElementsByTagName("Time")[0]?.textContent || 'N/A',
        
        driver: driverDetails,
        constructor: constructorDetails,
        fastestLap: fastestLapDetails,        
        driverName: `${driverDetails.familyName}, ${driverDetails.givenName}`,
        team: constructorDetails.constructorName
      });
    });

    return {raceDetails, allResults};
  }

  // /**
  //  * Retrieve an image for a given Wikipedia page URL.
  //  * 
  //  * @param {string} driverName - Name of the driver to search on Wikipedia
  //  * @returns {Promise<string|null>} URL of the first suitable image found
  //  */
  // static async getDriverImage(driverName) {
  //   try {
  //       // Construct Wikipedia URL from driver name
  //       const wikipediaUrl = `/wikipedia/wiki/${encodeURIComponent(driverName)}`;

  //       // Fetch the Wikipedia page HTML content
  //       const response = await axios.get(wikipediaUrl, { 
  //           timeout: 10000
  //           // Removed User-Agent header
  //       });

  //       // Parse the HTML
  //       const $ = cheerio.load(response.data);

  //       // Find the first image in the infobox (usually the profile picture)
  //       const infobox = $('.infobox');
  //       if (infobox.length === 0) {
  //           console.log(`No infobox found for ${driverName}`);
  //           return null;
  //       }

  //       // Try to find the image within the infobox
  //       const imageTag = infobox.find('img').first();
  //       if (imageTag.length === 0) {
  //           console.log(`No image found in infobox for ${driverName}`);
  //           return null;
  //       }

  //       // Construct the full image URL
  //       const imageSrc = imageTag.attr('src');
  //       const imageUrl = `https:${imageSrc}?width=300`;
        
  //       console.log(`Image found for ${driverName}: ${imageUrl}`);
  //       return imageUrl;

  //   } catch (error) {
  //       console.error(`Error fetching image for ${driverName}:`, error);
  //       return null;
  //   }
  // }
}

export default XMLParser;

