from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from .utils import *

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows FastAPI to talk to React over localhost
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Define the endpoints, and the queries (functions) that are run when they're hit

"""
The following end points are for testing purposes only
"""
@app.get("/")
async def root():
    return {"message": "Hello"}

@app.get("/db/test/hires")
async def test():
    data = test_hire_table()
    return data

@app.get("/db/test/stations")
async def test():
    data = test_stations_table()
    return data

"""
UTILITY ENDPOINTS
"""
@app.get("/db/get_min_date")
async def min_date():
    data = get_min_date()
    return data

@app.get("/db/get_max_date")
async def max_date():
    data = get_max_date()
    return data

"""
DATA ENDPOINTS
"""
@app.get("/get_top_stations")
async def top_stations(start_date: str = Query(...), end_date: str = Query(...)):
    data = get_top_stations(start_date, end_date)
    return data

@app.get("/get_stations")
async def get_stations():
    data = get_station_ids_locations()
    return data




