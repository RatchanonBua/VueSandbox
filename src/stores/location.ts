import { ref } from "vue";
import { defineStore } from "pinia";
// Interfaces
type GeoLocationData = {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestampNum: number | null;
  timestampStr: string | null;
  errorMessage: string | null;
  isGPSError: boolean;
}
// Export
export const useLocationStore = defineStore("location", () => {
  // Location Data
  const locationData = ref<GeoLocationData>({
    latitude: null,
    longitude: null,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    timestampNum: null,
    timestampStr: "",
    errorMessage: null,
    isGPSError: false,
  });
  // Init Location Service
  const initLocationService = (): void => {
    if (navigator.geolocation) {
      if (navigator.permissions) {
        navigator.permissions.query({ name: "geolocation" }).then((permission) => {
          if (permission.state === "granted" || permission.state === "prompt") {
            console.log("init-location-service:ok-perms", permission.state);
            getLocationFromGPS();
          } else {
            console.log("init-location-service:no-perms", permission.state);
            handleLocationError(true, false);
          }
        });
      } else {
        console.log("init-location-service:no-perms");
        getLocationFromGPS();
      }
    } else {
      console.log("init-location-service:no-api");
      handleLocationError(false, false);
    }
  };
  // Get Location From GPS
  const getLocationFromGPS = (): void => {
    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordsJSON = position.coords.toJSON();
        // Timestamp Data
        const tsNum = position.timestamp;
        const tsStr = new Date(tsNum).toISOString();
        locationData.value = { ...coordsJSON, timestampNum: tsNum, timestampStr: tsStr };
        // Check Location Data
        const posLat = position.coords.latitude;
        const posLon = position.coords.longitude;
        if (typeof posLat === "number" && typeof posLon === "number" && posLat >= -90 && posLat <= 90 && posLon >= -180 && posLon <= 180) {
          // Update Data
          locationData.value = { ...coordsJSON, errorMessage: null, isGPSError: false };
          console.log(locationData.value);
        } else {
          handleLocationError(true, true);
        }
      },
      () => {
        console.log("get-location-from-gps:error");
        handleLocationError(true, true);
      },
      options
    );
  };
  // Handle Location Error
  const handleLocationError = (hasGeolocation: boolean, hasPermission: boolean): void => {
    locationData.value.isGPSError = true;
    if (!hasGeolocation) {
      locationData.value.errorMessage = "อุปกรณ์ไม่รองรับการทำงานของ GPS";
    } else if (!hasPermission) {
      locationData.value.errorMessage = "คุณไม่ได้อนุญาตการทำงานของ GPS";
    } else {
      locationData.value.errorMessage = "GPS ของคุณมีปัญหา กรุณาลองอีกครั้ง";
    }
  };
  // Return Data
  return { locationData, initLocationService };
});
