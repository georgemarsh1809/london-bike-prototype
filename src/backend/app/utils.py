from google.cloud import bigquery
from dotenv import load_dotenv
import pandas as pd
import json


load_dotenv()

client = bigquery.Client() 

# Test retrieval of data from hire table
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

# Test retrieval of data from stations table
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
    UTILITY FUNCTIONS
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



"""
    DATA FUNCTIONS
"""
def get_top_stations(start_date: str, end_date: str):
    # query = f"""
    # SELECT *
    # FROM `bigquery-public-data.london_bicycles.cycle_hire`
    # WHERE start_date > "{start_date}" AND end_date < "{end_date}"
    # LIMIT 10
    # """ 
    query = f"""
        WITH start_counts AS (
    SELECT start_station_name AS station_name, COUNT(*) AS start_rides
    FROM `bigquery-public-data.london_bicycles.cycle_hire`
    WHERE start_station_name IS NOT NULL AND start_date > "{start_date}" AND end_date < "{end_date}"
    GROUP BY start_station_name
    ),
    end_counts AS (
    SELECT end_station_name AS station_name, COUNT(*) AS end_rides
    FROM `bigquery-public-data.london_bicycles.cycle_hire`
    WHERE end_station_name IS NOT NULL AND start_date > "{start_date}" AND end_date < "{end_date}"
    GROUP BY end_station_name
    )
    SELECT
    COALESCE(sc.station_name, ec.station_name) AS station_name,
    COALESCE(sc.start_rides, 0) + COALESCE(ec.end_rides, 0) AS total_rides
    FROM start_counts sc
    FULL OUTER JOIN end_counts ec
    ON sc.station_name = ec.station_name
    ORDER BY total_rides DESC
    LIMIT 100;
    """
    

    query_job = client.query(query)

    response = query_job.to_dataframe().to_dict(orient="records")
    return response


