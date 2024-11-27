import $ from "jquery";
import { getDateTimeStringByLang, formatTempData, formatWindData, formatTimeData } from "@/utils/functions";

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
        const weatherObj: object = processCurrentWeather(weatherData, unit, lang);
        // console.log("Weather Data:", { data: weatherData, obj: weatherObj });
        resolve({ data: weatherData, obj: weatherObj });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("fetchCurrentWeather Error:", jqXHR, textStatus, errorThrown);
        const errorMsg: string = `ERR_WDT: ${textStatus === "error" ? jqXHR.status : textStatus.toUpperCase()}`;
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
        const weatherObj: object = processThreeHourWeather(weatherData, unit, lang);
        // console.log("Weather Data:", { data: weatherData, obj: weatherObj });
        resolve({ data: weatherData, obj: weatherObj });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("fetchThreeHourWeather Error:", jqXHR, textStatus, errorThrown);
        const errorMsg: string = `ERR_WDT: ${textStatus === "error" ? jqXHR.status : textStatus.toUpperCase()}`;
        // Return Data
        reject({ errorType: "api", errorMsg: errorMsg, jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      },
    });
  });
}

function processCurrentWeather(weatherObj: Record<string, any>, unit: string = "metric", lang: string = "th"): object {
  // Initial Data
  const deviceOffset: number = new Date().getTimezoneOffset() * 60;
  const resultData: Record<string, any> = { lat: null, lon: null, curr_tz: deviceOffset, data_tz: null as number | null, icon: "", temp: "N/A", desc: "N/A", feels_like: "N/A", temp_min: "N/A", temp_max: "N/A", humidity: "N/A", wind_speed: "N/A", sunrise: "N/A", sunset: "N/A", dt: null as number | null, dt_str: null as string | null };
  // Location Data
  resultData.lat = weatherObj?.coord?.lat ?? null;
  resultData.lon = weatherObj?.coord?.lon ?? null;
  // Icon & Desc Data
  const weatherDesc: Record<string, any> | null = Array.isArray(weatherObj?.weather) ? weatherObj.weather[0] : null;
  resultData.icon = weatherDesc?.icon ? `https://openweathermap.org/img/wn/${weatherDesc.icon}@2x.png` : "";
  resultData.desc = weatherDesc?.description ?? "N/A";
  // Weather Data
  resultData.temp = formatTempData(weatherObj?.main?.temp, unit);
  resultData.feels_like = formatTempData(weatherObj?.main?.feels_like, unit);
  resultData.temp_min = formatTempData(weatherObj?.main?.temp_min, unit);
  resultData.temp_max = formatTempData(weatherObj?.main?.temp_max, unit);
  resultData.humidity = weatherObj?.main?.humidity ? `${weatherObj.main.humidity}%` : "N/A";
  resultData.wind_speed = formatWindData(weatherObj?.wind?.speed, unit);
  // Time Data
  if (typeof weatherObj?.dt === "number" && typeof weatherObj?.timezone === "number") {
    // Timestamp & Timezone
    resultData.dt = weatherObj.dt;
    resultData.data_tz = weatherObj.timezone;
    resultData.dt_str = getDateTimeStringByLang(lang, false, weatherObj.dt, weatherObj.timezone);
    // Sunrise & Sunset
    resultData.sunrise = formatTimeData(weatherObj?.sys?.sunrise, weatherObj.timezone);
    resultData.sunset = formatTimeData(weatherObj?.sys?.sunset, weatherObj.timezone);
  }
  // Return Data
  return resultData;
}

function processThreeHourWeather(weatherObj: Record<string, any>, unit: string = "metric", lang: string = "th"): object {
  // Initial Data
  const deviceOffset: number = new Date().getTimezoneOffset() * 60;
  const resultData: Record<string, any> = { next: null as Record<string, any> | null, date: null as Record<string, any> | null };
  // Check Timezone Exist
  if (typeof weatherObj?.city?.timezone === "number") {
    // Process Main Data
    const latitude: number | null = weatherObj.city.coord?.lat ?? null;
    const longitude: number | null = weatherObj.city.coord?.lon ?? null;
    const timezone: number = weatherObj.city.timezone;
    // Process Next Data
    if (Array.isArray(weatherObj.list) && weatherObj.list.length > 0) {
      // Init Section
      resultData.next = { lat: latitude, lon: longitude, curr_tz: deviceOffset, data_tz: timezone, list: [] };
      // Loop Section
      const listData: any[] = weatherObj.list;
      const loopLimit: number = Math.min(listData.length, 7);
      for (let index: number = 0; index < loopLimit; index++) {
        // Access Values
        const dataObj: Record<string, any> = listData[index];
        const descObj: Record<string, any> | null = dataObj.weather ? dataObj.weather[0] : null;
        // Process Values
        const resultObj: Record<string, any> = {
          time: formatTimeData(dataObj.dt, timezone),
          icon: descObj?.icon ? `https://openweathermap.org/img/wn/${descObj.icon}.png` : "",
          temp: formatTempData(dataObj.main?.temp, unit),
          desc: descObj?.description ?? "N/A",
          feels_like: formatTempData(dataObj.main?.feels_like, unit),
          temp_min: formatTempData(dataObj.main?.temp_min, unit),
          temp_max: formatTempData(dataObj.main?.temp_max, unit),
          humidity: dataObj.main?.humidity ? `${dataObj.main.humidity}%` : "N/A",
          wind_speed: formatWindData(dataObj.wind?.speed, unit),
          dt_str: getDateTimeStringByLang(lang, false, dataObj.dt, timezone),
        };
        // Push Value
        resultData.next.list.push(resultObj);
      }
    }
  }
  // Return Data
  return resultData;
}
