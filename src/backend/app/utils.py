from google.cloud import bigquery
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

client = bigquery.Client() 

# Test retrieval of data from hire table
def test_hire_table():
    query = """
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
    
    # Run the query on the client connection
    query_job = client.query(query)

    # Convert the response to JSON with .to_dataframe()    
    # Return the JSON as the response to the call
    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def get_min_date():
    query = """
    SELECT 
        MIN(start_date)
    FROM `bigquery-public-data.london_bicycles.cycle_hire` 
    """
    
    # Run the query on the client connection
    query_job = client.query(query)

    # Convert the response to JSON with .to_dataframe()    
    # Return the JSON as the response to the call
    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def get_max_date():
    query = """
    SELECT 
        MAX(end_date)
    FROM `bigquery-public-data.london_bicycles.cycle_hire` 
    """
    
    # Run the query on the client connection
    query_job = client.query(query)

    # Convert the response to JSON with .to_dataframe()    
    # Return the JSON as the response to the call
    response = query_job.to_dataframe().to_dict(orient="records")
    return response

def query_station_data():
    # get longitude and latitude of each station
    # use geopy.geocoders to convert coords of each station to its relevant borough, and save it in another JSON for reference
    return None
