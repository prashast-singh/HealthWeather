import React, { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Header from "./components/Header";
import LocationForm from "./components/LocationForm";
import WeatherDisplay from "./components/WeatherDisplay";
import Notification from "./components/Notification";
import { getWeatherData } from "./services/weatherService";
import { fetchHealthRisk } from "./services/ragService";
import { WeatherData, HealthRiskResponse } from "./type";

type Profile = {
  firstName: string;
  lastName: string;
  dob: string;
  condition: string;
  medical_information: {
    diagnoses: string[];
    allergies: string[];
    medications: string[];
  };
};

const App = () => {
  const [lat, setLat] = useState(52.520008);
  const [lon, setLon] = useState(13.404954);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [risk, setRisk] = useState<HealthRiskResponse | null>(null);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    if (!onboarded || !profile?.condition) return;

    const fetchAndCheck = async () => {
      setRisk(null);
      const weather = await getWeatherData(lat, lon);
      setWeather(weather);
      const risk = await fetchHealthRisk(weather, profile.condition);
      setRisk(risk);
    };

    fetchAndCheck();
    const interval = setInterval(fetchAndCheck, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon, profile?.condition, onboarded]);

  const handleOnboardingComplete = (info: Profile) => {
    setProfile(info);
    setOnboarded(true);
  };

  if (!onboarded || !profile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // horizontally center
          justifyContent: "center", // vertically center if needed
          paddingTop: "40px", // optional for spacing
          width: "100%",
        }}
      >
        {" "}
        <Header /> <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#222",
      }}
    >
      <Header />

      {/* ✅ Profile Summary */}
      <div
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      >
        <h3>Patient Profile</h3>
        <p>
          <strong>Name:</strong> {profile.firstName} {profile.lastName}
        </p>
        <p>
          <strong>Date of Birth:</strong> {profile.dob}
        </p>
        <h3>Medical Information</h3>
        <p>
          <strong>Diagnoses:</strong>{" "}
          {profile.medical_information.diagnoses.join(", ")}
        </p>
        <p>
          <strong>Allergies:</strong>{" "}
          {profile.medical_information.allergies.length > 0
            ? profile.medical_information.allergies.join(", ")
            : "None"}
        </p>
        <p>
          <strong>Medications:</strong>{" "}
          {profile.medical_information.medications.length > 0
            ? profile.medical_information.medications.join(", ")
            : "None"}
        </p>
      </div>

      <LocationForm lat={lat} lon={lon} setLat={setLat} setLon={setLon} />

      {weather && <WeatherDisplay weather={weather} />}

      {risk && (
        <Notification
          risk={risk}
          type={risk.risk_found === "true" ? "risk" : "safe"}
        />
      )}

      {weather && !risk && (
        <p style={{ color: "#888", marginTop: "15px" }}>
          Checking for health risks...
        </p>
      )}
    </div>
  );
};

export default App;
