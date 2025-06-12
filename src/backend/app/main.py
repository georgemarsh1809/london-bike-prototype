from fastapi import FastAPI, Path
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
from .utils import query_bike_data

app = FastAPI()

# Define a shape for the item using Pydantic.BaseModel
# Think TypeScript for Python... it allows you to define the shape/structure of your data for better validation
class Item(BaseModel):
    name: str
    age: int
    diet: Optional[str] = None # Optional field with default value None

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

@app.get("/test")
def test():
    return {"test"}

@app.get("/")
async def root():
    return {"message": "Hello"}

