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
      dataType: "json",
      timeout: 5000,
      data: { q: cityName, appid: apiKey },
      success: async function (resultLocData) {
        // console.log("Location Data:", resultLocData);
        if (Array.isArray(resultLocData) && resultLocData.length > 0) {
          const locationObj: Record<string, any> = resultLocData[0];
          const locationName = await getCityNameWithCountry(locationObj);
          resolve({ data: locationObj, full_name: locationName });
        } else {
          reject({ errorType: "data", errorMsg: "DATA_NOT_FOUND", resultData: resultLocData });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("fetchLocationString Error:", jqXHR, textStatus, errorThrown);
        const errorMsg = `ERR_LOC: ${textStatus === "error" ? jqXHR.status : textStatus.toUpperCase()}`;
        // Return Data
        reject({ errorType: "api", errorMsg: errorMsg, jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
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
      dataType: "json",
      timeout: 5000,
      data: { lat: latitude, lon: longitude, appid: apiKey },
      success: async function (resultLocData) {
        // console.log("Location Data:", resultLocData);
        if (Array.isArray(resultLocData) && resultLocData.length > 0) {
          const locationObj: Record<string, any> = resultLocData[0];
          const locationName = await getCityNameWithCountry(locationObj);
          resolve({ data: locationObj, full_name: locationName });
        } else {
          reject({ errorType: "data", errorMsg: "DATA_NOT_FOUND", resultData: resultLocData });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("fetchLocationCoords Error:", jqXHR, textStatus, errorThrown);
        const errorMsg = `ERR_LOC: ${textStatus === "error" ? jqXHR.status : textStatus.toUpperCase()}`;
        // Return Data
        reject({ errorType: "api", errorMsg: errorMsg, jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      },
    });
  });
}
// Get Country Name (Extend Function) => if not possible then result is city name only
async function getCityNameWithCountry(locationObj: Record<string, any>, lang: string = "th"): Promise<string> {
  // REST Countries API
  const codeUrl = import.meta.env.VITE_COUNTRIES_ALPHA;
  // Process Data
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
    return locationName;
  }
  // Fetch Country Data
  const locationWithCode = `${locationName}${locationObj?.country ? `, ${locationObj.country}` : ""}`;
  try {
    // console.log(`REST Countries URL: ${codeUrl}/${countryCode}`);
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
    const resultLocName = locationObj?.name ? (countryCommonName ? `${locationObj.name}, ${countryCommonName}` : locationWithCode) : "???";
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
    return locationName;
  } catch (error: any) {
    console.log("REST Countries Error:", error?.jqXHR, error?.textStatus, error?.errorThrown);
    return locationWithCode;
  }
}
