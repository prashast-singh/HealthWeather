import React, { useState } from "react";

interface Props {
  lat: number;
  lon: number;
  setLat: (val: number) => void;
  setLon: (val: number) => void;
}

const API_KEY = ""; // Replace with your OpenCage API key

export default function LocationForm({ lat, lon, setLat, setLon }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= -90 && value <= 90) {
      setLat(value);
    }
  };

  const handleLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= -180 && value <= 180) {
      setLon(value);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${e.target.value}&key=${API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data.results);
      } catch (err) {
        setError("Error fetching location data.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLocationSelect = (location: any) => {
    const { lat, lng } = location.geometry;
    setLat(lat);
    setLon(lng);
    setSearchQuery(location.formatted); // Set the search query to the selected location
    setSuggestions([]); // Clear suggestions after selecting a location
  };

  const handleUseCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
          setLoading(false);
        },
        (err) => {
          setError("Unable to fetch location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#eef6ff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>📍 Enter Location</h3>

      <div>
        <label>Search for Location</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="e.g., Berlin"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        {loading && <p>Loading...</p>}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            <strong>{error}</strong>
          </div>
        )}

        {suggestions.length > 0 && (
          <ul
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              marginTop: "10px",
              padding: "0",
              listStyleType: "none",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {suggestions.map((location, index) => (
              <li
                key={index}
                onClick={() => handleLocationSelect(location)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {location.formatted}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: "flex", gap: "50px", marginTop: "20px" }}>
        <div>
          <label>Latitude</label>
          <input
            type="number"
            min={-90}
            max={90}
            value={lat}
            onChange={handleLatChange}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </div>
        <div>
          <label>Longitude</label>
          <input
            type="number"
            min={-180}
            max={180}
            value={lon}
            onChange={handleLonChange}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </div>
      </div>

      <button
        onClick={handleUseCurrentLocation}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
        disabled={loading}
      >
        {loading ? "Locating..." : "Use Current Location"}
      </button>
    </div>
  );
}
