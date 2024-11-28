import $ from "jquery";
import { getDateTimeStringByLang, formatTempData, formatWindData, formatTimeData, getLocaleDateStrInObject } from "@/utils/functions";

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
  const weatherDesc: Record<string, any> | null = Array.isArray(weatherObj?.weather) && weatherObj.weather.length > 0 ? weatherObj.weather[0] : null;
  resultData.icon = weatherDesc?.icon ? `https://openweathermap.org/img/wn/${weatherDesc.icon}@2x.png` : "";
  resultData.desc = weatherDesc?.description ?? "N/A";
  // Weather Data
  resultData.temp = formatTempData(weatherObj?.main?.temp, unit);
  resultData.feels_like = formatTempData(weatherObj?.main?.feels_like, unit);
  resultData.temp_min = formatTempData(weatherObj?.main?.temp_min, unit);
  resultData.temp_max = formatTempData(weatherObj?.main?.temp_max, unit);
  resultData.humidity = typeof weatherObj?.main?.humidity === "number" ? `${weatherObj.main.humidity}%` : "N/A";
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
  // Initial Func
  const getMostFrequentIdObject = (arrObj: any[] | undefined): Record<string, any> => {
    // Check Data
    if (!Array.isArray(arrObj)) return {};
    // Process Frequency Data
    const frequecyMap: Record<string, any> = {};
    let maxCount: number = 0;
    let mostFrequentId: string | null = null;
    arrObj.forEach(item => {
      const itemId = item.id;
      if (typeof itemId === "number") {
        const idString = itemId.toString();
        frequecyMap[idString] = (frequecyMap[idString] || 0) + 1;
        if (frequecyMap[idString] > maxCount) {
          maxCount = frequecyMap[idString];
          mostFrequentId = idString;
        }
      }
    });
    // console.log(frequecyMap, mostFrequentId);
    // Return Data
    if (mostFrequentId !== null) {
      return arrObj.find(item => item.id.toString() === mostFrequentId) || {};
    }
    return {};
  };
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
          wind_speed: formatWindData(dataObj.wind?.speed, unit),
          humidity: typeof dataObj.main?.humidity === "number" ? `${dataObj.main.humidity}%` : "N/A",
          dt_str: getDateTimeStringByLang(lang, false, dataObj.dt, timezone),
        };
        // Push Value
        resultData.next.list.push(resultObj);
      }
    }
    // Process Date Data
    if (Array.isArray(weatherObj.list) && weatherObj.list.length > 0) {
      // Init Section
      resultData.date = { lat: latitude, lon: longitude, curr_tz: deviceOffset, data_tz: timezone, list: [] };
      const tempObj: Record<string, any> = {};
      // Loop Section
      const listData: any[] = weatherObj.list;
      const loopLimit: number = listData.length;
      for (let index: number = 0; index < loopLimit; index++) {
        const dataObj: Record<string, any> = listData[index];
        if (typeof dataObj.dt !== "number") continue;
        // Adjust & Use for Location Date
        const oldDateObj: Date = new Date(dataObj.dt * 1000);
        const newDateObj: Date = new Date(oldDateObj.getTime() + (timezone + oldDateObj.getTimezoneOffset() * 60) * 1000);
        const keyDateStr: string = `${newDateObj.getFullYear()}-${String(newDateObj.getMonth() + 1).padStart(2, "0")}-${String(newDateObj.getDate()).padStart(2, "0")}`;
        // Check Key to Append or Compare Data
        const descObj: Record<string, any> | null = Array.isArray(dataObj.weather) && dataObj.weather.length > 0 ? dataObj.weather[0] : null;
        // Locale Date
        const localeData: Record<string, any> = getLocaleDateStrInObject(newDateObj, lang);
        // Value to Push (Date)
        const wkdayStr: string | null = localeData.wkdayShortStr ?? null;
        const dateStr: string = `${newDateObj.getDate()}`;
        const timeStr: string = `${String(newDateObj.getHours()).padStart(2, "0")}:${String(newDateObj.getMinutes()).padStart(2, "0")}`;
        const monthStr: string | null = localeData.monthShortStr ?? null;
        // Value to Push (Weather)
        const minTemp: number | null = dataObj.main?.temp_min ?? null;
        const maxTemp: number | null = dataObj.main?.temp_max ?? null;
        const windSpeed: number | null = dataObj.wind?.speed ?? null;
        const humidity: number | null = dataObj.main?.humidity ?? null;
        const iconObj: Record<string, any> = { id: descObj?.id ?? null, icon: descObj?.icon ?? null, desc: descObj?.description ?? null };
        // Push Data to Array
        if (!Object.keys(tempObj).includes(keyDateStr)) {
          // Initial Data
          tempObj[keyDateStr] = { wkday_str: wkdayStr, date_str: dateStr, time_str: [timeStr], month_str: monthStr, min_list: [minTemp], max_list: [maxTemp], wind_list: [windSpeed], humid_list: [humidity], icon_obj: [iconObj] };
        } else {
          // Push Data
          tempObj[keyDateStr]["time_str"].push(timeStr);
          tempObj[keyDateStr]["min_list"].push(minTemp);
          tempObj[keyDateStr]["max_list"].push(maxTemp);
          tempObj[keyDateStr]["wind_list"].push(windSpeed);
          tempObj[keyDateStr]["humid_list"].push(humidity);
          tempObj[keyDateStr]["icon_obj"].push(iconObj);
        }
      }
      // Process Section
      let maxDataLength: number = 0;
      for (const keyDateStr in tempObj) {
        const targetDataLength: number = tempObj[keyDateStr]["time_str"]?.length ?? 0;
        maxDataLength = Math.max(maxDataLength, targetDataLength);
      }
      for (const keyDateStr in tempObj) {
        const targetDataLength: number = tempObj[keyDateStr]["time_str"]?.length ?? 0;
        if (targetDataLength < maxDataLength) continue;
        // Access Object
        const accessObj: Record<string, any> = tempObj[keyDateStr];
        // Process Object
        let minValueStr: string = "N/A";
        const minListData: Array<number> = accessObj["min_list"];
        if (Array.isArray(minListData) && minListData.length > 0) {
          const minValueNum: number | undefined = minListData.filter((value: number | null) => value !== null).length > 0 ? Math.min(...minListData.filter((value: number | null) => value !== null)) : undefined;
          minValueStr = formatTempData(minValueNum, unit);
        }
        let maxValueStr: string = "N/A";
        const maxListData: Array<number> = accessObj["max_list"];
        if (Array.isArray(maxListData) && maxListData.length > 0) {
          const maxValueNum: number | undefined = maxListData.filter((value: number | null) => value !== null).length > 0 ? Math.max(...maxListData.filter((value: number | null) => value !== null)) : undefined;
          maxValueStr = formatTempData(maxValueNum, unit);
        }
        let humidValueStr: string = "N/A";
        const humidListData: Array<number> = accessObj["humid_list"];
        if (Array.isArray(humidListData) && humidListData.length > 0) {
          const windValueNum: number | undefined = humidListData.filter((value: number | null) => value !== null).length > 0 ? Math.max(...humidListData.filter((value: number | null) => value !== null)) : undefined;
          humidValueStr = typeof windValueNum === "number" ? `${windValueNum}%` : "N/A";
        }
        let windValueStr: string = "N/A";
        const windListData: Array<number> = accessObj["wind_list"];
        if (Array.isArray(windListData) && windListData.length > 0) {
          const windValueNum: number | undefined = windListData.filter((value: number | null) => value !== null).length > 0 ? Math.max(...windListData.filter((value: number | null) => value !== null)) : undefined;
          windValueStr = formatWindData(windValueNum, unit);
        }
        const iconMainData: Record<string, any> = getMostFrequentIdObject(accessObj["icon_obj"]);
        console.log(iconMainData);
        // Result Object
        const resultObj: Record<string, any> = {
          key_str: keyDateStr,
          wkday_str: accessObj["wkday_str"],
          date_str: accessObj["date_str"],
          month_str: accessObj["month_str"],
          temp_min: minValueStr,
          temp_max: maxValueStr,
          humidity: humidValueStr,
          wind_speed: windValueStr,
          icon: iconMainData.icon ? `https://openweathermap.org/img/wn/${iconMainData.icon}.png` : "",
          desc: iconMainData.desc ?? "N/A",
        };
        resultData.date.list.push(resultObj);
      }
      // console.log(resultData);
    }
  }
  // Return Data
  return resultData;
}
