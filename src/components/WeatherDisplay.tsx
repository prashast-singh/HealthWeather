import React from "react";
import { WeatherData } from "../type";

export default function WeatherDisplay({ weather }: { weather: WeatherData }) {
  return (
    <div
      style={{
        background: "#f0f4ff",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "100%",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginBottom: "16px", color: "#333" }}>
        🌤️ Current Weather
      </h3>
      <div style={{ display: "grid", rowGap: "10px", color: "#555" }}>
        <p>
          🌡️ <strong>Temperature:</strong> {weather.temperature}°C
        </p>
        <p>
          💧 <strong>Humidity:</strong> {weather.humidity}%
        </p>
        <p>
          🌫️ <strong>PM2.5:</strong> {weather.pm25} µg/m³
        </p>
        <p>
          🌀 <strong>Ozone:</strong> {weather.ozone} µg/m³
        </p>
        <p>
          📊 <strong>AQI:</strong> {weather.aqi}
        </p>
        <p>
          ⏲️ <strong>Pressure Drop:</strong> {weather.pressureDrop} hPa
        </p>
        <p>
          🤧 <strong>Birch Pollen:</strong> {weather.birchPollen} Grains/m³
        </p>
        <p>
          🤧 <strong>Grass Pollen:</strong> {weather.grassPollen} Grains/m³
        </p>
        <p>
          🤧 <strong>Mugwort Pollen:</strong> {weather.mugwortPollen} Grains/m³
        </p>
        <p>
          🤧 <strong>Alder Pollen:</strong> {weather.alderPollen} Grains/m³
        </p>
        <p>
          🤧 <strong>Ragweed Pollen:</strong> {weather.ragweedPollen} Grains/m³
        </p>
      </div>
    </div>
  );
}
