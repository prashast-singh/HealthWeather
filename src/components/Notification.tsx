import React from "react";
import { HealthRiskResponse } from "../type";

interface Props {
  risk: HealthRiskResponse;
  type?: "risk" | "safe";
}

export default function Notification({ risk, type = "risk" }: Props) {
  const isRisk = type === "risk";

  return (
    <div
      style={{
        backgroundColor: isRisk ? "#ffe1e1" : "#e1ffe1",
        padding: "15px",
        marginTop: "20px",
        border: `1px solid ${isRisk ? "#ff4d4d" : "#4dff4d"}`,
        borderRadius: "10px",
        color: isRisk ? "#a10000" : "#006600",
      }}
    >
      <strong>
        {isRisk
          ? `🚩 Health Risk Detected: ${risk.risk_condition}`
          : "✅ No Health Risk Detected"}
      </strong>
      <p style={{ marginTop: "10px" }}>
        {isRisk ? risk.recommendation : "You're good to go. No action needed."}
      </p>
    </div>
  );
}
