/* eslint-disable @typescript-eslint/no-unused-vars */
// Date String by Language (timestamp is seconds, tzOffset is seconds ex. UTC+7 = 25200)
export function getDateTimeStringByLang(lang: string = "th", isUseDeviceTime: boolean = true, timestamp: number = 0, offset: number = 0): string {
  // Initial Value
  const locale: string = lang.toLowerCase();
  let dateObj: Date;
  let tString: string = "";
  let tzOffset: number, tzMinute: number;
  // Check Use Device Time
  if (isUseDeviceTime) {
    dateObj = new Date();
    // Time Format
    tString = formatTimeData(Math.floor(dateObj.getTime() / 1000), dateObj.getTimezoneOffset() * -60);
    // Zone Format
    tzOffset = Math.floor(dateObj.getTimezoneOffset() / 60);
    tzMinute = Math.abs(dateObj.getTimezoneOffset() % 60);
  } else {
    dateObj = new Date(timestamp * 1000);
    // Time Format
    tString = formatTimeData(timestamp, offset);
    // Zone Format
    tzOffset = Math.floor(offset / 3600);
    tzMinute = Math.floor((Math.abs(offset) % 3600) / 60);
    // Adjust Date
    const adjustedOffset = offset + (dateObj.getTimezoneOffset() * 60);
    const adjustedTS = dateObj.getTime() + adjustedOffset * 1000;
    dateObj = new Date(adjustedTS);
  }
  // Timezone Format
  const tzFormat = `UTC${tzOffset >= 0 ? "+" : "-"}${Math.abs(tzOffset)}:${tzMinute < 10 ? "0" + tzMinute : tzMinute}`;
  // Initial String
  let wkdayStr: string, dateStr: number, monthStr: string, yearStr: string, ordinalSuffix: string;
  // Process Value
  let result: string = "";
  switch (locale) {
    case "th":
      // Result String
      result = new Intl.DateTimeFormat("th-TH", { year: "numeric", month: "long", day: "numeric" }).format(dateObj);
      result = `${result} - ${tString} (${tzFormat})`;
      break;
    default:
      // Process String
      wkdayStr = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(dateObj);
      dateStr = dateObj.getDate();
      monthStr = new Intl.DateTimeFormat("en-US", { month: "long" }).format(dateObj);
      yearStr = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(dateObj);
      ordinalSuffix = dateStr % 10 === 1 && dateStr !== 11 ? "st" : dateStr % 10 === 2 && dateStr !== 12 ? "nd" : dateStr % 10 === 3 && dateStr !== 13 ? "rd" : "th";
      // Result String
      result = `${dateStr}${ordinalSuffix} of ${monthStr} ${yearStr}`;
      result = `${result} - ${tString} (${tzFormat})`;
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
export function formatTempData(temp: number | undefined, unit: string): string {
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
export function formatWindData(speed: number | undefined, unit: string): string {
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
export function formatTimeData(timestamp: number | undefined, timezone: number): string {
  if (typeof timestamp !== "number") return "N/A";
  // Date Object (Seconds to Milliseconds)
  const dateObject = new Date(timestamp * 1000);
  // Adjust Data with Timezone
  const hUTCNum = dateObject.getUTCHours();
  const mUTCNum = dateObject.getUTCMinutes();
  const adjustedH = (hUTCNum + Math.floor(timezone / 3600)) % 24;
  const adjustedM = (mUTCNum + Math.floor((timezone % 3600) / 60)) % 60;
  // Adjust if Negative Minutes
  let finalH = adjustedH;
  let finalM = adjustedM;
  if (adjustedM < 0) {
    finalM = adjustedM + 60;
    finalH = (finalH - 1 + 24) % 24;
  }
  if (finalH < 0) finalH += 24;
  // Format String
  const hString = String(finalH).padStart(2, "0");
  const mString = String(finalM).padStart(2, "0");
  // Return Data
  return `${hString}:${mString}`;
}
