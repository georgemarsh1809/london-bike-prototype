import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const HotSpotsMap = ({ stations }) => {
    const londonCentre = [51.5074, -0.1278]; // Central London fallback

    return (
        <>
            <MapContainer
                center={londonCentre}
                zoom={12}
                style={{
                    height: '500px',
                    width: '99%',
                    borderRadius: 8,
                    border: 'solid 3px rgb(66, 98, 62)',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
                    marginRight: 5,
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {stations?.map((station, index) => (
                    <Marker
                        key={index}
                        position={[station.latitude, station.longitude]}
                    >
                        <Tooltip>
                            <strong>
                                {index + 1}. {station.name}
                            </strong>
                            <br />
                            🚲 {station.total_rides.toLocaleString()} rides
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
        </>
    );
};
