import json
import os

# Load JSON data from file
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, "_station_details_backup.json")

with open(json_path, "r") as f:
    station_details = json.load(f)

# Extract unique boroughs
unique_boroughs = {entry["borough"] for entry in station_details}

# Output results
print(f"Number of unique boroughs: {len(unique_boroughs)}")
print("Boroughs:", sorted(unique_boroughs))

