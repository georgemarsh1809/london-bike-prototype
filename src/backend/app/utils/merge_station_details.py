import json

# Load JSON from files
with open('station_names.json', 'r') as f:
    stations = json.load(f)

with open('stationIdToBorough.json', 'r') as f:
    boroughs = json.load(f)

# Create a lookup dict for boroughs by id
borough_dict = {b['id']: b['borough'] for b in boroughs}

# Merge data
merged = []
for station in stations:
    station_id = station['id']
    merged.append({
        'id': station_id,
        'name': station['name'],
        'borough': borough_dict.get(station_id, None)  # fallback if no match
    })
    
# Write merged data to a new JSON file
with open('merged.json', 'w') as f:
    json.dump(merged, f, indent=2)

print("Merged JSON saved to merged.json")