from google.cloud import bigquery
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

def query_bike_data():
    client = bigquery.Client()  # Will auto-use the creds from the env var

    query = """
    SELECT 
        *
    FROM 
        `bigquery-public-data.london_bicycles.cycle_stations`
    LIMIT 1
    
    """
    query_job = client.query(query)
    df = query_job.to_dataframe()
    return df.to_dict(orient="records")