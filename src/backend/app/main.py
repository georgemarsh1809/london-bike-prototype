from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .utils import query_bike_data

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows all origins, adjust as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods, adjust as needed
    allow_headers=["*"],  # Allows all headers, adjust as needed
)

@app.get("/db/test")
async def get_bike_data():
    data = query_bike_data()
    return data


@app.get("/")
async def root():
    return {"message": "Hello"}

