// Date String by Language
export function getDateStringByLang(lang: string = "th"): string {
  // Initial Value
  const locale: string = lang.toLowerCase();
  const nowObj: Date = new Date();
  // Initial String
  let wkdayStr: string, dateStr: number, monthStr: string, yearStr: string, ordinalSuffix: string;
  // Process Value
  let result: string = "";
  switch (locale) {
    case "th":
      result = new Intl.DateTimeFormat("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(nowObj);
      break;
    default:
      wkdayStr = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(nowObj);
      dateStr = nowObj.getDate();
      monthStr = new Intl.DateTimeFormat("en-US", { month: "long" }).format(nowObj);
      yearStr = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(nowObj);
      ordinalSuffix = dateStr % 10 === 1 && dateStr !== 11 ? "st" : dateStr % 10 === 2 && dateStr !== 12 ? "nd" : dateStr % 10 === 3 && dateStr !== 13 ? "rd" : "th";
      result = `${wkdayStr}. ${dateStr}${ordinalSuffix} ${monthStr} ${yearStr}`;
      break;
  }
  return result;
}
// Add URL Timestamp Cache
export function addURLTimestampCache(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.append("ts", Date.now().toString());
    return urlObj.toString();
  } catch (error: any) {
    console.error(`Invalid URL: ${url}`);
    return url;
  }
}
