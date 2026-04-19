# Adytum Alchemist Guide

A dark UI tarot initiation app that guides the user from Key 0 to Key 21 with staged ritual prompts, timed meditation, and reflective progression tracking.

## What This Project Does

- Delivers a sequential BOTA-inspired study flow across all 22 major keys
- Uses in-app selectable providers: OpenAI, Ollama Cloud, and Ollama Local
- Enforces a reflection gate before advancing to the next key
- Stores provider config and session progress in local browser storage
- Loads canonical tarot reference data from `public/tarot/info.txt`

## Tech Stack

- Vite + React + TypeScript
- Tailwind-based component styling
- Netlify-ready static deployment (`dist/`)

## Local Development

1. Install dependencies:
   `npm install`
2. Copy environment defaults:
   `cp .env.example .env.local`
3. Run the app:
   `npm run dev`

## Build and Validation

- Type check:
  `npm run lint`
- Production build:
  `npm run build`

## Deployment Notes (Netlify)

- Netlify build command: `npm run build`
- Publish directory: `dist`
- Canonical production domain is configured for:
  `https://adytum-alchemist-guide.nealfrazier.tech/`
- SEO files are included in `public/`:
- `robots.txt` and `sitemap.xml`

## Environment Variables

See `.env.example` for optional variables used by providers.

## Project Structure

- `src/App.tsx`: main UI, provider requests, initiation workflow
- `public/tarot/`: tarot card images and canonical text source
- `index.html`: page metadata, canonical, OG/Twitter tags
- `netlify.toml`: Netlify build + processing configuration

## Author

Neal Frazier
