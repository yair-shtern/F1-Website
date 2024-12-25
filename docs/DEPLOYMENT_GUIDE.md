# F1 Data Tracker - Deployment Guide

## Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)
- Git

## Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/f1-data-tracker.git
cd f1-data-tracker
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables
```
VITE_OPENF1_API_BASE_URL=https://api.openf1.org
VITE_ARGAST_API_BASE_URL=https://api.argast.com
VITE_API_TOKEN=your_api_token
```

5. Run development server
```bash
npm run dev
```

## Production Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Vercel will automatically deploy on main branch push

### Netlify Deployment
1. Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy via Netlify CLI
```bash
npm install netlify-cli -g
netlify deploy
```

## Docker Deployment

1. Build Docker image
```bash
docker build -t f1-data-tracker .
```

2. Run Docker container
```bash
docker run -p 3000:3000 f1-data-tracker
```

## Performance Optimization
- Enable production build: `npm run build`
- Use code splitting
- Implement lazy loading for components

## Monitoring
- Set up logging with Sentry
- Implement error tracking
- Monitor API request performance

## Continuous Integration
- Configure GitHub Actions for:
  - Automated testing
  - Linting
  - Build verification

## Security Recommendations
- Regularly update dependencies
- Use environment variable management
- Implement rate limiting on client-side API calls