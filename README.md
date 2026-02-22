# EquityMap

**BisonHacks 2026 — Leveraging AI for Truth & Service**

EquityMap is an AI-powered geospatial platform that helps Washington, D.C. residents navigate food assistance, healthcare, and community resources. Built during the 11th Annual Howard University Hackathon, the platform addresses the growing "Access Gap" by mapping verified SNAP retailers and primary care facilities across the District, with a focus on underserved communities in Wards 7 and 8.

## The Problem

Federal budget changes in 2026 have introduced stricter eligibility requirements for SNAP and Medicaid, disproportionately impacting residents in D.C.'s eastern wards. New work requirements (80 hours/month), tightened income thresholds, and reduced funding for community health programs have created "Benefit Deserts" — areas where residents struggle to locate and access the resources they need.

## Our Solution

EquityMap provides three core layers:

### 1. Resource Map (Service Layer)
An interactive Leaflet.js map displaying **450+ verified resource locations** across all of D.C., loaded from real government datasets:
- **SNAP Retailers** (green markers) — Supermarkets, grocery stores, farmers' markets, convenience stores, and specialty food shops authorized to accept EBT
- **Primary Care Facilities** (red markers) — Community health centers, clinics, and FQHCs with real data on services, hours, languages, and insurance accepted

Users can filter by **Accepts EBT**, **Accepts Medicaid**, and **Walk-ins OK** to find exactly what they need. Each location includes a **Get Directions** link (Google Maps) and a **Details** panel with educational context and facility-specific information.

### 2. EquityGuide (Truth Layer)
An AI-powered chat assistant that helps residents understand policy changes and navigate benefit eligibility. Built with Google's Generative AI API (Gemma 3), EquityGuide:
- Explains the 80-hour work requirement and qualifying activities
- Reminds Howard students that Federal Work-Study counts toward SNAP eligibility
- Provides empathetic, factual guidance on SNAP, Medicaid, and local resources
- Falls back to curated responses if the AI service is unavailable

### 3. Community Contributions
A multi-step contribution flow allowing community members to submit new resource locations with AI-assisted verification, supporting a crowd-sourced approach to keeping the map current.

## Data Sources

| Dataset | Source | Records |
|---------|--------|---------|
| DC Active SNAP Retailers 2026 | USDA Food & Nutrition Service | ~400 locations |
| Primary Care Facilities | DC GIS / Department of Health | ~50 facilities |
| ACS 5-Year Economic Characteristics | U.S. Census Bureau | 200+ census tracts |

All data is loaded client-side from static CSVs using PapaParse. Health facility coordinates are converted from Web Mercator (EPSG:3857) to WGS84 lat/lng.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui (Radix primitives) |
| Map | Leaflet.js, react-leaflet, CartoDB Positron tiles |
| AI | Google Generative AI API (Gemma 3 4B) |
| Data | PapaParse (CSV parsing), static datasets |
| Icons | Lucide React |

## Getting Started

### Prerequisites
- Node.js 18+
- A Google AI Studio API key ([aistudio.google.com](https://aistudio.google.com))

### Setup

```bash
git clone https://github.com/your-repo/EquityMap.git
cd EquityMap
npm install
```

Create a `.env` file in the project root:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

### Run

```bash
npm run dev
```

Open localhost:8080 in your browser.

### Build

```bash
npm run build
```
## Theme Alignment

**Leveraging AI for Truth & Service:**
- **Truth** — EquityGuide translates complex federal policy into plain-language guidance, helping residents understand how budget changes affect their benefits
- **Service** — The resource map connects communities to verified food and healthcare access points, with real facility data (hours, phone, services, languages) pulled directly from government datasets

## License

MIT
