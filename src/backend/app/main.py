from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .utils import *

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows all origins, adjust as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods, adjust as needed
    allow_headers=["*"],  # Allows all headers, adjust as needed
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



