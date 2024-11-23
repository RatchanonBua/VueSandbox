import { ref } from "vue";
import { defineStore } from "pinia";
import type { GeoLocationData } from "@/utils/types";
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
    timestampStr: null,
  });
  // Init Location Service
  const initLocationService = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        // checkLocationPerms(resolve, reject);
        getLocationFromGPS(resolve, reject);
      } else {
        console.log("init-location-service:no-api");
        const errorMessage = handleLocationError(false, false);
        reject(new Error(errorMessage));
      }
    });
  };
  // Get Location From GPS
  const getLocationFromGPS = (resolve: Function, reject: Function): void => {
    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let coordsJSON = position.coords.toJSON();
        // Timestamp Data
        const tsNum = position.timestamp;
        const tsStr = new Date(tsNum).toISOString();
        coordsJSON = { ...coordsJSON, timestampNum: tsNum, timestampStr: tsStr };
        // Result Data
        console.log("get-location-from-gps:retrieve-success", `Success`);
        locationData.value = coordsJSON;
        resolve();
      },
      (error) => {
        // Switch Error String = Default is 0: Unknown Error
        let errorString = "UNKNOWN_ERROR";
        switch (error.code) {
          case 0:
            errorString = "UNKNOWN_ERROR";
            break;
          case 4:
            errorString = "INVALID_REQUEST";
            break;
          default:
            errorString = error.message;
            break;
        }
        // Send Error String
        console.log("get-location-from-gps:retrieve-error", `Code:${error.code},String:${errorString}`);
        const errorMessage = handleLocationError(true, true, errorString);
        reject(new Error(errorMessage));
      },
      options
    );
  };
  // Handle Location Error
  const handleLocationError = (hasGeolocation: boolean, hasPermission: boolean, errorString: string = ""): string => {
    // Define Message
    let errorMessage = "";
    if (!hasGeolocation) {
      errorMessage = "อุปกรณ์ไม่รองรับการทำงานของ GPS";
    } else if (!hasPermission) {
      errorMessage = "คุณไม่ได้อนุญาตการทำงานของ GPS";
    } else {
      errorMessage = "ระบบ GPS มีปัญหา กรุณาลองอีกครั้ง";
    }
    // Add Error String
    if (errorString.length > 0) {
      errorMessage = `${errorMessage}\n(${errorString})`;
    }
    // Return Message
    return errorMessage;
  };
  // Check Permission is Granted (Not Used)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkLocationPerms = (resolve: Function, reject: Function): void => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((permission) => {
        if (permission.state === "prompt") {
          // Permission: Prompt
          console.log("init-location-service:prompt", permission.state);
          permission.onchange = function () {
            if (permission.state === "granted") {
              // Permission: Granted
              console.log("init-location-service:ok-prompt", permission.state);
              getLocationFromGPS(resolve, reject);
            } else {
              // Permission: Denied
              console.log("init-location-service:no-prompt", permission.state);
              const errorMessage = handleLocationError(true, false);
              reject(new Error(errorMessage));
            }
          };
        } else if (permission.state === "granted") {
          // Permission: Granted
          console.log("init-location-service:ok-perms", permission.state);
          getLocationFromGPS(resolve, reject);
        } else {
          // Permission: Denied
          console.log("init-location-service:no-perms", permission.state);
          const errorMessage = handleLocationError(true, false);
          reject(new Error(errorMessage));
        }
      });
    } else {
      console.log("init-location-service:no-perms");
      getLocationFromGPS(resolve, reject);
    }
  };
  // Return Data
  return { locationData, initLocationService };
});
