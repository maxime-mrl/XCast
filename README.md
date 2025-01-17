# XCast - paragliding weather app 🌤️

## What is it?

XCast is a weather app that aims to allow detailed multi-model weather comparison for thermals, and altitude winds.

## Why?

Currently the big weather sources for paragliding (at least in Europe) are the excellent [Meteo parapente](www.meteo-parapente.com) and [Windy](www.windy.com) 
- Meteo-parapente gives precise forecast for multiple heights,
- Windy allows to see different models, but mostly at ground level.

✨ The goal of this app is to combine the best of both worlds, and allow to see the forecast for different models at multiple heights.

## Table of Contents

- [XCast - paragliding weather app 🌤️](#xcast---paragliding-weather-app-️)
  - [What is it?](#what-is-it)
  - [Why?](#why)
  - [Table of Contents](#table-of-contents)
  - [technologies](#technologies)
  - [Timeline](#timeline)
  - [Installation](#installation)
  - [Development Usage](#development-usage)

## technologies

XCast is made with MERN stack and also uses:
- Socket.io for real-time communication ⚡
- Leaflet and leaflet-geotiff to display wonderful maps 🗺️
- zustand for state management 🧠
- chroma-js for color scale 🌈
- fontawesome for icons 🎨

## Timeline

For now the project is in early development - there is no real weather data.

The goal is to create a backend to get and parse grib data before this summer. While working on it, it will be in a separate repository.

The last part to improve this frontend should be a bit (a lot) of optimization to get rid of unnecessary rerender. But it should already work directly with a fully fledged backend.

## Installation

In both `frontend` and `backend` directories, install the necessary dependencies:

```bash
npm install
```

Then create the `.env` file following the structure of the example `.env~`.

⚠️ there are two `.env` files, one in the `frontend`, and one in the `backend`.

**For backend only:**

Add fake data to the public folder: (any geotiff file and a json file for details). *Both sample files are available in the root of public directory*

It should follow this architecture:

```
public
├── map
│   ├── [model names] (you can put as many model as you want, the available time and data inside should be the same for all models)
│   │   ├── [ISO dates (YYYY-MM-DDTHH_MMZ)]
│   │   │   ├── [data type (temp, wind, ...)]
│   │   │   │   ├── [type]-[level].tiff
│   │   │   │   ├── ...
│   │   │   ├── ...
│   │   ├── ...
│   ├── ...
├── data
│   ├── arome_fake_data.json (generated with json_generator.js)
```

## Development Usage

Frontend and backend are separated, so you can run them independently with the same command:

```bash
cd backend
npm start # or execute index.ts the way you like
```

and

```bash
cd frontend
npm start
```
