import json
import geopandas as gpd
from shapely.geometry import Point

# List of official London boroughs (from Wikipedia)
VALID_BOROUGHS = [
    "Barking and Dagenham", "Barnet", "Bexley", "Brent", "Bromley", "Camden",
    "Croydon", "Ealing", "Enfield", "Greenwich", "Hackney", "Hammersmith and Fulham",
    "Haringey", "Harrow", "Havering", "Hillingdon", "Hounslow", "Islington",
    "Kensington and Chelsea", "Kingston upon Thames", "Lambeth", "Lewisham",
    "Merton", "Newham", "Redbridge", "Richmond upon Thames", "Southwark",
    "Sutton", "Tower Hamlets", "Waltham Forest", "Wandsworth", "Westminster",
    "City of London"
]

# Load London borough boundaries
boroughs_gdf = gpd.read_file("London_Borough_Excluding_MHW.shp")
borough_col = "NAME"  # Check this if it varies (e.g. 'NAME', 'NAME_1', etc.)

# Load stations JSON
with open("combined_station_details.json", "r", encoding="utf-8") as f:
    stations = json.load(f)

# Convert to GeoDataFrame
station_points = []
for s in stations:
    if "latitude" in s and "longitude" in s:
        station_points.append({
            "id": s.get("id"),
            "name": s.get("name", "Unknown"),
            "stored_borough": s.get("borough", "Unknown"),
            "geometry": Point(s["longitude"], s["latitude"])
        })
    else:
        print(f"⚠️ Skipping station with missing coordinates: {s}")

stations_gdf = gpd.GeoDataFrame(station_points, geometry="geometry", crs="EPSG:4326")

# Spatial join with borough shapes
joined = gpd.sjoin(stations_gdf, boroughs_gdf.to_crs("EPSG:4326"), predicate="within")

# Check and update mismatches
mismatches = 0
updates = 0
for i, row in joined.iterrows():
    correct_borough = row[borough_col].strip()
    if correct_borough not in VALID_BOROUGHS:
        print(f"⚠️ Skipping unknown borough: '{correct_borough}'")
        continue

    for s in stations:
        if s["id"] == row["id"]:
            if s.get("borough", "").strip().lower() != correct_borough.lower():
                print(f"🔄 ID {s['id']} – '{s['name']}': '{s['borough']}' → '{correct_borough}'")
                s["borough"] = correct_borough
                mismatches += 1
            updates += 1
            break

# Save the updated file
with open("combined_station_details.json", "w", encoding="utf-8") as f:
    json.dump(stations, f, indent=4)

print(f"\n✅ {updates} stations checked. {mismatches} borough(s) updated.")
