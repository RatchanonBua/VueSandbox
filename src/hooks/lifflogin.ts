import liff from "@line/liff";
import { ref } from "vue";

const useLiffLogin = async (liffId: string = import.meta.env.VITE_LIFF_APP_ID) => {
  const resultData = ref(null as Record<string, any> | null);
  const errorObject = ref(null as Record<string, any> | null);
  const initLiff = async () => {
    try {
      await liff.init({ liffId: liffId });
      resultData.value = liff;
      errorObject.value = null;
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
      }
    } catch (err: any) {
      errorObject.value = err;
    }
  };
  await initLiff();
  return { resultData, errorObject };
};

export default useLiffLogin;
