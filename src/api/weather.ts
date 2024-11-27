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
        const weatherObj = processCurrentWeather(weatherData, unit, lang);
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
        const weatherObj = processThreeHourWeather(weatherData, unit, lang);
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

function processCurrentWeather(weatherObj: Record<string, any>, unit: string = "metric", lang: string = "th"): object {
  // Initial Data
  const deviceOffset = new Date().getTimezoneOffset() * 60;
  const resultData = { lat: null, lon: null, curr_tz: deviceOffset, data_tz: null as number | null, icon: "", temp: "N/A", desc: "N/A", feels_like: "N/A", temp_min: "N/A", temp_max: "N/A", humidity: "N/A", wind_speed: "N/A", sunrise: "N/A", sunset: "N/A", dt: null as number | null, dt_str: null as string | null };
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
  const deviceOffset = new Date().getTimezoneOffset() * 60;
  const resultData = { curr: null as Record<string, any> | null, next: null as Record<string, any> | null, date: null as Record<string, any> | null };
  // Check Timezone Exist
  if (typeof weatherObj?.city?.timezone === "number") {
    // Process Main Data
    const latitude = weatherObj.city.coord?.lat ?? null;
    const longitude = weatherObj.city.coord?.lon ?? null;
    const timezone = weatherObj.city.timezone;
    // Process Curr Data
    if (Array.isArray(weatherObj.list) && weatherObj.list.length > 0) {
      // Init Section
      resultData.curr = { lat: latitude, lon: longitude, curr_tz: deviceOffset, data_tz: timezone, icon: "", temp: "N/A", desc: "N/A", feels_like: "N/A", temp_min: "N/A", temp_max: "N/A", humidity: "N/A", wind_speed: "N/A", sunrise: "N/A", sunset: "N/A", dt: null as number | null, dt_str: null as string | null };
      // Access Values
      const dataObj = weatherObj.list[0];
      const descObj = dataObj.weather ? dataObj.weather[0] : null;
      // Process Values
      const resultObj = createWeatherResultObject(dataObj, descObj, unit, lang, timezone);
      // Push Value
      resultData.curr = resultObj;
    }
    // Process Next Data
    if (Array.isArray(weatherObj.list) && weatherObj.list.length > 0) {
      // Init Section
      resultData.next = { lat: latitude, lon: longitude, curr_tz: deviceOffset, data_tz: timezone, list: [] };
      // Loop Section
      const listData = weatherObj.list;
      const loopLimit = Math.min(listData.length, 7);
      for (let index = 0; index < loopLimit; index++) {
        // Access Values
        const dataObj = listData[index];
        const descObj = dataObj.weather ? dataObj.weather[0] : null;
        // Process Values
        const resultObj = createWeatherResultObject(dataObj, descObj, unit, lang, timezone);
        // Push Value
        resultData.next.list.push(resultObj);
      }
    }
  }
  // Return Data
  return resultData;
}

function createWeatherResultObject(dataObj: Record<string, any>, descObj: Record<string, any>, unit: string, lang: string, timezone: number): object {
  const timeStr = formatTimeData(dataObj.dt, timezone);
  const tempStr = formatTempData(dataObj.main?.temp, unit);
  const iconUrl = descObj?.icon ? `https://openweathermap.org/img/wn/${descObj.icon}.png` : "";
  const descStr = descObj?.description ?? "N/A";
  const feelsLikeStr = formatTempData(dataObj.main?.feels_like, unit);
  const tempMinStr = formatTempData(dataObj.main?.temp_min, unit);
  const tempMaxStr = formatTempData(dataObj.main?.temp_max, unit);
  const humidityStr = dataObj.main?.humidity ? `${dataObj.main.humidity}%` : "N/A";
  const windStr = formatWindData(dataObj.wind?.speed, unit);
  const dateStr = getDateTimeStringByLang(lang, false, dataObj.dt, timezone);
  // Return Object
  return { time: timeStr, icon: iconUrl, temp: tempStr, desc: descStr, feels_like: feelsLikeStr, temp_min: tempMinStr, temp_max: tempMaxStr, humidity: humidityStr, wind_speed: windStr, dt_str: dateStr };
}
