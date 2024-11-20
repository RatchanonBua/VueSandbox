<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-case-declarations -->
<script lang="ts">
import $ from "jquery";
import IconSearch from "@/components/icons/useful/IconSearch.vue";

export default {
  name: "WeatherForecastView",
  components: { IconSearch },
  data() {
    return {
      btnCSS: "text-white pt-0.5",
    };
  },
  methods: {
    initGeolocation(): void {
      if (navigator.geolocation) {
        if (navigator.permissions) {
          navigator.permissions.query({ name: "geolocation" }).then((permission) => {
            if (permission.state === "granted" || permission.state === "prompt") {
              console.log("init-geolocation:ok-perms", permission.state);
              this.getGeolocationFromGPS();
            } else {
              console.log("init-geolocation:block-perms", permission.state);
              this.handleGPSLocationError(true, false);
            }
          });
        } else {
          console.log("init-geolocation:no-perms");
          this.getGeolocationFromGPS();
        }
      } else {
        console.log("init-geolocation:no-geoapi");
        this.handleGPSLocationError(false, false);
      }
    },
    getGeolocationFromGPS(): void {
      const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var posLat = position.coords.latitude;
          var posLon = position.coords.longitude;
          if (typeof posLat === "number" && typeof posLon === "number" && posLat >= -90 && posLat <= 90 && posLon >= -180 && posLon <= 180) {
            console.log(`Latitude: ${posLat}, Longitude: ${posLon}`);
            // this.getCityNameByLocation(posLat, posLon);
          } else {
            this.handleGPSLocationError(true, true);
          }
        },
        () => {
          console.log("gps-location:error");
          this.handleGPSLocationError(true, true);
        },
        options
      );
    },
    handleGPSLocationError(hasGeolocation: boolean, hasPermission: boolean): void {
      let errorMessage: string = "";
      if (!hasGeolocation) {
        errorMessage = "อุปกรณ์ไม่รองรับการทำงานของ GPS";
      } else if (!hasPermission) {
        errorMessage = "ท่านไม่ได้อนุญาตการทำงานของ GPS";
      } else {
        errorMessage = "GPS ของท่านมีปัญหา กรุณาลองอีกครั้ง";
      }
      console.log(errorMessage);
    },
    getCityNameByLocation(lat: number = 0, lon: number = 0): string {
      // console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return "Bangkok, Thailand";
    },
    getDateStringByLang(lang: string = "th"): string {
      // Initial Value
      const locale: string = lang.toLowerCase();
      const nowObj: Date = new Date();
      // Process Value
      let result: string = "";
      switch (locale) {
        case "th":
          result = new Intl.DateTimeFormat("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(nowObj);
          break;
        default:
          const wkdayStr: string = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(nowObj);
          const dateStr: number = nowObj.getDate();
          const monthStr: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(nowObj);
          const yearStr: string = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(nowObj);
          const ordinalSuffix: string = dateStr % 10 === 1 && dateStr !== 11 ? "st" : dateStr % 10 === 2 && dateStr !== 12 ? "nd" : dateStr % 10 === 3 && dateStr !== 13 ? "rd" : "th";
          result = `${wkdayStr}. ${dateStr}${ordinalSuffix} ${monthStr} ${yearStr}`;
          break;
      }
      return result;
    },
  },
  computed: {},
};
</script>

