import React from "react";

const options = [
  "Heart Failure",
  "Asthma",
  "Chronic Obstructive Pulmonary Disease",
  "Preeclampsia",
];

export default function HealthSelector({
  condition,
  setCondition,
}: {
  condition: string;
  setCondition: (val: string) => void;
}) {
  return (
    <div
      style={{
        background: "#fef7e5",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <label style={{ fontWeight: "bold" }}>
        🩺 Select Health Condition:
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
