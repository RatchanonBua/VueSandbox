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
  <div class="min-h-screen px-4 pt-4 pb-12 text-white bg-no-repeat bg-fixed bg-gradient-to-b from-blue-900 to-blue-500 dark:from-gray-900 dark:to-gray-500">
    <div class="forecast-search" v-show="false"></div>
    <div class="forecast-result" v-show="true">
      <!-- Location & Date -->
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
      <!-- Forecast Group -->
      <div class="flex flex-col bs-sm:flex-row">
        <!-- Current Temperature -->
        <div class="flex mt-4 mb-4 justify-center items-center bs-sm:w-1/2">
          <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="Forecast Icon" class="h-[76px] my-4 aspect-square rounded-full bg-gray-200 bg-opacity-60" />
          <div class="ml-4 my-4">
            <div class="text-5xl font-bold text-right">25&deg;C</div>
            <div class="text-lg text-center">อากาศแจ่มใส</div>
          </div>
        </div>
        <!-- Current Stats -->
        <div class="bs-sm:w-1/2">
          <div class="flex justify-around text-center mb-4 bs-sm:my-4">
            <div class="group">
              <div class="pb-2">
                <div class="text-xl">15&deg;C</div>
                <div class="text-white text-opacity-60">ต่ำสุด</div>
              </div>
              <div class="pt-2">
                <div class="text-xl">35&deg;C</div>
                <div class="text-white text-opacity-60">สูงสุด</div>
              </div>
            </div>
            <div class="group">
              <div class="pb-2">
                <div class="text-xl">30 km/h</div>
                <div class="text-white text-opacity-60">ความเร็วลม</div>
              </div>
              <div class="pt-2">
                <div class="text-xl">0%</div>
                <div class="text-white text-opacity-60">ปริมาณฝน</div>
              </div>
            </div>
            <div class="group">
              <div class="pb-2">
                <div class="text-xl">06:00</div>
                <div class="text-white text-opacity-60">อาทิตย์ขึ้น</div>
              </div>
              <div class="pt-2">
                <div class="text-xl">18:00</div>
                <div class="text-white text-opacity-60">อาทิตย์ตก</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Weather by Hour -->
      <div class="hidden bs-sm:block">
        <h2 class="pb-2 text-base text-white text-opacity-80">สภาพอากาศวันนี้</h2>
        <div class="grid grid-cols-7 gap-2 pb-2">
          <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
            <div class="text-base mb-1">03:00</div>
            <div class="p-2 pt-0 flex justify-center">
              <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
            </div>
            <div class="text-sm mt-0.5">15&deg;C</div>
          </div>
          <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
            <div class="text-base mb-1">06:00</div>
            <div class="p-2 pt-0 flex justify-center">
              <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
            </div>
            <div class="text-sm mt-0.5">20&deg;C</div>
          </div>
          <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
            <div class="text-base mb-1">09:00</div>
            <div class="p-2 pt-0 flex justify-center">
              <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
            </div>
            <div class="text-sm mt-0.5">25&deg;C</div>
          </div>
          <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
            <div class="text-base mb-1">12:00</div>
            <div class="p-2 pt-0 flex justify-center">
              <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
            </div>
            <div class="text-sm mt-0.5">30&deg;C</div>
          </div>
          <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
            <div class="text-base mb-1">15:00</div>
            <div class="p-2 pt-0 flex justify-center">
              <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
            </div>
            <div class="text-sm mt-0.5">35&deg;C</div>
          </div>
          <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
            <div class="text-base mb-1">18:00</div>
            <div class="p-2 pt-0 flex justify-center">
              <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
            </div>
            <div class="text-sm mt-0.5">25&deg;C</div>
          </div>
          <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
            <div class="text-base mb-1">21:00</div>
            <div class="p-2 pt-0 flex justify-center">
              <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
            </div>
            <div class="text-sm mt-0.5">15&deg;C</div>
          </div>
        </div>
      </div>
      <!-- Future Forecast -->
      <div class="w-full">
        <h2 class="pb-2 text-base text-white text-opacity-80">สภาพอากาศในอีก 5 วัน</h2>
        <div class="flex flex-wrap">
          <!-- Start:Item 1 -->
          <div class="flex flex-wrap justify-around items-center mb-2 py-4 w-full rounded bg-black bg-opacity-20 text-xl text-center gap-y-4">
            <!-- Date -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-2">
              <span class="text-lg">ศ.</span>
              <div class="text-white text-opacity-60 text-base">22 พ.ย.</div>
            </div>
            <!-- Low Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">15&deg;C</span>
              <div class="text-white text-opacity-60 text-base">ต่ำสุด</div>
            </div>
            <!-- High Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">35&deg;C</span>
              <div class="text-white text-opacity-60 text-base">สูงสุด</div>
            </div>
            <!-- Icon -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-1">
              <div class="flex justify-center">
                <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
              </div>
            </div>
            <!-- Wind -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">30 km/h</span>
              <div class="text-white text-opacity-60 text-base">ความเร็วลม</div>
            </div>
            <!-- Rain -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">0%</span>
              <div class="text-white text-opacity-60 text-base">ปริมาณฝน</div>
            </div>
          </div>
          <!-- End:Item 1 -->
          <!-- Start:Item 2 -->
          <div class="flex flex-wrap justify-around items-center mb-2 py-4 w-full rounded bg-black bg-opacity-20 text-xl text-center gap-y-4">
            <!-- Date -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-2">
              <span class="text-lg">ส.</span>
              <div class="text-white text-opacity-60 text-base">23 พ.ย.</div>
            </div>
            <!-- Low Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">15&deg;C</span>
              <div class="text-white text-opacity-60 text-base">ต่ำสุด</div>
            </div>
            <!-- High Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">35&deg;C</span>
              <div class="text-white text-opacity-60 text-base">สูงสุด</div>
            </div>
            <!-- Icon -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-1">
              <div class="flex justify-center">
                <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
              </div>
            </div>
            <!-- Wind -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">30 km/h</span>
              <div class="text-white text-opacity-60 text-base">ความเร็วลม</div>
            </div>
            <!-- Rain -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">0%</span>
              <div class="text-white text-opacity-60 text-base">ปริมาณฝน</div>
            </div>
          </div>
          <!-- End:Item 2 -->
          <!-- Start:Item 3 -->
          <div class="flex flex-wrap justify-around items-center mb-2 py-4 w-full rounded bg-black bg-opacity-20 text-xl text-center gap-y-4">
            <!-- Date -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-2">
              <span class="text-lg">อา.</span>
              <div class="text-white text-opacity-60 text-base">24 พ.ย.</div>
            </div>
            <!-- Low Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">15&deg;C</span>
              <div class="text-white text-opacity-60 text-base">ต่ำสุด</div>
            </div>
            <!-- High Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">35&deg;C</span>
              <div class="text-white text-opacity-60 text-base">สูงสุด</div>
            </div>
            <!-- Icon -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-1">
              <div class="flex justify-center">
                <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
              </div>
            </div>
            <!-- Wind -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">30 km/h</span>
              <div class="text-white text-opacity-60 text-base">ความเร็วลม</div>
            </div>
            <!-- Rain -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">0%</span>
              <div class="text-white text-opacity-60 text-base">ปริมาณฝน</div>
            </div>
          </div>
          <!-- End:Item 3 -->
          <!-- Start:Item 4 -->
          <div class="flex flex-wrap justify-around items-center mb-2 py-4 w-full rounded bg-black bg-opacity-20 text-xl text-center gap-y-4">
            <!-- Date -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-2">
              <span class="text-lg">จ.</span>
              <div class="text-white text-opacity-60 text-base">25 พ.ย.</div>
            </div>
            <!-- Low Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">15&deg;C</span>
              <div class="text-white text-opacity-60 text-base">ต่ำสุด</div>
            </div>
            <!-- High Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">35&deg;C</span>
              <div class="text-white text-opacity-60 text-base">สูงสุด</div>
            </div>
            <!-- Icon -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-1">
              <div class="flex justify-center">
                <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
              </div>
            </div>
            <!-- Wind -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">30 km/h</span>
              <div class="text-white text-opacity-60 text-base">ความเร็วลม</div>
            </div>
            <!-- Rain -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">0%</span>
              <div class="text-white text-opacity-60 text-base">ปริมาณฝน</div>
            </div>
          </div>
          <!-- End:Item 4 -->
          <!-- Start:Item 5 -->
          <div class="flex flex-wrap justify-around items-center mb-2 py-4 w-full rounded bg-black bg-opacity-20 text-xl text-center gap-y-4">
            <!-- Date -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-2">
              <span class="text-lg">อ.</span>
              <div class="text-white text-opacity-60 text-base">26 พ.ย.</div>
            </div>
            <!-- Low Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">15&deg;C</span>
              <div class="text-white text-opacity-60 text-base">ต่ำสุด</div>
            </div>
            <!-- High Temp. -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">35&deg;C</span>
              <div class="text-white text-opacity-60 text-base">สูงสุด</div>
            </div>
            <!-- Icon -->
            <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-1">
              <div class="flex justify-center">
                <img src="https://openweathermap.org/img/wn/10d.png" alt="Image" class="aspect-square rounded-full bg-gray-200 bg-opacity-60" />
              </div>
            </div>
            <!-- Wind -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">30 km/h</span>
              <div class="text-white text-opacity-60 text-base">ความเร็วลม</div>
            </div>
            <!-- Rain -->
            <div class="w-1/3 bs-sm:w-1/6">
              <span class="text-lg">0%</span>
              <div class="text-white text-opacity-60 text-base">ปริมาณฝน</div>
            </div>
          </div>
          <!-- End:Item 5 -->
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
