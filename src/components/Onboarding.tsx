import React, { useState } from "react";

type OnboardingProps = {
  onComplete: (info: {
    firstName: string;
    lastName: string;
    dob: string;
    condition: string;
    medical_information: {
      diagnoses: string[];
      allergies: string[];
      medications: string[];
    };
  }) => void;
};

const conditionsList = [
  "Heart Failure",
  "Asthma",
  "Chronic Obstructive Pulmonary Disease",
  "Preeclampsia",
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<"choose" | "manual" | "upload">("choose");
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMode("upload");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5001/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data?.medical_information) {
        alert("⚠️ Could not extract valid medical data from the PDF.");
        setMode("choose");
        return;
      }

      const conditionLabel =
        data.medical_information.diagnoses?.join(", ") || "";

      onComplete({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dob: data.dob || "",
        condition: conditionLabel,
        medical_information: data.medical_information,
      });
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("An error occurred while uploading or processing the PDF.");
      setMode("choose");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    const conditionLabel = conditions.join(", ");
    onComplete({
      firstName,
      lastName,
      dob,
      condition: conditionLabel,
      medical_information: {
        diagnoses: conditions,
        allergies: [],
        medications: [],
      },
    });
  };

  const renderChooseMode = () => (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome! How would you like to onboard?</h2>
      <div style={styles.buttonGroup}>
        <button onClick={() => setMode("manual")} style={styles.button}>
          Enter Info Manually
        </button>
        <label style={{ ...styles.button, ...styles.uploadLabel }}>
          Upload Discharge Letter
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );

  const renderUploadMode = () => (
    <div style={styles.container}>
      <h2 style={styles.heading}>Uploading and analyzing your PDF...</h2>
      <p>⏳ Please wait</p>
    </div>
  );

  const renderManualMode = () => (
    <div style={styles.container}>
      {step === 1 && (
        <>
          <h2 style={styles.heading}>What's your name?</h2>
          <input
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button
            onClick={() => firstName && lastName && setStep(2)}
            style={styles.button}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={styles.heading}>What's your date of birth?</h2>
          <input
            style={styles.input}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button onClick={() => dob && setStep(3)} style={styles.button}>
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={styles.heading}>Select your health conditions:</h2>
          <div style={styles.conditionList}>
            {conditionsList.map((c) => (
              <button
                key={c}
                onClick={() =>
                  setConditions((prev) =>
                    prev.includes(c)
                      ? prev.filter((item) => item !== c)
                      : [...prev, c]
                  )
                }
                style={{
                  ...styles.conditionButton,
                  backgroundColor: conditions.includes(c)
                    ? "#007bff"
                    : "#f0f0f0",
                  color: conditions.includes(c) ? "white" : "#222",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={conditions.length === 0}
            style={styles.button}
          >
            Let's Go!
          </button>
        </>
      )}
    </div>
  );

  if (mode === "choose") return renderChooseMode();
  if (mode === "upload") return renderUploadMode();
  if (mode === "manual") return renderManualMode();
  return null;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "40px",
    maxWidth: "450px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
    textAlign: "center",
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "1.5rem",
    color: "#333",
  },
  input: {
    padding: "12px",
    margin: "10px 0",
    width: "100%",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    marginTop: "20px",
  },
  button: {
    padding: "12px 20px",
    maxWidth: "30em",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s ease-in-out",
  },
  uploadLabel: {
    backgroundColor: "#28a745",
    display: "inline-block",
    textAlign: "center",
    cursor: "pointer",
  },
  conditionList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px",
  },
  conditionButton: {
    padding: "12px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s",
  },
};

export default Onboarding;
