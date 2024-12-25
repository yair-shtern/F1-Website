# F1 Data Tracker - API Documentation

## Overview
This project integrates two primary APIs: OpenF1 and Argast APIs for comprehensive F1 racing data.

## OpenF1 API Endpoints

### Drivers
- **Endpoint**: `/drivers`
- **Method**: GET
- **Description**: Retrieve list of current F1 drivers
- **Response Fields**:
  - `id`: Unique driver identifier
  - `fullName`: Driver's full name
  - `number`: Car number
  - `team`: Current constructor team
  - `nationality`: Driver's nationality

### Race Schedule
- **Endpoint**: `/races`
- **Method**: GET
- **Description**: Retrieve full F1 race calendar
- **Response Fields**:
  - `id`: Unique race identifier
  - `raceName`: Grand Prix name
  - `location`: Circuit location
  - `country`: Host country
  - `date`: Race date
  - `time`: Race time

### Live Timing
- **Endpoint**: `/live-timing/{raceId}`
- **Method**: GET
- **Description**: Real-time race timing data
- **Response Fields**:
  - `driverId`: Driver identifier
  - `position`: Current race position
  - `lastLapTime`: Most recent lap time
  - `gap`: Time difference from leader
  - `topSpeed`: Maximum speed recorded

## Argast API Endpoints

### Team Standings
- **Endpoint**: `/team-standings`
- **Method**: GET
- **Description**: Current constructor championship standings
- **Response Fields**:
  - `id`: Team identifier
  - `name`: Team name
  - `points`: Total championship points
  - `wins`: Number of race wins

### Team Performance
- **Endpoint**: `/team-performance/{teamId}`
- **Method**: GET
- **Description**: Detailed team performance metrics
- **Response Fields**:
  - `averageLapTime`: Team's average lap performance
  - `podiumFinishes`: Total podium finishes
  - `DNFCount`: Number of race retirements

## Authentication
- API calls require authentication token
- Token should be included in `Authorization` header
- Token expires periodically and requires refresh

## Error Handling
- 400: Bad Request
- 401: Unauthorized
- 404: Resource Not Found
- 500: Server Error

## Rate Limiting
- Maximum 100 requests per minute
- Excess requests will result in temporary IP block

## Example Request
```javascript
const fetchDrivers = async () => {
  try {
    const response = await axios.get('/drivers', {
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Request Failed', error);
  }
};
```