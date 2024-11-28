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
        const errorMessage: string = handleLocationError(false, false);
        reject(new Error(errorMessage));
      }
    });
  };
  // Get Location From GPS
  const getLocationFromGPS = (resolve: Function, reject: Function): void => {
    const options: object = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let coordsJSON = position.coords.toJSON();
        // Timestamp Data
        const tsNum: number = position.timestamp;
        const tsStr: string = new Date(tsNum).toISOString();
        coordsJSON = { ...coordsJSON, timestampNum: tsNum, timestampStr: tsStr };
        // Result Data
        console.log("get-location-from-gps:retrieve-success", `Success`);
        locationData.value = coordsJSON;
        resolve();
      },
      (error) => {
        // Error String
        let errorString: string = "UNKNOWN_ERROR";
        let hasPermission: boolean = true;
        switch (error.code) {
          case 1:
            hasPermission = false;
            errorString = "PERMISSION_DENIED";
            break;
          case 2:
            errorString = "POSITION_UNAVAILABLE";
            break;
          case 3:
            errorString = "TIMEOUT";
            break;
          default:
            errorString = error.message.toUpperCase();
            break;
        }
        // Send Error String
        console.log("get-location-from-gps:retrieve-error", `Code:${error.code},String:${errorString}`);
        const errorMessage: string = handleLocationError(true, hasPermission, errorString);
        reject(new Error(errorMessage));
      },
      options
    );
  };
  // Handle Location Error
  const handleLocationError = (hasGeolocation: boolean, hasPermission: boolean, errorString: string = ""): string => {
    // Define Message
    let errorMessage: string = "";
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
              const errorMessage: string = handleLocationError(true, false);
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
          const errorMessage: string = handleLocationError(true, false);
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
