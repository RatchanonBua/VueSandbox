import $ from "jquery";

export function fetchLocationString(cityName: string = ""): Promise<object> {
  // OpenWeather API
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const apiUrl = import.meta.env.VITE_DIRECT_LOCATION;
  // Return Promise
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUrl,
      method: "GET",
      type: "json",
      timeout: 5000,
      data: { q: cityName, limit: 1, appid: apiKey },
      success: function (resultLocData) {
        if (Array.isArray(resultLocData) && resultLocData.length === 1) {
          // Extend Function
          getCityNameWithCountry(resultLocData, resolve);
        } else {
          reject({ errorType: "data", resultData: resultLocData });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("OpenWeather Error:", jqXHR, textStatus, errorThrown);
        // Return Data
        reject({ errorType: "api", resultData: [], jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      },
    });
  });
}

export function fetchLocationCoords(latitude: number, longitude: number): Promise<object> {
  // OpenWeather API
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const apiUrl = import.meta.env.VITE_REVERSE_LOCATION;
  // Return Promise
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUrl,
      method: "GET",
      type: "json",
      timeout: 5000,
      data: { lat: latitude, lon: longitude, limit: 1, appid: apiKey },
      success: function (resultLocData) {
        if (Array.isArray(resultLocData) && resultLocData.length === 1) {
          // Extend Function
          getCityNameWithCountry(resultLocData, resolve);
        } else {
          reject({ errorType: "data", resultData: resultLocData });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("OpenWeather Error:", jqXHR, textStatus, errorThrown);
        // Return Data
        reject({ errorType: "api", resultData: [], jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      },
    });
  });
}
// Get Country Name (Extend Function) => if not possible then result is city name only
async function getCityNameWithCountry(resultLocData: Record<string, any>, resolve: Function, lang: string = "th"): Promise<void> {
  // REST Countries API
  const codeUrl = import.meta.env.VITE_COUNTRIES_ALPHA;
  // Process Data
  const locationObj: Record<string, any> = resultLocData[0];
  const countryCode: string | null = locationObj?.country ? String(locationObj.country) : null;
  // Init City Name
  const getCityName = (): string => {
    switch (lang) {
      case "th":
        return locationObj?.local_names?.th ?? locationObj?.name ?? "???";
      default:
        return locationObj?.name ?? "???";
    }
  };
  let locationName: string = getCityName();
  // No Country Code
  if (!countryCode) {
    return resolve({ data: locationObj, full_name: locationName });
  }
  // Fetch Country Data
  try {
    console.log(`REST Countries URL: ${codeUrl}/${countryCode}`);
    const resultCodeData = await $.ajax({
      url: `${codeUrl}/${countryCode}`,
      method: "GET",
      dataType: "json",
      timeout: 5000,
    });
    // Get Country Data
    const countryData: Record<string, any> = resultCodeData[0];
    const countryCommonName: string = countryData?.name?.common ?? ""; /** English Name (String) **/
    const countryNativeName: Record<string, any> = countryData?.name?.nativeName; /** Name Object (Object) **/
    // Check Country Data
    const resultLocName = locationObj?.name ? (countryCommonName ? `${locationObj.name}, ${countryCommonName}` : locationName) : "???";
    if (countryNativeName) {
      switch (lang) {
        case "th":
          locationName = locationObj?.local_names?.th && countryData?.name?.nativeName?.tha?.common ? `${locationObj.local_names.th}, ${countryData.name.nativeName.tha.common}` : resultLocName;
          break;
        default:
          locationName = resultLocName;
          break;
      }
    } else {
      locationName = resultLocName;
    }
    return resolve({ data: locationObj, full_name: locationName });
  } catch (error: any) {
    console.log("REST Countries Error:", error?.jqXHR, error?.textStatus, error?.errorThrown);
    return resolve({ data: locationObj, full_name: locationName });
  }
}
