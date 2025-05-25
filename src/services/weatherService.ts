import { time } from "node:console";
import { WeatherData } from "../type";
import { fetchWeatherApi } from "openmeteo";

export async function getWeatherData(
  lat: number = 52.52,
  lon: number = 13.41
): Promise<WeatherData> {
  try {
    // Fetch air quality data
    const airQualityRes = await fetchWeatherApi(
      "https://air-quality-api.open-meteo.com/v1/air-quality",
      {
        latitude: lat,
        longitude: lon,
        hourly: ["pm2_5", "european_aqi", "ozone"],
        current: [
          "pm2_5",
          "european_aqi",
          "ozone",
          "birch_pollen",
          "grass_pollen",
          "mugwort_pollen",
          "alder_pollen",
          "ragweed_pollen",
        ],
        timezone: "Europe/Berlin",
        past_days: 1,
      }
    );

    const response1 = airQualityRes[0];
    const utcOffsetSeconds = response1.utcOffsetSeconds();
    const timezone = response1.timezone();
    console.log(timezone);
    const current = response1.current();
    if (!current) {
      throw new Error("current is null");
    }
    const currpm25Values = current.variables(0)!.value();
    const curraqiValues = current.variables(1)!.value();
    const currozoneValues = current.variables(2)!.value();
    const birchPollen = current.variables(3)!.value();
    const grassPollen = current.variables(4)!.value();
    const mugwortPollen = current.variables(5)!.value();
    const alderPollen = current.variables(6)!.value();
    const ragweedPollen = current.variables(7)!.value();
    const currTime = new Date(Number(current.time()) * 1000);

    console.log("c PM2.5 values:", currpm25Values);
    console.log("c AQI values:", curraqiValues);
    console.log("c Ozone values:", currozoneValues);
    console.log(currTime);
    const hourly1 = response1.hourly();
    if (!hourly1) {
      throw new Error("Hourly air quality data is unavailable.");
    }
    const pm25Values = hourly1.variables(0)?.valuesArray() ?? [];
    const aqiValues = hourly1.variables(1)?.valuesArray() ?? [];
    const ozoneValues = hourly1.variables(2)?.valuesArray() ?? [];

    console.log("PM2.5 values:", pm25Values);
    console.log("AQI values:", aqiValues);
    console.log("Ozone values:", ozoneValues);

    const latestPm25 = pm25Values[pm25Values.length - 1] ?? 0;
    const latestAqi = aqiValues[aqiValues.length - 1] ?? 0;
    const latestOzoneValue = ozoneValues[ozoneValues.length - 1] ?? 0;

    console.log(
      "Last PM2.5 index:",
      pm25Values.length - 1,
      "value:",
      pm25Values[pm25Values.length - 1]
    );
    console.log(
      "Last AQI index:",
      aqiValues.length - 1,
      "value:",
      aqiValues[aqiValues.length - 1]
    );
    console.log(
      "Last Ozone index:",
      ozoneValues.length - 1,
      "value:",
      ozoneValues[ozoneValues.length - 1]
    );

    // Fetch weather forecast
    const [forecastRes] = await fetchWeatherApi(
      "https://api.open-meteo.com/v1/forecast",
      {
        latitude: lat,
        longitude: lon,
        hourly: ["surface_pressure"],
        minutely_15: ["temperature_2m", "relative_humidity_2m"],
        current: ["temperature_2m", "relative_humidity_2m"],
        timezone: "Europe/Berlin",
        past_days: 1,
      }
    );
    const currForcast = forecastRes.current();
    if (!currForcast) {
      throw new Error("Hourly air quality data is unavailable.");
    }

    const currTemp = currForcast.variables(0)!.value();
    const currHumidity = currForcast.variables(1)!.value();

    const minutely = forecastRes?.minutely15?.();
    const temperature = minutely?.variables(0)?.valuesArray()?.at(-1) ?? 0;

    const humidity = minutely?.variables(1)?.valuesArray()?.at(-1) ?? 0;

    const hourly = forecastRes?.hourly?.();
    const pressureValues = hourly?.variables(0)?.valuesArray() ?? [];

    let pressureDrop =
      pressureValues.length >= 2
        ? pressureValues[0] - pressureValues[pressureValues.length - 1]
        : 0;

    pressureDrop = Math.abs(pressureDrop);
    console.log(
      "pressure drop",
      pressureValues[0],
      pressureValues[pressureValues.length - 1],
      pressureDrop
    );
    const format = (val: number): number => parseFloat(val.toFixed(2));
    return {
      temperature: format(currTemp),
      humidity: format(currHumidity),
      pm25: format(currpm25Values),
      aqi: format(curraqiValues),
      ozone: format(currozoneValues),
      pressureDrop: format(pressureDrop),
      birchPollen: format(birchPollen),
      grassPollen: format(grassPollen),
      mugwortPollen: format(mugwortPollen),
      alderPollen: format(alderPollen),
      ragweedPollen: format(ragweedPollen),
    };
  } catch (error) {
    console.error("Error fetching weather or air quality data:", error);
    return {
      temperature: 0,
      humidity: 0,
      pm25: 0,
      aqi: 0,
      ozone: 0,
      pressureDrop: 0,
      birchPollen: 0,
      grassPollen: 0,
      mugwortPollen: 0,
      alderPollen: 0,
      ragweedPollen: 0,
    };
  }
}