<template>
  <div class="min-h-screen px-6 pt-6 pb-12 text-white bg-no-repeat bg-fixed bg-gradient-to-b from-blue-900 to-blue-500 dark:from-gray-900 dark:to-gray-500">
    <div class="forecast-search flex flex-wrap" v-show="false"></div>
    <div class="forecast-result flex flex-wrap" v-show="true">
      <div class="flex grow">
        <div class="w-full">
          <h1 class="m-0 text-2xl font-semibold" id="city-str">{{ getCityNameByLocation() }}</h1>
          <div class="empty" id="date-str">{{ getDateStringByLang("th") }}</div>
        </div>
        <div class="search-button">
          <button class="w-6 h-6 rounded-full object-cover" @click="getGeolocationFromGPS">
            <IconSearch :cssClass="btnCSS" />
          </button>
        </div>
      </div>
    </div>
    <div class="forecast-temp flex flex-wrap" v-show="true">
      <!-- <div class="location-and-date">
        <h1 class="location-and-date__location">London, UK</h1>
        <div>Sunday 4th August</div>
      </div> -->
      <div class="current-temperature">
        <!-- <div class="current-temperature__icon-container">
        <img src="icons/mostly-sunny.svg" class="current-temperature__icon" alt="" />
      </div> -->
        <div class="current-temperature__content-container">
          <div class="current-temperature__value">21&deg;</div>
          <div class="current-temperature__summary">Mostly Sunny</div>
        </div>
      </div>

      <div class="current-stats">
        <div>
          <div class="current-stats__value">23&deg;</div>
          <div class="current-stats__label">High</div>
          <div class="current-stats__value">14&deg;</div>
          <div class="current-stats__label">Low</div>
        </div>
        <div>
          <div class="current-stats__value">7mph</div>
          <div class="current-stats__label">Wind</div>
          <div class="current-stats__value">0%</div>
          <div class="current-stats__label">Rain</div>
        </div>
        <div>
          <div class="current-stats__value">05:27</div>
          <div class="current-stats__label">Sunrise</div>
          <div class="current-stats__value">20:57</div>
          <div class="current-stats__label">Sunset</div>
        </div>
      </div>

      <div class="weather-by-hour">
        <h2 class="weather-by-hour__heading">Today's weather</h2>
        <div class="weather-by-hour__container">
          <div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">3am</div>
            <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            <div>14&deg;</div>
          </div>
          <div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">6am</div>
            <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            <div>16&deg;</div>
          </div>
          <div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">9am</div>
            <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            <div>17&deg;</div>
          </div>
          <div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">12pm</div>
            <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            <div>19&deg;</div>
          </div>
          <div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">3pm</div>
            <!-- <img src="icons/sunny.svg" alt="Sunny" /> -->
            <div>21&deg;</div>
          </div>
          <div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">6pm</div>
            <!-- <img src="icons/sunny.svg" alt="Sunny" /> -->
            <div>20&deg;</div>
          </div>
          <div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">9pm</div>
            <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            <div>18&deg;</div>
          </div>
        </div>
      </div>

      <div class="next-5-days">
        <h2 class="next-5-days__heading">Next 5 days</h2>
        <div class="next-5-days__container">
          <div class="next-5-days__row">
            <div class="next-5-days__date">
              Tue
              <div class="next-5-days__label">30/7</div>
            </div>

            <div class="next-5-days__low">
              10&deg;
              <div class="next-5-days__label">Low</div>
            </div>

            <div class="next-5-days__high">
              21&deg;
              <div class="next-5-days__label">High</div>
            </div>

            <div class="next-5-days__icon">
              <!-- <img src="icons/sunny.svg" alt="Sunny" /> -->
            </div>

            <div class="next-5-days__rain">
              0%
              <div class="next-5-days__label">Rain</div>
            </div>

            <div class="next-5-days__wind">
              12mph
              <div class="next-5-days__label">Wind</div>
            </div>
          </div>
          <div class="next-5-days__row">
            <div class="next-5-days__date">
              Wed
              <div class="next-5-days__label">31/7</div>
            </div>

            <div class="next-5-days__low">
              9&deg;
              <div class="next-5-days__label">Low</div>
            </div>

            <div class="next-5-days__high">
              18&deg;
              <div class="next-5-days__label">High</div>
            </div>

            <div class="next-5-days__icon">
              <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            </div>

            <div class="next-5-days__rain">
              3%
              <div class="next-5-days__label">Rain</div>
            </div>

            <div class="next-5-days__wind">
              7mph
              <div class="next-5-days__label">Wind</div>
            </div>
          </div>
          <div class="next-5-days__row">
            <div class="next-5-days__date">
              Thur
              <div class="next-5-days__label">1/8</div>
            </div>

            <div class="next-5-days__low">
              7&deg;
              <div class="next-5-days__label">Low</div>
            </div>

            <div class="next-5-days__high">
              15&deg;
              <div class="next-5-days__label">High</div>
            </div>

            <div class="next-5-days__icon">
              <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            </div>

            <div class="next-5-days__rain">
              75%
              <div class="next-5-days__label">Rain</div>
            </div>

            <div class="next-5-days__wind">
              11mph
              <div class="next-5-days__label">Wind</div>
            </div>
          </div>
          <div class="next-5-days__row">
            <div class="next-5-days__date">
              Tue
              <div class="next-5-days__label">2/8</div>
            </div>

            <div class="next-5-days__low">
              12&deg;
              <div class="next-5-days__label">Low</div>
            </div>

            <div class="next-5-days__high">
              24&deg;
              <div class="next-5-days__label">High</div>
            </div>

            <div class="next-5-days__icon">
              <!-- <img src="icons/sunny.svg" alt="Sunny" /> -->
            </div>

            <div class="next-5-days__rain">
              2%
              <div class="next-5-days__label">Rain</div>
            </div>

            <div class="next-5-days__wind">
              8mph
              <div class="next-5-days__label">Wind</div>
            </div>
          </div>
          <div class="next-5-days__row">
            <div class="next-5-days__date">
              Tue
              <div class="next-5-days__label">30/7</div>
            </div>

            <div class="next-5-days__low">
              10&deg;
              <div class="next-5-days__label">Low</div>
            </div>

            <div class="next-5-days__high">
              21&deg;
              <div class="next-5-days__label">High</div>
            </div>

            <div class="next-5-days__icon">
              <!-- <img src="icons/mostly-sunny.svg" alt="Mostly sunny" /> -->
            </div>

            <div class="next-5-days__rain">
              0%
              <div class="next-5-days__label">Rain</div>
            </div>

            <div class="next-5-days__wind">
              12mph
              <div class="next-5-days__label">Wind</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/** Bootstrap Breakpoints **/
