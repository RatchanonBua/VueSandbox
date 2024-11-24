<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-case-declarations -->
<script lang="ts">
// Import Declarations
import type { GeoLocationData } from "@/utils/types";
// Import Functions
import { getDateStringByLang } from "@/utils/functions";
// Import Stores
import { useLocationStore } from "@/stores/location";
// Import API
import { fetchLocationString, fetchLocationCoords } from "@/api/location";
// Import Icons
import IconSearch from "@/components/icons/useful/IconSearch.vue";
// Import Components
import ImageComponent from "@/components/groups/useful/ImageComponent.vue";
// Import Items
import CurrentStatsItem from "@/components/groups/weather/CurrentStatsItem.vue";
import WeatherHourItem from "@/components/groups/weather/WeatherHourItem.vue";
import WeatherNextItem from "@/components/groups/weather/WeatherNextItem.vue";
// Export Components
export default {
  name: "WeatherForecastView",
  components: { IconSearch, ImageComponent, CurrentStatsItem, WeatherHourItem, WeatherNextItem },
  data() {
    return {
      locationData: null as GeoLocationData | null,
      errorMessage: null as string | null,
      locationName: "กำลังโหลด..." as string | null,
      btnCSS: "text-white pt-0.5",
    };
  },
  setup() {
    const locationStore = useLocationStore();
    const getDateStrLang = getDateStringByLang;
    return { locationStore, getDateStrLang };
  },
  methods: {
    async fetchLocationByGPS(): Promise<void> {
      try {
        await this.locationStore.initLocationService();
        this.locationData = this.locationStore.locationData;
        this.getCityNameByLocation(this.locationData.latitude, this.locationData.longitude);
        // this.getCityNameBySearchStr("Khu Khot");
      } catch (error: any) {
        this.errorMessage = error.message;
        console.log("Error: ", this.errorMessage);
      }
    },
    async getCityNameByLocation(lat: number | null = 0, lon: number | null = 0): Promise<void> {
      // console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      try {
        const result: Record<string, any> = await fetchLocationCoords(Number(lat), Number(lon));
        const data: Record<string, any> = result.data;
        const name: string = result.full_name;
        this.locationName = name;
      } catch (errorObj: any) {
        if (errorObj.errorType === "data") {
          this.locationName = "ไม่พบข้อมูลพื้นที่";
        } else {
          this.locationName = "เกิดข้อผิดพลาด";
        }
      }
    },
    async getCityNameBySearchStr(searchStr: string | null = ""): Promise<void> {
      // console.log(`Search String: ${searchStr}`);
      try {
        const result: Record<string, any> = await fetchLocationString(String(searchStr));
        const data: Record<string, any> = result.data;
        const name: string = result.full_name;
        this.locationName = name;
      } catch (errorObj: any) {
        if (errorObj.errorType === "data") {
          this.locationName = "ไม่พบข้อมูลพื้นที่";
        } else {
          this.locationName = "เกิดข้อผิดพลาด";
        }
      }
    },
  },
  computed: {
    getLocationData() {
      return this.locationData;
    },
    getErrorMessage() {
      return this.errorMessage;
    },
  },
};
</script>

