## Summary
This is a full-stack data visualisation platform I built with React.js and FastAPI.
It analyses the london-city-bikes data set stored in Google Cloud Platform, and generates valuable and actionable insights.
I chose the narrative of Sustainable Travel in London, since it's something I feel really passionate about and has a real-world impact.

Features include:
- "Most Sustainable Borough 🏆" (rides/capita)
- "Top Hot Spots 🔥" (busiest stations)
- "Carbon Offset Calculator 🌳"
- "% Change in Usage vs Time ⏱️"( per borough)
- "Least Sustainable Borough 📊"(rides/capita)

  The app also contains a dynamic filter feature which allows you to change the start and end dates of the period of data to be visuliased. 

## Prerequisites

-   Node
-   FastAPI

## To Run:

### (On George's machine)

`nrd & uvr ` (from /src in the CLI), or more explicitly:

-   `npm run dev`
-   `uvicorn backend.app.main:app --reload`

## Front End

#### 🔥 React + Vite

#### 🌐 Zustand

#### 📊 Recharts

#### 🗺️ Leaflets

## Back End

#### 🔌 FastAPI

#### 🔍 BigQuery
