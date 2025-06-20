from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from .server import *
from .services import *

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows FastAPI to talk to React over localhost
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

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
@app.get("/get_all_stations")
async def top_stations(start_date: str = Query(...), end_date: str = Query(...)):
    data = get_ordered_stations(start_date, end_date)
    return data

@app.get("/db/most_sustainable_borough")
async def most_sustainable(start_date: str = Query(...), end_date: str = Query(...), ignoreCityOfLondon: bool = Query(...)):
    ordered_stations = get_ordered_stations(start_date, end_date)
    station_details = load_station_details()
    borough_populations = load_borough_populations()

    data = get_most_sustainable_borough(ordered_stations, station_details, borough_populations, ignoreCityOfLondon)

    return data

@app.get("/db/least_sustainable_boroughs")
async def least_sustainable(start_date: str = Query(...), end_date: str = Query(...)):
    ordered_stations = get_ordered_stations(start_date, end_date)
    station_details = load_station_details()
    borough_populations = load_borough_populations()

    data = get_least_sustainable_boroughs(ordered_stations, station_details, borough_populations)
    return data

@app.get("/db/hot_spots")
async def hot_spots(start_date: str = Query(...), end_date: str = Query(...)):
    ordered_stations = get_ordered_stations(start_date, end_date)
    station_details = load_station_details()
    station_coords = load_station_coords()

    data = get_hot_spots(ordered_stations, station_details, station_coords)
    return data

@app.get("/db/CO2_offset")
async def CO2_offset(start_date: str = Query(...), end_date: str = Query(...)):
    # Res from API Call:
    duration_in_seconds = get_cycling_duration(start_date, end_date)[0]["duration"]
    # Transform into meaning (Carbon offset):
    co2_amount = get_CO2_offset(duration_in_seconds)[0]
    estimated_distanced_km = get_CO2_offset(duration_in_seconds)[1]
    tree_equivalent = calculate_tree_equivalent(co2_amount)

    data = [co2_amount, tree_equivalent, estimated_distanced_km]

    return data

@app.get("/db/change_in_usage")
async def change_in_usage(start_date: str = Query(...), end_date: str = Query(...)):
    data = get_change_in_monthly_average_use_foreach_station(start_date, end_date)
    """
        Raw data returned in the following format:
        0: {station_id: 1, starting_period_avg: 571.67, ending_period_avg: 332.33}
        1: {station_id: 2, starting_period_avg: 668.67, ending_period_avg: 913.33}
        2: {station_id: 3, starting_period_avg: 1078.67, ending_period_avg: 449}
        ...
        Now, use a custom backend service to calculate boroughs with the biggest change in usage
    """
    station_details = load_station_details()    
    boroughs = get_boroughs_by_biggest_change(station_details, data)

    return boroughs


