import json
from geopy.geocoders import Nominatim
import time

# Load the JSON file
with open("station_locations.json", "r") as f:
    input_data = json.load(f)

geolocator = Nominatim(user_agent="bike_app")

results = []

for item in input_data:
    coords = f"{item['latitude']}, {item['longitude']}"
    try:
        location = geolocator.reverse(coords)
        if location and location.raw.get("address"):
            address = location.raw["address"]
            borough = (
                address.get("borough") or
                address.get("city_district") or
                address.get("suburb") or
                address.get("neighbourhood") or
                "Unknown"
            )
        else:
            borough = "Unknown"
    except Exception as e:
        print(f"Error geocoding {coords}: {e}")
        borough = "Unknown"
    results.append({"id": item["id"], "borough": borough})
    print({"id": item["id"], "borough": borough})

    # Nominatim usage policy (1 request per second)
    time.sleep(1)

# Save results
with open("stationIdToBorough.json", "w") as f:
    json.dump(results, f, indent=2)