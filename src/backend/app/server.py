from google.cloud import bigquery
from dotenv import load_dotenv
import pandas as pd
import json
import os

load_dotenv()

client = bigquery.Client() 

"""
    CONNECTION TEST 
"""

def test_hire_table():
    query = """`
    SELECT 
        *
    FROM `bigquery-public-data.london_bicycles.cycle_hire` 
    LIMIT 1
    """
    
    # Run the query on the client connection
    query_job = client.query(query)

    # Convert the response to JSON with .to_dataframe()    
    # Return the JSON as the response to the call
    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def test_stations_table():
    query = """
    SELECT 
        *
    FROM `bigquery-public-data.london_bicycles.cycle_stations` 
    LIMIT 1
    """
    
    query_job = client.query(query)

    response = query_job.to_dataframe().to_dict(orient="records")
    return response

"""
    UTILITY 
"""

def get_min_date():
    query = """
    SELECT 
        MIN(start_date) as min_date
    FROM `bigquery-public-data.london_bicycles.cycle_hire` 
    """
    
    query_job = client.query(query)

    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def get_max_date():
    query = """
    SELECT 
        MAX(end_date) as max_date
    FROM `bigquery-public-data.london_bicycles.cycle_hire` 
    """
    
    query_job = client.query(query)

    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def get_station_ids_locations():
    query = """
    SELECT id, latitude, longitude
    FROM `bigquery-public-data.london_bicycles.cycle_stations`
    ORDER BY id
    """
    
    query_job = client.query(query)

    # Save the response in a JSON
    response = query_job.to_dataframe().to_json("station_locations.json", orient="records", indent=2)
    return response

def find_missing_station_ids():
    # Load local station names from JSON
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "station_details.json")

    with open(json_path, "r") as f:
        station_details = json.load(f)

    known_ids = set(s["id"] for s in station_details if s["id"] is not None)

    client = bigquery.Client()

    # Query for all unique station IDs from start and end
    query = """
        SELECT DISTINCT start_station_id AS id
        FROM `bigquery-public-data.london_bicycles.cycle_hire`
        WHERE start_station_id IS NOT NULL
        UNION DISTINCT
        SELECT DISTINCT end_station_id AS id
        FROM `bigquery-public-data.london_bicycles.cycle_hire`
        WHERE end_station_id IS NOT NULL
    """

    query_job = client.query(query)
    results = query_job.result()

    missing_ids = set()

    for row in results:
        if row.id not in known_ids:
            missing_ids.add(row.id)

    print(f"✅ Found {len(missing_ids)} missing station IDs.")
    print("🕵️‍♂️ Missing IDs:")
    for id_ in sorted(missing_ids):
        print(f"- {id_}")
    print(len(station_details))

    response = None
    return response

"""
    QUERIES
"""

def get_ordered_stations(start_date: str, end_date: str):
    """
    This query is designed to return the bike stations in London 
    based on the total number of rides starting OR ending at each station, 
    during the specified date range
    """

    query = f"""
    WITH start_counts AS (
    SELECT start_station_id AS station_id, COUNT(*) AS start_rides
    FROM `bigquery-public-data.london_bicycles.cycle_hire`
    WHERE start_station_id IS NOT NULL 
    AND start_date > "{start_date}" AND end_date < "{end_date}"
    AND (start_station_id < 876 OR end_station_id < 876)
    GROUP BY start_station_id
    ),
    end_counts AS (
    SELECT end_station_id AS station_id, COUNT(*) AS end_rides
    FROM `bigquery-public-data.london_bicycles.cycle_hire`
    WHERE end_station_id IS NOT NULL 
    AND start_date > "{start_date}" AND end_date < "{end_date}"
    AND start_station_id < 876 AND end_station_id < 876
    GROUP BY end_station_id
    )
    SELECT
    COALESCE(sc.station_id, ec.station_id) AS station_id,
    COALESCE(sc.start_rides, 0) + COALESCE(ec.end_rides, 0) AS total_rides
    FROM start_counts sc
    FULL OUTER JOIN end_counts ec
    ON sc.station_id = ec.station_id
    ORDER BY total_rides DESC;
    """

    """
        MAYBE CHANGE TO JUST RIDE STARTS, NOT STARTS AND ENDS
    """

    query_job = client.query(query)

    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def get_cycling_duration(start_date: str, end_date: str):
    """
    This query returns the cycling duration in seconds of all rides between
    the specified start and end dates 
    """

    query = f"""
    SELECT COUNT(duration) as duration
    FROM `bigquery-public-data.london_bicycles.cycle_hire` 
    WHERE start_station_id < 876 AND end_station_id < 876
    AND start_date > "{start_date}" AND end_date < "{end_date}" 
    """

    query_job = client.query(query)

    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def get_number_of_trips(start_date: str, end_date: str):
    """
    This query simply returns the number of trips between the specified start and end date
    """

    query = f"""
    SELECT COUNT(*)
    FROM `bigquery-public-data.london_bicycles.cycle_hire` 
    WHERE start_date > "{start_date}" AND end_date < "{end_date}" 
    """

    query_job = client.query(query)

    response = query_job.to_dataframe().to_dict(orient="records")
    return response
