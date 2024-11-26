import $ from "jquery";

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
        console.log("Weather Data:", { data: weatherData, obj: weatherObj });
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
    });
  });
}

function processCurrentWeather(weatherObj: Record<string, any>, unit: string = "metric"): object {
  // Initial Func
  const formatTempData = (temp: number | undefined, unit: string): string => {
    if (typeof temp !== "number") return "N/A";
    switch (unit) {
      case "standard":
        return `${temp.toFixed(1)} K`;
      case "metric":
        return `${temp.toFixed(1)}°C`;
      case "imperial":
        return `${temp.toFixed(1)}°F`;
      default:
        return "N/A";
    }
  };
  const formatSpeedData = (speed: number | undefined, unit: string): string => {
    if (typeof speed !== "number") return "N/A";
    switch (unit) {
      case "standard":
      case "metric":
        return `${(speed * 3.6).toFixed(1)} km/h`;
      case "imperial":
        return `${speed.toFixed(1)} mph`;
      default:
        return "N/A";
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatTimeData = (timestamp: number | undefined, dataOffset: number): string => {
    if (typeof timestamp !== "number") return "N/A";
    const currOffset = new Date().getTimezoneOffset() * 60;
    const dateObject = new Date((timestamp + (dataOffset + currOffset)) * 1000);
    const hString = String(dateObject.getHours()).padStart(2, "0");
    const mString = String(dateObject.getMinutes()).padStart(2, "0");
    // console.log(timestamp, dataOffset, currOffset, dateObject);
    return `${hString}:${mString}`;
  };
  // Initial Data
  const resultData = { lat: null, lon: null, icon: "", temp: "N/A", desc: "N/A", feels_like: "N/A", temp_min: "N/A", temp_max: "N/A", wind_speed: "N/A", humidity: "N/A", sunrise: "N/A", sunset: "N/A", dt: null as number | null };
  // Location Data
  resultData.lat = weatherObj?.coord?.lat ?? null;
  resultData.lon = weatherObj?.coord?.lon ?? null;
  // Icon & Desc Data
  const weatherDesc: Record<string, any> | null = Array.isArray(weatherObj?.weather) ? weatherObj.weather[0] : null;
  resultData.icon = weatherDesc?.icon ? `https://openweathermap.org/img/wn/${weatherDesc.icon}@2x.png` : "";
  resultData.desc = weatherDesc?.description ?? "N/A";
  // Weather Data
  resultData.humidity = weatherObj?.main?.humidity ? `${weatherObj.main.humidity}%` : "N/A";
  resultData.temp = formatTempData(weatherObj?.main?.temp, unit);
  resultData.feels_like = formatTempData(weatherObj?.main?.feels_like, unit);
  resultData.temp_min = formatTempData(weatherObj?.main?.temp_min, unit);
  resultData.temp_max = formatTempData(weatherObj?.main?.temp_max, unit);
  resultData.wind_speed = formatSpeedData(weatherObj?.wind?.speed, unit);
  // Time Data
  if (typeof weatherObj?.dt === "number" && typeof weatherObj?.timezone === "number") {
    // Timestamp & Timezone
    resultData.dt = weatherObj.dt;
    // Sunrise & Sunset
    resultData.sunrise = formatTimeData(weatherObj?.sys?.sunrise, weatherObj.timezone);
    resultData.sunset = formatTimeData(weatherObj?.sys?.sunset, weatherObj.timezone);
  }
  // Return Data
  return resultData;
}
