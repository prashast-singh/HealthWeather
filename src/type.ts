export interface WeatherData {
  temperature: number;
  humidity: number;
  pm25: number;
  aqi: number;
  ozone: number;
  pressureDrop: number;
  birchPollen: number;
  grassPollen: number;
  mugwortPollen: number;
  alderPollen: number;
  ragweedPollen: number;
}

export interface HealthRiskResponse {
  risk_found: "true" | "false";
  risk_condition: string;
  triggers: Record<string, string>;
  recommendation: string;
}