<template>
  <div class="min-h-screen px-4 pt-4 pb-12 text-white bg-no-repeat bg-fixed bg-gradient-to-b from-blue-900 to-blue-500 dark:from-gray-900 dark:to-gray-500">
    <div class="forecast-search" v-show="false"></div>
    <div class="forecast-result" v-show="true">
      <!-- Location & Date -->
      <div class="flex grow">
        <div class="w-full">
          <h1 class="m-0 text-2xl font-semibold" id="city-str">{{ locationName }}</h1>
          <div class="empty" id="date-str">{{ getDateStrLang("th") }}</div>
          <div class="hidden" v-if="getLocationData?.latitude && getLocationData?.longitude">{{ getLocationData.latitude }},{{ getLocationData.longitude }}</div>
        </div>
        <div class="search-button ml-4">
          <button class="w-6 h-6 rounded-full object-cover" @click="fetchLocationByGPS">
            <IconSearch :cssClass="btnCSS" />
          </button>
        </div>
      </div>
      <!-- Forecast Group -->
      <div class="flex flex-col bs-sm:flex-row">
        <!-- Current Temperature -->
        <div class="flex mt-4 mb-4 justify-center items-center bs-sm:w-1/2">
          <div class="my-4 rounded-full bg-gray-200 bg-opacity-60">
            <ImageComponent urlImg="https://openweathermap.org/img/wn/10d@2x.png" altImg="Forecast Icon" cssClass="h-[76px] aspect-square rounded-full" :isShowErr="true" errClass="h-[76px] aspect-square rounded-full p-3"></ImageComponent>
          </div>
          <div class="ml-4 my-4">
            <div class="text-5xl font-bold text-right">25&deg;C</div>
            <div class="text-lg text-center">อากาศแจ่มใส</div>
          </div>
        </div>
        <!-- Current Stats -->
        <div class="bs-sm:w-1/2">
          <div class="flex flex-wrap justify-around text-center mb-4 bs-sm:my-4 gap-y-2">
            <CurrentStatsItem>
              <template #value>15&deg;C</template>
              <template #label>ต่ำสุด</template>
            </CurrentStatsItem>
            <CurrentStatsItem>
              <template #value>30 km/h</template>
              <template #label>ความเร็วลม</template>
            </CurrentStatsItem>
            <CurrentStatsItem>
              <template #value>06:00</template>
              <template #label>อาทิตย์ขึ้น</template>
            </CurrentStatsItem>
            <CurrentStatsItem>
              <template #value>35&deg;C</template>
              <template #label>สูงสุด</template>
            </CurrentStatsItem>
            <CurrentStatsItem>
              <template #value>0%</template>
              <template #label>ปริมาณฝน</template>
            </CurrentStatsItem>
            <CurrentStatsItem>
              <template #value>18:00</template>
              <template #label>อาทิตย์ตก</template>
            </CurrentStatsItem>
          </div>
        </div>
      </div>
      <!-- Weather by Hour -->
      <div class="hidden bs-sm:block">
        <h2 class="pb-2 text-base text-white text-opacity-80">สภาพอากาศวันนี้</h2>
        <div class="grid grid-cols-7 gap-2 pb-2">
          <WeatherHourItem>
            <template #time>03:00</template>
            <template #image>
              <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
            </template>
            <template #value>15&deg;C</template>
          </WeatherHourItem>
          <WeatherHourItem>
            <template #time>06:00</template>
            <template #image>
              <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
            </template>
            <template #value>20&deg;C</template>
          </WeatherHourItem>
          <WeatherHourItem>
            <template #time>09:00</template>
            <template #image>
              <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
            </template>
            <template #value>25&deg;C</template>
          </WeatherHourItem>
          <WeatherHourItem>
            <template #time>12:00</template>
            <template #image>
              <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
            </template>
            <template #value>30&deg;C</template>
          </WeatherHourItem>
          <WeatherHourItem>
            <template #time>15:00</template>
            <template #image>
              <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
            </template>
            <template #value>35&deg;C</template>
          </WeatherHourItem>
          <WeatherHourItem>
            <template #time>18:00</template>
            <template #image>
              <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
            </template>
            <template #value>25&deg;C</template>
          </WeatherHourItem>
          <WeatherHourItem>
            <template #time>21:00</template>
            <template #image>
              <ImageComponent urlImg="https://openweathermap.org/img/wn/10d.png" altImg="Forecast Icon" cssClass="aspect-square rounded-full bg-gray-200 bg-opacity-60" :isShowErr="true" errClass="h-[50px] aspect-square rounded-full p-3"></ImageComponent>
            </template>
            <template #value>15&deg;C</template>
          </WeatherHourItem>
        </div>
      </div>
      <!-- Future Forecast -->
      <div class="w-full">
        <h2 class="pb-2 text-base text-white text-opacity-80">สภาพอากาศในอีก 5 วัน</h2>
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