@media screen and (max-width: 575px) {
}
@media screen and (min-width: 576px) {
}
@media screen and (max-width: 767px) {
}
@media screen and (min-width: 768px) {
}
@media screen and (max-width: 991px) {
}
@media screen and (min-width: 992px) {
}
@media screen and (max-width: 1199px) {
}
@media screen and (min-width: 1200px) {
}
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}
</style>

<style scoped>
@media screen and (min-width: 992px) {
  .forecast-container {
    width: 992px;
    margin: 0px auto;
    font-size: 1.1em;
  }
}

/* location-and-date */
.location-and-date {
  width: 100%;
}

.location-and-date__location {
  margin: 0;
  font-size: 2em;
  font-weight: 600;
}

/* current-temperature */
.current-temperature {
  display: flex;
  margin-top: 0.25em;
  width: 100%;
}

.current-temperature__icon-container {
  flex-grow: 1.25;
  text-align: center;
}

.current-temperature__content-container {
  flex-grow: 1;
  text-align: center;
}

.current-temperature__icon {
  width: 10.5em;
}

.current-temperature__value {
  font-size: 5.25em;
  font-weight: 300;
}

.current-temperature__summary {
  margin-top: -0.5em;
  margin-left: -0.6em;
  text-align: center;
  font-size: 1.125em;
}

/* current-stats */
.current-stats {
  display: flex;
  justify-content: space-around;
  padding-bottom: 1em;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

@media screen and (min-width: 576px) {
  .current-stats {
    margin-bottom: 1em;
    padding-bottom: 0;
    border-top: none;
    border-bottom: none;
    border-left: 1px solid rgba(255, 255, 255, 0.5);
  }
}

.current-stats__value {
  margin-top: 1em;
  font-size: 1.44em;
}

.current-stats__label {
  color: rgba(255, 255, 255, 0.6);
}

@media screen and (min-width: 576px) {
  .current-temperature,
  .current-stats {
    width: 50%;
  }
}

/* weather-by-hour */
.weather-by-hour {
  display: none;
  width: 100%;
}

@media screen and (min-width: 576px) {
  .weather-by-hour {
    display: block;
  }
}

.weather-by-hour__container {
  display: flex;
  justify-content: space-between;
}

.weather-by-hour__heading,
.next-5-days__heading {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1em;
  font-weight: normal;
}

@media screen and (min-width: 768px) {
  .weather-by-hour__heading,
  .next-5-days__heading {
    font-size: 1.125em;
  }
}

.weather-by-hour__item {
  padding: 0.8em 0;
  width: 13%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.15);
  font-size: 1.125em;
  text-align: center;
}

@media screen and (min-width: 880px) {
  .weather-by-hour__item {
    width: 6.05em;
  }
}

.weather-by-hour__hour {
  margin-bottom: 0.5em;
}

/* next-5-days */
.next-5-days {
  width: 100%;
  margin-top: 1em;
}

.next-5-days__container {
  display: flex;
  flex-wrap: wrap;
}

.next-5-days__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 0.3em;
  padding: 0.8em 0;
  width: 100%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 1.19em;
  text-align: center;
}

.next-5-days__label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.83em;
}

.next-5-days__date,
.next-5-days__high,
.next-5-days__low,
.next-5-days__icon,
.next-5-days__rain,
.next-5-days__wind {
  width: 33.33333%;
  font-size: 0.95em;
}

.next-5-days__date,
.next-5-days__high,
.next-5-days__low {
  margin-bottom: 0.6em;
}

@media screen and (min-width: 450px) {
  .next-5-days__date,
  .next-5-days__high,
  .next-5-days__low,
  .next-5-days__icon,
  .next-5-days__rain,
  .next-5-days__wind {
    width: 16.666666%;
    margin-bottom: initial;
  }

  .next-5-days__date {
    order: -2;
  }

  .next-5-days__icon {
    order: -1;
  }
}
</style>
