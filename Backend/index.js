import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { extractMedicalInfoFromPdfBuffer } from "./extractFromPdf.js";
import multer from "multer";
dotenv.config();

const app = express();
const port = process.env.PORT || 6000;
const upload = multer({ storage: multer.memoryStorage() });
// Init Vertex AI client
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION,
});

const model = "gemini-2.5-flash-preview-05-20";

const tools = [
  {
    retrieval: {
      vertexRagStore: {
        ragResources: [
          {
            ragCorpus:
              "projects/495689479085/locations/europe-west3/ragCorpora/##################",
          },
        ],
      },
    },
  },
];

const generationConfig = {
  maxOutputTokens: 8192,
  temperature: 1,
  topP: 1,
  seed: 0,
};

const safetySettings = [
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "OFF",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "OFF",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "OFF",
  },
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "OFF",
  },
];

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Route
app.post("/api/health-risk", async (req, res) => {
  const { weather, condition } = req.body;

  if (!weather || !condition) {
    return res.status(400).json({ error: "Missing weather or condition" });
  }

  const prompt = `Temperature = ${weather.temperature}°C, Humidity = ${weather.humidity}%, Air quality PM2.5 = ${weather.pm25} µg/m³, AQI = ${weather.aqi}, Ozone = ${weather.ozone} µg/m³, Barometric Pressure Changes = ${weather.pressureDrop} hPa drop in 24 hours. Is ${condition} at risk? Please **only** return a **valid JSON** response with the following format:
  {
    "risk_found": "true or false",
    "risk_condition": "condition name",
    "triggers": {
      "weather_parameter_name": "reason"
    },
    "recommendation": "only recommended advice text in direct speech with matching emoticons. recommendation should be base on weather data. compare values strictly example: 9.9999 is not equal to risk threshold 10. so if weather value is 9.9999 risk should be false and response should be: "No health risk found. Recommendation should be in direct speech and only recommendation eg: drink more water.""
  }
  **This JSON response will be parsed directly by the application. Therefore, it must strictly conform to the specified format with no additional explanations, markdown, or text.**`;

  try {
    const req = {
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
      tools,
      safetySettings,
    };
    console.log(prompt);
    const stream = await ai.models.generateContentStream(req);

    let fullText = "";
    for await (const chunk of stream) {
      if (chunk.text) {
        fullText += chunk.text;
      }
    }
    console.log(fullText);
    const cleaned = fullText
      .replace(/```json/g, "") // Remove opening markdown block
      .replace(/```/g, "") // Remove closing markdown block
      .trim();

    const result = JSON.parse(cleaned);

    res.json(result);
  } catch (err) {
    console.error("Gemini error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch health risk", details: err.message });
  }
});

app.post("/api/extract", upload.single("file"), async (req, res) => {
  const fileBuffer = req.file?.buffer;

  if (!fileBuffer) {
    return res.status(400).json({ error: "Missing PDF file in request" });
  }

  try {
    const extracted = await extractMedicalInfoFromPdfBuffer(fileBuffer);
    res.json(extracted);
  } catch (err) {
    console.error("❌ PDF Extraction Error:", err);
    res
      .status(500)
      .json({ error: "Failed to extract medical info", details: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Express server running on http://localhost:${port}`);
});
