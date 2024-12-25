# F1 Data Tracker

## Overview
F1 Data Tracker is a comprehensive web application that provides real-time insights and analysis of Formula 1 racing data using OpenF1 and Argast APIs.

## Features
- Live race timing
- Driver performance metrics
- Team standings
- Race schedule
- Detailed race results

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/f1-data-tracker.git
   cd f1-data-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```

## Running the Application
- Development Mode: `npm run dev`
- Production Build: `npm run build`
- Preview Build: `npm run preview`

## API Configuration
Create a `.env` file in the root directory with:
```
VITE_OPENF1_API_BASE_URL=https://api.openf1.org
VITE_ARGAST_API_BASE_URL=https://api.argast.com
```

## Testing
Run tests with: `npm test`

## Technologies
- React
- Vite
- Tailwind CSS
- Recharts
- Axios

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
