<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-case-declarations -->
<script lang="ts">
// Import Declarations
import type { GeoLocationData } from "@/utils/types";
// Import Functions
import { getDateTimeStringByLang } from "@/utils/functions";
// Import Stores
import { useLocationStore } from "@/stores/location";
// Import API
import { fetchLocationString, fetchLocationCoords } from "@/api/location";
import { fetchCurrentWeather, fetchThreeHourWeather } from "@/api/weather";
// Import Icons
import IconXMark from "@/components/icons/useful/IconXMark.vue";
import IconSearch from "@/components/icons/useful/IconSearch.vue";
import IconLoading from "@/components/icons/useful/IconLoading.vue";
// Import Components
import ImageComponent from "@/components/groups/useful/ImageComponent.vue";
// Import Items
import CurrentStatsItem from "@/components/groups/weather/CurrentStatsItem.vue";
import WeatherHourItem from "@/components/groups/weather/WeatherHourItem.vue";
import WeatherNextItem from "@/components/groups/weather/WeatherNextItem.vue";

// Export Components
export default {
  name: "WeatherForecastView",
  components: { IconXMark, IconSearch, IconLoading, ImageComponent, CurrentStatsItem, WeatherHourItem, WeatherNextItem },
  data() {
    return {
      searchStr: "",
      locGPSData: null as GeoLocationData | null,
      locationName: "???",
      currWeatherData: null as Record<string, any> | null,
      nextWeatherData: null as Record<string, any> | null,
      dateWeatherData: null as Record<string, any> | null,
      errorGPSMessage: null as string | null,
      errorAPIMessage: null as string | null,
      isShowResult: false,
      isShowCrossX: false,
      btnCSS: "text-white pt-0.5",
      dtCurrString: "",
      isLoading: { byStr: false, byGPS: false, general: false },
    };
  },
  setup() {
    const locationStore = useLocationStore();
    const getDateStrLang = getDateTimeStringByLang;
    return { locationStore, getDateStrLang };
  },
  methods: {
    toggleSearchArea(): void {
      if (this.isShowResult) {
        this.toggleLoadData(false, "byStr");
        this.toggleLoadData(false, "byGPS");
      }
      this.isShowResult = !this.isShowResult;
    },
    toggleLoadData(toggle: boolean, type: keyof typeof this.isLoading): void {
      this.isLoading[type] = toggle;
      if (type === "general") {
        this.isLoading.general = toggle;
      }
    },
    clearErrors(): void {
      this.errorGPSMessage = null;
      this.errorAPIMessage = null;
    },
    // Search Section
    async fetchLocationByStr(): Promise<void> {
      this.clearErrors();
      this.toggleLoadData(true, "byStr");
      this.searchStr = this.searchStr.trim();
      if (this.searchStr.length === 0) {
        this.errorAPIMessage = "กรุณาระบุชื่อสถานที่";
        this.toggleLoadData(false, "byStr");
      } else {
        this.getDataByLocationStr(this.searchStr);
      }
    },
    async getDataByLocationStr(searchStr: string | null = ""): Promise<void> {
      // console.log(`Search String: ${searchStr}`);
      try {
        // Location Data
        const locationResult: Record<string, any> = await fetchLocationString(String(searchStr));
        const locationData: Record<string, any> = locationResult.data;
        const locationName: string = locationResult.full_name;
        if (typeof locationData?.lat === "number" && typeof locationData?.lon === "number") {
          try {
            // Weather Curr Value
            const weatherCurrResult: Record<string, any> = await fetchCurrentWeather(locationData.lat, locationData.lon);
            this.currWeatherData = weatherCurrResult.obj;
            // Weather Next Value
            const weatherNextResult: Record<string, any> = await fetchThreeHourWeather(locationData.lat, locationData.lon);
            this.nextWeatherData = weatherNextResult.obj;
            // Other Values
            this.locationName = locationName;
            this.isShowCrossX = true;
            this.isShowResult = true;
          } catch (errorObj: any) {
            this.errorAPIMessage = `เกิดข้อผิดพลาดขึ้น (${errorObj.errorMsg})`;
          }
        } else {
          this.errorAPIMessage = `เกิดข้อผิดพลาดขึ้น (ERR_LOC: LAT/LON)`;
        }
        // Weather Data
      } catch (errorObj: any) {
        if (errorObj.errorType === "data") {
          this.errorAPIMessage = `ไม่พบข้อมูลสถานที่`;
        } else {
          this.errorAPIMessage = `เกิดข้อผิดพลาดขึ้น ${errorObj.errorMsg}`;
        }
      }
    },
    // GPS Section
    async fetchLocationByGPS(): Promise<void> {
      this.clearErrors();
      this.toggleLoadData(true, "byGPS");
      // Fetch Data
      try {
        await this.locationStore.initLocationService();
        this.locGPSData = this.locationStore.locationData;
        this.getDataByLocationGPS(this.locGPSData.latitude, this.locGPSData.longitude);
      } catch (error: any) {
        this.errorGPSMessage = error.message;
        this.toggleLoadData(true, "byGPS");
        console.log("Error: ", this.errorGPSMessage);
      }
    },
    async getDataByLocationGPS(lat: number | null = 0, lon: number | null = 0): Promise<void> {
      // await this.fetchWeatherData(lat, lon, "byGPS");
      try {
        const locationResult: Record<string, any> = await fetchLocationCoords(Number(lat), Number(lon));
        const locationData: Record<string, any> = locationResult.data;
        const locationName: string = locationResult.full_name;
        if (typeof locationData?.lat === "number" && typeof locationData?.lon === "number") {
          try {
            // Weather Curr Value
            const weatherCurrResult: Record<string, any> = await fetchCurrentWeather(locationData.lat, locationData.lon);
            this.currWeatherData = weatherCurrResult.obj;
            // Weather Next Value
            const weatherNextResult: Record<string, any> = await fetchThreeHourWeather(locationData.lat, locationData.lon);
            this.nextWeatherData = weatherNextResult.obj;
            // Other Values
            this.locationName = locationName;
            this.isShowCrossX = true;
            this.isShowResult = true;
          } catch (errorObj: any) {
            this.errorAPIMessage = `เกิดข้อผิดพลาดขึ้น (${errorObj.errorMsg})`;
          }
        } else {
          this.errorAPIMessage = `เกิดข้อผิดพลาดขึ้น (ERR_LOC: LAT/LON)`;
        }
      } catch (errorObj: any) {
        if (errorObj.errorType === "data") {
          this.errorAPIMessage = `ไม่พบข้อมูลสถานที่`;
        } else {
          this.errorAPIMessage = `เกิดข้อผิดพลาดขึ้น (${errorObj.errorMsg})`;
        }
      }
    },
  },
  computed: {
    getGPSErrorMessage() {
      return this.errorGPSMessage;
    },
    getAPIErrorMessage() {
      return this.errorAPIMessage;
    },
    getLocationData() {
      return this.locGPSData;
    },
    getLocationName() {
      return this.locationName;
    },
    getCurrWeatherData() {
      return this.currWeatherData;
    },
    getNextWeatherData() {
      return this.nextWeatherData;
    },
    getDateTimeString() {
      return this.dtCurrString;
    },
  },
};
</script>

