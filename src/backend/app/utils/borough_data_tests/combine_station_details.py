import json

# Load the first JSON file (coordinates)
with open('station_coords.json', 'r', encoding='utf-8') as f:
    coords = json.load(f)

# Load the second JSON file (details)
with open('_station_details.json', 'r', encoding='utf-8') as f:
    details = json.load(f)

# Create a dict for quick lookup of details by id
details_by_id = {entry['id']: entry for entry in details}

# Merge records based on 'id'
combined = []
for coord in coords:
    station_id = coord['id']
    detail = details_by_id.get(station_id, {})
    
    merged_entry = {
        **coord,               
        **{k: v for k, v in detail.items() if k != 'id'}  
    }
    combined.append(merged_entry)

# Save combined data to new JSON file
with open('combined_station_details.json', 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=4)

print(f"Combined {len(combined)} stations into combined_station_details.json")
