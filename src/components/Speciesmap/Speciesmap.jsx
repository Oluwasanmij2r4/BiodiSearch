import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

const SpeciesMap = ({ taxonKey }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchOccurrences = async () => {
      try {
        const res = await fetch(
          `https://api.gbif.org/v1/occurrence/search?taxon_key=${taxonKey}&limit=100`
        );
        const data = await res.json();

        const coords = data.results
          .filter((o) => o.decimalLatitude && o.decimalLongitude)
          .map((o) => ({
            lat: o.decimalLatitude,
            lng: o.decimalLongitude,
            country: o.country || "Unknown",
          }));

        setLocations(coords);
      } catch (err) {
        console.error("Error loading occurrences:", err);
      }
    };

    fetchOccurrences();
  }, [taxonKey]);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locations.map((loc, index) => (
        <Marker
          key={index}
          position={[loc.lat, loc.lng]}
          icon={L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        >
          <Tooltip
            direction="top"
            offset={[0, -10]}
            opacity={1}
            permanent={false}
          >
            Observed in: {loc.country}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SpeciesMap;
