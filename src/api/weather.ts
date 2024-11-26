import $ from "jquery";
import { formatTemperatureData, formatWindSpeedData, formatTimestampData } from "@/utils/functions";

export function fetchCurrentWeather(latitude: number, longitude: number, unit: string = "metric", lang: string = "th"): Promise<object> {
  // OpenWeather API
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const apiUrl = import.meta.env.VITE_CURRENT_WEATHER;
  // Return Promise
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      timeout: 5000,
      data: { lat: latitude, lon: longitude, units: unit, lang: lang, appid: apiKey },
      success: function (weatherData) {
        const weatherObj = processCurrentWeather(weatherData);
        // console.log("Weather Data:", { data: weatherData, obj: weatherObj });
        resolve({ data: weatherData, obj: weatherObj });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("fetchCurrentWeather Error:", jqXHR, textStatus, errorThrown);
        const errorMsg = `ERR_WDT: ${textStatus === "error" ? jqXHR.status : textStatus.toUpperCase()}`;
        // Return Data
        reject({ errorType: "api", errorMsg: errorMsg, jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      },
    });
  });
}

export function fetchThreeHourWeather(latitude: number, longitude: number, unit: string = "metric", lang: string = "th"): Promise<object> {
  // OpenWeather API
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const apiUrl = import.meta.env.VITE_FORECAST_WEATHER;
  // Return Promise
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      timeout: 5000,
      data: { lat: latitude, lon: longitude, units: unit, lang: lang, appid: apiKey },
      success: function (weatherData) {
        const weatherObj = procesThreeHourWeather(weatherData);
        console.log("Weather Data:", { data: weatherData, obj: weatherObj });
        resolve({ data: weatherData, obj: weatherObj });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("fetchThreeHourWeather Error:", jqXHR, textStatus, errorThrown);
        const errorMsg = `ERR_WDT: ${textStatus === "error" ? jqXHR.status : textStatus.toUpperCase()}`;
        // Return Data
        reject({ errorType: "api", errorMsg: errorMsg, jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      },
    });
  });
}

function processCurrentWeather(weatherObj: Record<string, any>, unit: string = "metric"): object {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deviceOffset = new Date().getTimezoneOffset() * 60;
  // Initial Data
  const resultData = { lat: null, lon: null, icon: "", temp: "N/A", desc: "N/A", feels_like: "N/A", temp_min: "N/A", temp_max: "N/A", wind_speed: "N/A", humidity: "N/A", sunrise: "N/A", sunset: "N/A", dt: null as number | null, curr_offset: deviceOffset, data_offset: null as number | null };
  // Location Data
  resultData.lat = weatherObj?.coord?.lat ?? null;
  resultData.lon = weatherObj?.coord?.lon ?? null;
  // Icon & Desc Data
  const weatherDesc: Record<string, any> | null = Array.isArray(weatherObj?.weather) ? weatherObj.weather[0] : null;
  resultData.icon = weatherDesc?.icon ? `https://openweathermap.org/img/wn/${weatherDesc.icon}@2x.png` : "";
  resultData.desc = weatherDesc?.description ?? "N/A";
  // Weather Data
  resultData.humidity = weatherObj?.main?.humidity ? `${weatherObj.main.humidity}%` : "N/A";
  resultData.temp = formatTemperatureData(weatherObj?.main?.temp, unit);
  resultData.feels_like = formatTemperatureData(weatherObj?.main?.feels_like, unit);
  resultData.temp_min = formatTemperatureData(weatherObj?.main?.temp_min, unit);
  resultData.temp_max = formatTemperatureData(weatherObj?.main?.temp_max, unit);
  resultData.wind_speed = formatWindSpeedData(weatherObj?.wind?.speed, unit);
  // Time Data
  if (typeof weatherObj?.dt === "number" && typeof weatherObj?.timezone === "number") {
    // Timestamp & Timezone
    resultData.dt = weatherObj.dt;
    resultData.data_offset = weatherObj.timezone;
    // Sunrise & Sunset
    resultData.sunrise = formatTimestampData(weatherObj?.sys?.sunrise, weatherObj.timezone);
    resultData.sunset = formatTimestampData(weatherObj?.sys?.sunset, weatherObj.timezone);
  }
  // Return Data
  return resultData;
}

function procesThreeHourWeather(weatherObj: Record<string, any>, unit: string = "metric"): object {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deviceOffset = new Date().getTimezoneOffset() * 60;
  // Initial Data
  const resultData = { curr: null as Record<string, any> | null, next: null as Record<string, any> | null, date: null as Record<string, any> | null };
  // Return Data
  return resultData;
}