<template>
  <div class="min-h-screen px-4 pt-4 pb-12 text-white bg-no-repeat bg-fixed bg-gradient-to-b from-blue-900 to-blue-500 dark:from-gray-900 dark:to-gray-500">
    <!-- Search Area -->
    <transition name="fade" mode="out-in">
      <div class="relative" v-show="!isShowResult">
        <!-- Parent Container with padding -->
        <div class="forecast-search">
          <div class="flex justify-center items-center min-h-screen -mt-4 -mb-12">
            <div class="w-full max-w-lg p-4 bg-opacity-20 bg-black shadow-lg rounded-lg">
              <div class="relative">
                <div class="absolute w-full -top-1 text-right">
                  <button class="w-5 h-5 rounded-full object-cover" :style="{ visibility: isShowCrossX ? 'visible' : 'hidden' }" @click="toggleSearchArea">
                    <IconXMark :cssClass="btnCSS" />
                  </button>
                </div>
              </div>
              <div class="space-y-4">
                <div class="input-group">
                  <div class="flex w-full justify-center p-4">
                    <img src="https://cdn-icons-png.flaticon.com/512/2272/2272221.png" alt="Weather Forecast" class="w-40 h-40" />
                  </div>
                  <h3 class="text-lg font-semibold text-center pb-2">ค้นหาสถานที่โดยใส่ชื่อเมือง</h3>
                  <div class="flex items-center space-x-2 box-border">
                    <!-- Search Bar -->
                    <input type="text" v-model="searchStr" placeholder="ค้นหาชื่อเมือง" class="h-12 w-full px-4 py-2 text-black dark:text-white dark:bg-opacity-20 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 box-border" />
                    <!-- Search Button with icon -->
                    <button :disabled="isLoading.general" @click="fetchLocationByStr" class="flex items-center justify-center h-12 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 box-border transition duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale">
                      <IconLoading v-if="isLoading.general && isLoading.byStr" class="w-7 h-7 text-white" />
                      <IconSearch v-else class="w-7 h-7 text-white" />
                    </button>
                  </div>
                </div>
                <div class="error-api-group" v-if="getAPIErrorMessage">
                  <div class="text-red-400 font-semibold text-center whitespace-pre-line">{{ getAPIErrorMessage }}</div>
                </div>
                <div class="separator-group">
                  <div class="flex justify-center items-center space-x-2">
                    <div class="w-full border-t-2 border-gray-400 dark:border-gray-600"></div>
                    <span class="text-white font-semibold">หรือ</span>
                    <div class="w-full border-t-2 border-gray-400 dark:border-gray-600"></div>
                  </div>
                </div>
                <div class="button-group">
                  <button :disabled="isLoading.general" @click="fetchLocationByGPS" class="w-full px-6 py-2 text-white font-medium bg-green-500 hover:bg-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 box-border transition duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale">
                    <div v-if="isLoading.general && isLoading.byGPS" class="flex items-center justify-center gap-x-1">
                      <IconLoading class="w-[20px] h-[20px] text-white" />
                      <span>กำลังโหลด...</span>
                    </div>
                    <div v-else class="flex items-center justify-center gap-x-1">
                      <span>ระบุสถานที่ปัจจุบันโดยใช้ GPS</span>
                    </div>
                  </button>
                </div>
                <div class="error-gps-group" v-if="getGPSErrorMessage">
                  <div class="text-red-400 font-semibold text-center whitespace-pre-line">{{ getGPSErrorMessage }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- Result Area -->
    <transition name="fade" mode="out-in">
      <div class="relative" v-show="isShowResult">
        <div class="forecast-result">
          <!-- Location & Date -->
          <div class="flex grow pb-2">
            <div class="w-full">
              <h1 class="m-0 text-xl font-semibold" id="city-str">{{ getLocationName }}</h1>
              <!-- <div class="text-sm" id="date-str" v-if="getCurrWeatherData?.dt_str">{{ getCurrWeatherData.dt_str }}</div> -->
              <div class="hidden" v-if="getLocationData?.latitude && getLocationData?.longitude">{{ getLocationData.latitude }},{{ getLocationData.longitude }}</div>
            </div>
            <div class="search-button ml-4 text-right h-6">
              <button class="w-5 h-5 rounded-full object-cover" @click="toggleSearchArea">
                <IconSearch :cssClass="btnCSS" />
              </button>
            </div>
          </div>
          <!-- Forecast Group -->
          <div class="block border-t-2">
            <div class="pt-2">
              <h2 class="text-base font-bold text-white text-opacity-80">สภาพอากาศปัจจุบัน (ณ สถานที่)</h2>
              <div class="text-sm" v-if="getCurrWeatherData?.dt_str">ข้อมูล ณ {{ getCurrWeatherData.dt_str }}</div>
            </div>
            <div class="flex flex-col bs-sm:flex-row">
              <!-- Current Temperature -->
              <div class="flex mt-4 mb-4 justify-center items-center bs-sm:w-1/2">
                <div class="my-4 rounded-full bg-gray-200 bg-opacity-60">
                  <ImageComponent :urlImg="getCurrWeatherData?.icon ?? ''" :altImg="getCurrWeatherData?.desc ?? ''" cssClass="h-[76px] aspect-square rounded-full" :isShowErr="true" errClass="h-[76px] aspect-square rounded-full p-3"></ImageComponent>
                </div>
                <div class="ml-4 my-4">
                  <div class="text-5xl font-bold text-right">{{ getCurrWeatherData?.temp ?? "N/A" }}</div>
                  <div class="text-lg text-center">{{ getCurrWeatherData?.desc ?? "N/A" }}</div>
                </div>
              </div>
              <!-- Current Stats -->
              <div class="bs-sm:w-1/2 mb-4 bs-sm:my-4">
                <div class="flex flex-wrap justify-around text-center gap-y-2">
                  <CurrentStatsItem>
                    <template #value>{{ getCurrWeatherData?.temp_min ?? "N/A" }}</template>
                    <template #label>ต่ำสุด (ปัจจุบัน)</template>
                  </CurrentStatsItem>
                  <CurrentStatsItem>
                    <template #value>{{ getCurrWeatherData?.wind_speed ?? "N/A" }}</template>
                    <template #label>ความเร็วลม</template>
                  </CurrentStatsItem>
                  <CurrentStatsItem>
                    <template #value>{{ getCurrWeatherData?.sunrise ?? "N/A" }}</template>
                    <template #label>ขึ้น (ณ สถานที่)</template>
                  </CurrentStatsItem>
                  <CurrentStatsItem>
                    <template #value>{{ getCurrWeatherData?.temp_max ?? "N/A" }}</template>
                    <template #label>สูงสุด (ปัจจุบัน)</template>
                  </CurrentStatsItem>
                  <CurrentStatsItem>
                    <template #value>{{ getCurrWeatherData?.humidity ?? "N/A" }}</template>
                    <template #label>ค่าความชื้น</template>
                  </CurrentStatsItem>
                  <CurrentStatsItem>
                    <template #value>{{ getCurrWeatherData?.sunset ?? "N/A" }}</template>
                    <template #label>ตก (ณ สถานที่)</template>
                  </CurrentStatsItem>
                </div>
              </div>
            </div>
          </div>
          <!-- Weather by Hour -->
          <div class="hidden bs-sm:block">
            <h2 class="pb-2 text-base font-bold text-white text-opacity-80">สภาพอากาศชั่วโมงถัดไป (ณ สถานที่)</h2>
            <!-- Weather Next Hour: If Block -->
            <div class="grid grid-cols-7 gap-2 pb-2" v-if="Array.isArray(getNextWeatherData?.next?.list) && getNextWeatherData.next.list.length > 0">
              <WeatherHourItem v-for="(item, index) in getNextWeatherData.next.list" :key="index">
                <template #time>{{ item.time }}</template>
                <template #image>
                  <ImageComponent :urlImg="item.icon" :altImg="item.desc" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
                </template>
                <template #value>{{ item.temp }}</template>
              </WeatherHourItem>
            </div>
            <!-- Weather Next Hour: Else Block -->
            <div class="pb-2" v-else>
              <div class="text-sm font-light">*ไม่พบข้อมูลสภาพอากาศชั่วโมงถัดไป*</div>
            </div>
          </div>
          <!-- Future Forecast -->
          <div class="w-full">
            <h2 class="pb-2 text-base font-bold text-white text-opacity-80">พยากรณ์อากาศในวันอื่น (ณ สถานที่)</h2>
            <div class="flex flex-wrap">
              <!-- Start:Item 1 -->
              <WeatherNextItem>
                <template #date-wkday>ศ.</template>
                <template #date-label>22 พ.ย.</template>
                <template #low-value>15&deg;C</template>
                <template #high-value>35&deg;C</template>
                <template #image>
                  <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
                </template>
                <template #wind-value>30 km/h</template>
                <template #rain-value>0%</template>
              </WeatherNextItem>
              <!-- End:Item 1 -->
              <!-- Start:Item 2 -->
              <WeatherNextItem>
                <template #date-wkday>ส.</template>
                <template #date-label>23 พ.ย.</template>
                <template #low-value>15&deg;C</template>
                <template #high-value>35&deg;C</template>
                <template #image>
                  <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
                </template>
                <template #wind-value>30 km/h</template>
                <template #rain-value>0%</template>
              </WeatherNextItem>
              <!-- End:Item 2 -->
              <!-- Start:Item 3 -->
              <WeatherNextItem>
                <template #date-wkday>อา.</template>
                <template #date-label>24 พ.ย.</template>
                <template #low-value>15&deg;C</template>
                <template #high-value>35&deg;C</template>
                <template #image>
                  <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
                </template>
                <template #wind-value>30 km/h</template>
                <template #rain-value>0%</template>
              </WeatherNextItem>
              <!-- End:Item 3 -->
              <!-- Start:Item 4 -->
              <WeatherNextItem>
                <template #date-wkday>จ.</template>
                <template #date-label>25 พ.ย.</template>
                <template #low-value>15&deg;C</template>
                <template #high-value>35&deg;C</template>
                <template #image>
                  <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
                </template>
                <template #wind-value>30 km/h</template>
                <template #rain-value>0%</template>
              </WeatherNextItem>
              <!-- End:Item 4 -->
              <!-- Start:Item 5 -->
              <WeatherNextItem>
                <template #date-wkday>อ.</template>
                <template #date-label>26 พ.ย.</template>
                <template #low-value>15&deg;C</template>
                <template #high-value>35&deg;C</template>
                <template #image>
                  <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
                </template>
                <template #wind-value>30 km/h</template>
                <template #rain-value>0%</template>
              </WeatherNextItem>
              <!-- End:Item 5 -->
            </div>
          </div>
        </div>
      </div>
    </transition>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 500ms ease;
  position: relative;
  overflow: hidden;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
