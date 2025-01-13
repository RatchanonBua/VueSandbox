<script lang="ts">
// Import Hooks
import useLiffLogin from "@/hooks/lifflogin";
import useGoogleLogin from "@/hooks/gglogin";

// Export Components
export default {
  name: "LoginView",
  data() {
    return {
      liffInst: null as Record<string, any> | null,
      errorObj: null as Record<string, any> | null,
      isLiffLoading: true,
      liffId: import.meta.env.VITE_LIFF_APP_ID,
    };
  },
  async mounted() {
    // await this.initGoogleData();
    // await this.initLiffData();
  },
  methods: {
    // Google Login
    async initGoogleData(): Promise<void> {
      const { resultData, errorObject } = await useGoogleLogin();
    },
    // LIFF Login
    async initLiffData(): Promise<void> {
      this.isLiffLoading = true;
      // Init LIFF Data
      const { resultData, errorObject } = await useLiffLogin();
      this.liffInst = resultData.value;
      this.errorObj = errorObject.value;
      // Get LIFF Data
      if (this.liffInst === null) {
        const errorObj = this.errorObj;
        console.log(errorObj);
      } else {
        this.isLiffLoading = false;
        // this.getLiffData();
      }
    },
    async getLiffData(): Promise<void> {
      const liffInst = this.liffInst;
      console.log("LIFF Instance: ", liffInst);
      if (liffInst) {
        /** addToHomeScreen (??? # currently don't provide) */
        // liffInst.addToHomeScreen();

        /** closeWindow (void # when open the liff window only) */
        // liffInst.closeWindow();

        /** createShortcutOnHomeScreen (Promise<void> # verified `MINI App` only) */
        // liffInst.createShortcutOnHomeScreen({ url: `https://liff.line.me/${this.liffId}` }).then(() => { console.log("createShortcutOnHomeScreen:", "Success"); }).catch((error: any) => { console.error("createShortcutOnHomeScreen:", error); });

        /** getAId (??? # currently don't provide) */
        // liffInst.getAId();

        /** getAccessToken (string # ---) */
        // console.log("getAccessToken:", liffInst.getAccessToken());

        /** getAdvertisingId (??? # currently don't provide) */
        // liffInst.getAdvertisingId();

        /** getAppLanguage (string # standard code ex. th-TH) */
        console.log("getAppLanguage:", liffInst.getAppLanguage());

        /** getContext (object # ---) */
        // console.log("getContext:", liffInst.getContext());

        /** getDecodedIDToken (object # don't send to the server) */
        // console.log("getDecodedIDToken:", liffInst.getDecodedIDToken());

        /** getFriendship (Promise<object> # refer to `LINE OA`) */
        await liffInst.getFriendship().then((data: any) => { console.log("getFriendship:", data); }).catch((error: any) => { console.error("getFriendship:", error); });

        /** getIDToken (string # ---) */
        // console.log("getIDToken:", liffInst.getIDToken());

        /** getIsVideoAutoPlay (boolean # Not in document) */
        console.log("getIsVideoAutoPlay:", liffInst.getIsVideoAutoPlay());

        /** getLanguage (string # standard code ex. th-TH) */
        console.log("getLanguage:", liffInst.getLanguage());

        /** getLineVersion (string | null # if open with LIFF browser or else null) */
        console.log("getLineVersion:", liffInst.getLineVersion());

        /** getOS (string # ios / android / web) */
        console.log("getOS:", liffInst.getOS());

        /** getProfile (Promise<object> # ---) */
        await liffInst.getProfile().then((data: any) => { console.log("getProfile:", data); }).catch((error: any) => { console.error("getProfile:", error); });

        /** getProfilePlus (??? # Not in document) */
        // liffInst.getProfilePlus();

        /** getVersion (string # SDK version) */
        console.log("getVersion:", liffInst.getVersion());

        /** i18n.setLang (Promise<void> # ---) */
        await liffInst.i18n.setLang("en").then((data: any) => { console.log("i18n.setLang:", "Success"); }).catch((error: any) => { console.error("i18n.setLang:", error); });

        /** id (string # app id) */
        // console.log("id:", liffInst.id);

        /** initPlugins (??? # Not in document) */
        // liffInst.initPlugins();

        /** internalCreateShortcutOnHomeScreen (??? # Not in document) */
        // liffInst.internalCreateShortcutOnHomeScreen();

        /** isApiAvailable (boolean # ---) */
        console.log("isApiAvailable | shareTargetPicker:", liffInst.isApiAvailable("shareTargetPicker"));
        console.log("isApiAvailable | createShortcutOnHomeScreen:", liffInst.isApiAvailable("createShortcutOnHomeScreen"));
        console.log("isApiAvailable | multipleLiffTransition:", liffInst.isApiAvailable("multipleLiffTransition"));

        /** isInClient (boolean # LIFF browser is true or else false) */
        console.log("isInClient:", liffInst.isInClient());

        /** isLoggedIn (boolean # ---) */
        console.log("isLoggedIn:", liffInst.isLoggedIn());

        /** isSubWindow (boolean # Not in document) */
        console.log("isSubWindow:", liffInst.isSubWindow());

        /** openWindow (void # open new window with link) */
        // liffInst.openWindow({ url: "https://google.com", external: true });

        /** permanentLink.createUrlBy (Promise<object> # see https://developers.line.biz/en/reference/liff/#permanent-link-create-url-by) */
        await liffInst.permanentLink.createUrlBy(`${window.location.origin + window.location.pathname}?page=home`).then((data: any) => { console.log("permanentLink.createUrlBy:", data); }).catch((error: any) => { console.error("permanentLink.createUrlBy:", error); });
        /** permanentLink.setExtraQueryParam (void # https://developers.line.biz/en/reference/liff/#permanent-linke-set-extra-query-param) */
        /** permanentLink.createUrl (string | Exception # https://developers.line.biz/en/reference/liff/#permanent-link-create-url) */
        try {
          // Warning: they will be deprecate soon!
          liffInst.permanentLink.setExtraQueryParam("page=home");
          console.log("permanentLink.createUrl:", liffInst.permanentLink.createUrl());
        } catch (error: any) {
          console.error("permanentLink.createUrl:", error);
        }

        /** permission (Promise<object> # profile / chat_message.write / openid / email) */
        await liffInst.permission.query("profile").then((status: any) => { console.log("permission.query | profile:", status); }).catch((error: any) => { console.error("permission.query | profile:", error); });
        await liffInst.permission.query("chat_message.write").then((status: any) => { console.log("permission.query | chat_message.write:", status); }).catch((error: any) => { console.error("permission.query | chat_message.write:", error); });
        await liffInst.permission.query("openid").then((status: any) => { console.log("permission.query | openid:", status); }).catch((error: any) => { console.error("permission.query | openid:", error); });
        await liffInst.permission.query("email").then((status: any) => { console.log("permission.query | email:", status); }).catch((error: any) => { console.error("permission.query | email:", error); });

        /** ready (Promise<object> # no rejected) */
        liffInst.ready.then(() => { console.log("ready:", "Success"); });

        /** scanCodeV2 (Promise<object> # see https://developers.line.biz/en/reference/liff/#scan-code-v2) */
        // await liffInst.scanCodeV2().then((data: any) => { console.log("scanCodeV2", data); }).catch((error: any) => { console.error("scanCodeV2", error); });
        
        /** logout (void # ---) **/
        // liffInst.logout();
      } else {
        alert("กำลังโหลด กรุณารอสักครู่...");
      }
    },
  },
};
</script>

<template>
  <main>
    <button @click="initGoogleData">Login with Google</button>
    <!-- <button @click="getLiffData">GET LINE DATA</button> -->
  </main>
</template>
