import { error } from "console";
import { WeatherData, HealthRiskResponse } from "../type";
/*
export async function fetchHealthRisk(
  weather: WeatherData,
  condition: string
): Promise<HealthRiskResponse> {
  
  const prompt = `
Analyze the patient's weather-related health risk based on the following parameters:

- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- PM2.5: ${weather.pm25} µg/m³
- AQI: ${weather.aqi}
- Ozone: ${weather.ozone} µg/m³
- Barometric Pressure Drop (last 24h): ${weather.pressureDrop} hPa
- Birch Pollen: ${weather.birchPollen} grains/m³
- Grass Pollen: ${weather.grassPollen} grains/m³
- Mugwort Pollen: ${weather.mugwortPollen} grains/m³
- Alder Pollen: ${weather.alderPollen} grains/m³
- Ragweed Pollen: ${weather.ragweedPollen} grains/m³

The patient is diagnosed with the following condition(s): ${condition}.

Your task is to determine if the current weather parameters pose a health risk **strictly based on quantitative thresholds** defined by medical or environmental guidelines. All comparisons must be **numerically precise** (e.g., PM2.5 ≥ 25 is risky; PM2.5 = 24.9999 is not risky).

You MUST return only a **valid, parsable JSON object** in the following exact format:

{
  "risk_found": "true" or "false", // "true" only if one or more thresholds are crossed
  "risk_condition": "comma-separated list of affected conditions (e.g., Asthma, Heart Failure)",
  "triggers": {
    "parameter_name": "concise reason explaining why this parameter is a trigger (e.g., PM2.5: exceeds threshold for respiratory risk). Moderate and High risk triggers should be reasoned for decision"
  },
  "recommendation": "clear and direct advice (in second person) in english language based on the triggers parameter_name above, including emojis if appropriate (e.g., Wear a mask 😷 due to poor air quality)."
}

Strict Rules:
- DO NOT add any extra text, markdown, headers, bullet points, or explanation outside the JSON object.
- DO NOT round or approximate numeric values. Use exact comparisons.
- DO NOT assume risk unless the data explicitly meets or exceeds known risk thresholds.
- If no parameters exceed their risk thresholds, respond with:
  {
    "risk_found": "false",
    "risk_condition": "",
    "triggers": {},
    "recommendation": "No health risk detected. Continue normal activity. ☀️"
  }

Remember: Only the JSON object should be returned, no wrapping text.
`.trim();

  console.log(prompt);
  try {
    const response = await fetch(
      "https://openaiwestus001.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-08-01-preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key":
            "",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a medical assistant. Only respond with valid JSON containing the health risks based on the provided environmental data and patient health conditions. Ensure the response strictly conforms to the required format for direct parsing.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          data_sources: [
            {
              type: "azure_search",
              parameters: {
                endpoint: "https://aisearchrag0001.search.windows.net/",
                index_name: "habitatguidelines1",
                authentication: {
                  type: "system_assigned_managed_identity",
                },
                query_type: "vector_simple_hybrid",
                embedding_dependency: {
                  type: "deployment_name",
                  deployment_name: "text-embedding-ada-002",
                },
                semantic_configuration: "default",
              },
            },
          ],
        }),
      }
    );

    const json = await response.json();
    // Clean the response, if necessary
    let cleanedResponse = json.choices?.[0]?.message?.content?.trim();

    // Log the cleaned response to inspect its content
    console.log("Cleaned Response:", cleanedResponse);

    // Parse the cleaned JSON response
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error fetching health risk:", error);
    throw error; // rethrow or handle the error as needed
  }
}
*/

export async function fetchHealthRisk(weather: WeatherData, condition: string) {
  const res = await fetch("http://localhost:5001/api/health-risk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weather, condition }),
  });

  if (!res.ok) throw new Error("Failed to fetch health risk");
  return res.json();
}
