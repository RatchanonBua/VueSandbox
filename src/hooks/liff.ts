import liff from "@line/liff";
import { ref } from "vue";

const useLiffLogin = async (liffId: string = import.meta.env.VITE_LIFF_APP_ID) => {
  const liffInst = ref(null as Record<string, any> | null);
  const errorObj = ref(null as Record<string, any> | null);
  const initLiff = async () => {
    try {
      await liff.init({ liffId: liffId });
      liffInst.value = liff;
      errorObj.value = null;
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
      }
    } catch (err: any) {
      errorObj.value = err;
    }
  };
  await initLiff();
  return { liffInst, errorObj };
};

export default useLiffLogin;
