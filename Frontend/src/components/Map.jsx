import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ORS_API_KEY = "5b3ce3597851110001cf6248a6ce32b2139b4bbe95a7255d264a2387";

const Map = ({ destination }) => {
  const origin = [26.6520, 92.7956]; // Tezpur fixed origin
  const [destCoords, setDestCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!destination) {
      setDestCoords(null);
      setRouteCoords([]);
      return;
    }

    // Geocode destination to coordinates using Nominatim OpenStreetMap API
    const fetchDestCoords = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            destination
          )}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setDestCoords([parseFloat(lat), parseFloat(lon)]);
        } else {
          setDestCoords(null);
          setRouteCoords([]);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    };

    fetchDestCoords();
  }, [destination]);

  useEffect(() => {
    if (!destCoords) return;

    // Fetch route from OpenRouteService API
    const fetchRoute = async () => {
      try {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${origin[1]},${origin[0]}&end=${destCoords[1]},${destCoords[0]}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.features && data.features.length > 0) {
          const coords = data.features[0].geometry.coordinates;
          // Convert [lng, lat] to [lat, lng]
          const latlngs = coords.map((c) => [c[1], c[0]]);
          setRouteCoords(latlngs);
        } else {
          setRouteCoords([]);
        }
      } catch (err) {
        console.error("Routing error:", err);
      }
    };

    fetchRoute();
  }, [destCoords]);

  return (
    <MapContainer
      center={origin}
      zoom={10}
      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom={true}
      key={destination} // to force rerender on destination change
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={origin}>
        <Popup>Tezpur (Origin)</Popup>
      </Marker>

      {destCoords && (
        <Marker position={destCoords}>
          <Popup>{destination}</Popup>
        </Marker>
      )}

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" weight={4} />
      )}
    </MapContainer>
  );
};

export default Map;
