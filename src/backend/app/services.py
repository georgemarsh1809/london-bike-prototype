import json
from pathlib import Path
import math
from collections import defaultdict

"""
--------------
    UTILITY
--------------
"""

def load_station_details():
    file_path = Path(__file__).parent / "utils/data" / "station_details.json"
    with file_path.open("r") as file:
        station_details = json.load(file)
    return station_details

def load_borough_populations():
    file_path = Path(__file__).parent / "utils/data" / "borough_populations.json"
    with file_path.open("r") as file:
        borough_populations = json.load(file)
    return borough_populations

def load_station_coords():
    file_path = Path(__file__).parent / "utils/data" / "station_coords.json"
    with file_path.open("r") as file:
        station_coords = json.load(file)
    return station_coords

"""
--------------------
    DATA QUERIES
--------------------
"""

def get_most_sustainable_borough(top_stations, station_details, borough_populations, ignoreCityOfLondon):
    """
    Returns the borough with the highest number of rides per capita.
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

    sorted_array = sorted(
        [{'borough': k, 'rate': v} for k, v in rides_per_capita.items()],
        key=lambda x: x['rate'],
        reverse=True
    )

    # Ignore "City of London" if it's first and should be ignored
    if ignoreCityOfLondon and sorted_array and sorted_array[0]['borough'] == 'City of London':
        sorted_array.pop(0)

    return sorted_array

def get_least_sustainable_boroughs(top_stations, station_details, borough_populations):
    """
    Returns the 8 least sustainable boroughs based on ride count per capita.
    
    Args:
        top_stations (list): List of dicts with 'station_id' and 'total_rides'.
        station_details (list): List of dicts with 'id' and 'borough'.
        borough_populations (list): List of dicts with 'borough' and 'population_2021'.
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

def get_hot_spots(ordered_stations, station_details, station_coords, top_n=10):
    # Create lookup dictionaries for fast access
    id_to_name = {station["id"]: station["name"] for station in station_details}
    id_to_coords = {station["id"]: (station["latitude"], station["longitude"]) for station in station_coords}

    # Prepare results
    top_stations_info = []

    for entry in ordered_stations[:top_n]:
        station_id = entry["station_id"]
        total_rides = entry["total_rides"]
        name = id_to_name.get(station_id, "Unknown")
        lat, lon = id_to_coords.get(station_id, (None, None))

        top_stations_info.append({
            "name": name,
            "total_rides": total_rides,
            "latitude": lat,
            "longitude": lon
        })

    return top_stations_info

def get_CO2_offset(duration_in_seconds):
    # ASSUMPTIONS:
    # Avg cycling speed in London = ~15 km/h (4.17 m/s)
    # Avg emissions: 171 grams / 0.171kg CO² per km (for a car)

    AVG_CYCLING_SPEED = 4.17 # m/s
    AVG_EMISSIONS = 0.171 # kg/km

    # S = D / T → D = S * T
    estimated_distance_m = AVG_CYCLING_SPEED * duration_in_seconds # meters
    estimated_distance_km = int(estimated_distance_m / 1000) # kilometers 
    amount_of_CO2_saved = int(estimated_distance_km * AVG_EMISSIONS) # kg

    data = [amount_of_CO2_saved, estimated_distance_km]

    return (data)

def calculate_tree_equivalent(co2_amount):
    # ASSUMPTIONS
    # Avg CO² absorption rate for 1 tree = 21 kg / year
    ABSORPTION_RATE = 21
    tree_equivalent = int(co2_amount) / ABSORPTION_RATE

    return math.floor(tree_equivalent)

def get_boroughs_by_biggest_change(station_details, usage_data):
    # Create a mapping of station_id to borough
    station_id_to_borough = {station["id"]: station["borough"] for station in station_details}

    # Aggregate usage per borough
    borough_usage = defaultdict(lambda: {"starting_avg": 0, "ending_avg": 0, "count": 0})

    for record in usage_data:
        station_id = record["station_id"]
        if station_id in station_id_to_borough:
            borough = station_id_to_borough[station_id]
            borough_usage[borough]["starting_avg"] += record["starting_period_avg"]
            borough_usage[borough]["ending_avg"] += record["ending_period_avg"]
            borough_usage[borough]["count"] += 1

    # Create the list with actual and displayed percentage change
    borough_changes = []
    for borough, data in borough_usage.items():
        start = max(data["starting_avg"], 1)  # Avoid division by zero
        end = max(data["ending_avg"], 1)

        pct_change = round(((end - start) / start) * 100, 2)

        borough_changes.append({
            "borough": borough,
            "starting_avg": round(data["starting_avg"], 2),
            "ending_avg": round(data["ending_avg"], 2),
            "actual_pct_change": pct_change,
            "pct_change": 100 if abs(pct_change) > 100 else pct_change
        })

    # Sort by absolute percentage change descending
    borough_changes.sort(key=lambda x: abs(x["actual_pct_change"]), reverse=True)

    return borough_changes[:8]

