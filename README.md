# SkyRoute: Weather & Travel Planner

A polished Next.js app for a 10-day forecast, nearby attractions, and data-driven "best time to visit" guidance.

## Free data sources
- Open-Meteo Forecast API: 10-day daily forecast, no key.
- Open-Meteo Geocoding API: place-name lookup, no key.
- Open-Meteo Historical Weather API: three-year monthly climate baseline, no key.
- Wikipedia MediaWiki API: nearby geotagged places, descriptions, thumbnails, and links.

Review each provider's attribution, fair-use, and commercial-use terms before production launch.

## Inputs supported
- Place name, for example `Bengaluru`
- Coordinates, for example `12.9716, 77.5946`
- Expanded Google Maps URL containing `@12.9716,77.5946`
- Google Maps URL using `?q=12.9716,77.5946`

Short `maps.app.goo.gl` links cannot be expanded reliably without contacting Google. Open the shared link and paste the expanded URL, or copy its coordinates.

## Local development
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## GitHub
```bash
git init
git add .
git commit -m "Initial weather travel planner"
git branch -M main
git remote add origin https://github.com/YOUR-USER/weather-travel-planner.git
git push -u origin main
```

## Vercel deployment
1. Push this project to GitHub.
2. In Vercel, select **Add New > Project** and import the GitHub repository.
3. Vercel detects Next.js automatically. No environment variables are needed.
4. Select **Deploy**. Subsequent pushes to `main` deploy automatically; pull requests receive preview deployments.

Optional CLI deployment:
```bash
npm i -g vercel
vercel
```

## Architecture
- Browser calls local Next.js route handlers for geocoding, nearby places, and climate history.
- Forecast is read directly from Open-Meteo.
- Slow-changing results use Next.js fetch caching.
- `vercel.json` places server functions in Mumbai (`bom1`); change this to the region nearest your users.

## Important limitations
- Forecasts are probabilistic and may change.
- Wikipedia geosearch returns notable geotagged articles, not a complete tourism catalog or ranking.
- "Best time" is a transparent comfort heuristic, not an official tourism recommendation. It scores months by closeness to 22°C and lower rainfall using the preceding three years.
- Opening hours, closures, visas, fees, safety advisories, and accessibility are outside this app's data sources.

## Production hardening
Add rate limiting (for example Vercel WAF), observability, tests, an explicit privacy policy, local travel advisories, and provider-specific attribution review before a public commercial launch.
