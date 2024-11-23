import $ from "jquery";

export function fetchLocationString(cityName: string = ""): Promise<object> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const apiUrl = import.meta.env.VITE_COORDS_LOCATION;
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUrl,
      method: "GET",
      data: { q: cityName, limit: 1, appid: apiKey },
      success: function (responseData) {
        resolve({ "data": responseData[0] });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        reject({ "jqXHR": jqXHR, "textStatus": textStatus, "errorThrown": errorThrown });
      },
    });
  });
}

export function fetchLocationCoords(latitude: number, longitude: number): Promise<object> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const apiUrl = import.meta.env.VITE_REVERSE_GEOCODE;
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUrl,
      method: "GET",
      data: { lat: latitude, lon: longitude, limit: 1, appid: apiKey },
      success: function (responseData) {
        resolve({ "data": responseData[0] });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        reject({ "jqXHR": jqXHR, "textStatus": textStatus, "errorThrown": errorThrown });
      },
    });
  });
}
