# 🌤️ Health Weather Advisor

This is a full-stack application that combines medical data extraction and weather-based health risk assessment using Google Document AI and Retrieval-Augmented Generation (RAG) with Gemini/GCP Vertex AI.

## 🔍 Features

- 📄 Upload discharge letters in PDF format and extract structured patient medical data using **Google Document AI**.
- 📍 Enter location to fetch real-time weather parameters including temperature, humidity, AQI, PM2.5, ozone, and barometric pressure drop.
- 🧠 Use **RAG with health guidelines** to generate personalized health risk assessments and friendly recommendations.
- 🌾 Also checks **pollen levels** (birch, grass, mugwort, alder) for allergy-sensitive users.
- 🔔 Clear and engaging notification system for risk or safety conditions.
- 🎨 Polished and responsive UI with manual onboarding option.

## 📦 Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **ML APIs**: Google Document AI, Vertex AI with Gemini + RAG
- **Weather API**: Custom or third-party service integrated via `getWeatherData`
- **Cloud Services**: GCP

<img width="1465" alt="Screenshot 2025-05-25 at 18 48 40" src="https://github.com/user-attachments/assets/a605f608-36c4-4754-a59e-3fb56504bdfe" />
<img width="974" alt="Screenshot 2025-05-25 at 18 49 50" src="https://github.com/user-attachments/assets/4dcfc98f-25af-40ae-a995-525ab9adc8c3" />
<img width="974" alt="Screenshot 2025-05-25 at 18 49 50" src="https://github.com/user-attachments/assets/f3cb42d4-f7c8-414b-8c65-fb3c093fad65" />



