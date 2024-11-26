/* eslint-disable @typescript-eslint/no-unused-vars */
// Date String by Language
export function getDateTimeStringByLang(lang: string = "th"): string {
  // Initial Value
  const locale: string = lang.toLowerCase();
  const nowObj: Date = new Date();
  // Time Format
  const hString: string = String(nowObj.getHours()).padStart(2, "0");
  const mString: string = String(nowObj.getMinutes()).padStart(2, "0");
  const tString: string = `${hString}:${mString}`;
  // Initial String
  let wkdayStr: string, dateStr: number, monthStr: string, yearStr: string, ordinalSuffix: string;
  // Process Value
  let result: string = "";
  switch (locale) {
    case "th":
      result = new Intl.DateTimeFormat("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(nowObj);
      // result = `${result} ณ เวลา ${tString} น.`;
      // result = `${result} ณ เวลาปัจจุบัน`;
      break;
    default:
      wkdayStr = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(nowObj);
      dateStr = nowObj.getDate();
      monthStr = new Intl.DateTimeFormat("en-US", { month: "long" }).format(nowObj);
      yearStr = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(nowObj);
      ordinalSuffix = dateStr % 10 === 1 && dateStr !== 11 ? "st" : dateStr % 10 === 2 && dateStr !== 12 ? "nd" : dateStr % 10 === 3 && dateStr !== 13 ? "rd" : "th";
      result = `${wkdayStr}. ${dateStr}${ordinalSuffix} ${monthStr} ${yearStr}`;
      // result = `${result} at ${tString}`;
      // result = `${result} at the moment`;
      break;
  }
  return result;
}
// Add URL Timestamp Cache
export function addURLTimestampCache(url: string): string {
  if (url.trim().length > 0) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.append("ts", Date.now().toString());
      return urlObj.toString();
    } catch (error: any) {
      console.error(`Invalid URL: ${url}`);
      return url;
    }
  } else {
    return "";
  }
}
// Format Temperature Data
export function formatTemperatureData(temp: number | undefined, unit: string): string {
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
}
// Format Wind Speed Data (standard & metric is meters/sec to kilometers/hous, imperial is miles/hour)
export function formatWindSpeedData(speed: number | undefined, unit: string): string {
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
}
// Format Timestamp Data (timestamp is UTC "second" timestamp, timezone is offset ex. 3600 = UTC+1)
export function formatTimestampData(timestamp: number | undefined, timezone: number): string {
  if (typeof timestamp !== "number") return "N/A";
  // Date Object (Seconds to Milliseconds)
  const dateObject = new Date(timestamp * 1000);
  // Adjust Data with Timezone
  const hUTCNum = dateObject.getUTCHours();
  const mUTCNum = dateObject.getUTCMinutes();
  const adjustedH = (hUTCNum + Math.floor(timezone / 3600)) % 24;
  const adjustedM = (mUTCNum + Math.floor((timezone % 3600) / 60)) % 60;
  // Format String
  const hString = String(adjustedH).padStart(2, "0");
  const mString = String(adjustedM).padStart(2, "0");
  // Return Data
  return `${hString}:${mString}`;
}
