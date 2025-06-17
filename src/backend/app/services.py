import json
import os
from pathlib import Path

def get_most_sustainable_borough(top_stations, station_details, borough_populations):
    """
    Returns the borough with the highest number of rides per capita.

    Args:
        top_stations (list): List of dicts with 'station_id' and 'total_rides'.
        station_details (list): List of dicts with 'id' and 'borough'.
        borough_populations (list): List of dicts with 'borough' and 'population_2021'.

    Returns:
        dict: Top borough and its rides per capita value.
    """

    # Map station_id to borough
    station_id_to_borough = {
        station["id"]: station["borough"]
        for station in station_details
    }

    # Aggregate rides by borough
    borough_rides = {}
    for station in top_stations:
        station_id = station["station_id"]
        total_rides = station["total_rides"]
        borough = station_id_to_borough.get(station_id)

        if not borough:
            print(f"Warning: No borough found for station ID {station_id}")
            continue

        borough_rides[borough] = borough_rides.get(borough, 0) + total_rides

    # Map borough to population
    borough_to_population = {
        entry["borough"]: entry["population_2021"]
        for entry in borough_populations
    }

    # Calculate rides per capita
    rides_per_capita = {}
    for borough, rides in borough_rides.items():
        population = borough_to_population.get(borough)
        if not population:
            print(f"Warning: No population found for borough: {borough}")
            continue
        rides_per_capita[borough] = rides / population

    # Find the borough with the highest rate
    max_borough = None
    max_rate = 0
    for borough, rate in rides_per_capita.items():
        if rate > max_rate:
            max_rate = rate
            max_borough = borough

    return {
        "borough": max_borough,
        "rides_per_capita": round(max_rate, 4)
    }

def get_least_sustainable_boroughs(top_stations, station_details, borough_populations):
    """
    Returns the 8 least sustainable boroughs based on ride count per capita.
    
    Args:
        top_stations (list): List of dicts with 'station_id' and 'total_rides'.
        station_details (list): List of dicts with 'id' and 'borough'.
        borough_populations (list): List of dicts with 'borough' and 'population_2021'.
    
    Returns:
        List[dict]: Boroughs with lowest rides per capita, reversed to show 'least bad' first.
    """

    # Map station_id to borough
    station_id_to_borough = {
        station["id"]: station["borough"]
        for station in station_details
    }

    # Aggregate total rides by borough
    borough_rides = {}
    for station in top_stations:
        station_id = station["station_id"]
        total_rides = station["total_rides"]
        borough = station_id_to_borough.get(station_id)
        
        if not borough:
            print(f"Warning: No borough found for station ID {station_id}")
            continue
        
        borough_rides[borough] = borough_rides.get(borough, 0) + total_rides

    # Map borough to population
    borough_to_population = {
        entry["borough"]: entry["population_2021"]
        for entry in borough_populations
    }

    # Calculate rides per capita
    rides_per_capita = {}
    for borough, rides in borough_rides.items():
        population = borough_to_population.get(borough)
        if not population:
            print(f"Warning: No population found for borough: {borough}")
            continue
        rides_per_capita[borough] = round(rides / population, 4)

    # Find the bottom 8 boroughs by rides per capita (least sustainable)
    bottom_8 = sorted(
        [
            {"borough": b, "rate": rate}
            for b, rate in rides_per_capita.items()
            if rate > 0
        ],
        key=lambda x: x["rate"]
    )[:8]

    # Flip to show "least bad" first (like the reversed JS logic)
    return list(reversed(bottom_8))

def load_station_details():
    file_path = Path(__file__).parent / "utils/data" / "station_details.json"
    with file_path.open("r") as file:
        station_details = json.load(file)
    return station_details

def load_borough_populations():
    file_path = Path(__file__).parent / "utils/data" / "borough_populations.json"
    with file_path.open("r") as file:
        borough_populations = json.load(file)
    print("read")
    return borough_populations

load_borough_populations()