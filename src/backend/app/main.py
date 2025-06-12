from fastapi import FastAPI, Path
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel

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

inventories = {
    
}

@app.get("/")
async def root():
    return {"message": "Hello"}

# Playing with Path parameters
@app.get("/hello/{name}")
async def hello(name: str):
    # Data can be take out of the URL using Path parameters, which are defined in the function signature
    # If the name is not provided, a 'type:missing' error will be raised
    return {"message": f"Hello, {name}!"}

@app.get("/get-inventory/{inventory_id}")
# Retrieve an inventory item by its ID - the ID must be an integer greater than 0 and less than 2
# The description parameter provides additional information about the path parameter for documentation purposes
async def get_inventory(inventory_id: int = Path(description="The ID of the inventory to retrieve", lt=2, gt=0)):
    return inventories[inventory_id]

# Playing with Query parameters
@app.get("/get-by-age")
async def get_by_age(age: int):
    # if age is not provided in the URL (i.e. ...?age=24 ), a 'type:missing' error will be raised
    results = [item for item in inventories.values() if item["age"] == age]
    if results:
        return results
    return {"error": "No items found with the specified age"}

@app.get("/get-by-name")
async def get_by_name(name: str = None):
    for item in inventories:
        if inventories[item].name == name:
            return inventories[item]
    return {"error": "Name not found in inventory"}


# Playing with Request Body
@app.post("/create-item{item_id}")
async def create_item(item_id: int, item: Item):
    if item_id in inventories:
        return {"error": "Item with this ID already exists"}
    else:
        inventories[item_id] = item

