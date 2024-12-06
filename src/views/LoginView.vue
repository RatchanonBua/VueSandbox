<script lang="ts">
// Import Libraries
import { ref } from "vue";
// Import Hooks
import useLiffLogin from "@/hooks/liff";
import { profile } from "console";

// Export Components
export default {
  name: "LoginView",
  data() {
    return {
      liffInst: null as Record<string, any> | null,
      errorObj: null as Record<string, any> | null,
      isLiffLoading: true,
    };
  },
  async mounted() {
    await this.initLiffData();
  },
  methods: {
    async initLiffData(): Promise<void> {
      this.isLiffLoading = true;
      // Init LIFF Data
      const { liffInst, errorObj } = await useLiffLogin();
      this.liffInst = liffInst.value;
      this.errorObj = errorObj.value;
      // Get LIFF Data
      if (this.liffInst === null) {
        const errorObj = this.errorObj;
        console.log(errorObj);
      } else {
        this.isLiffLoading = false;
        this.getLiffData();
      }
    },
    async getLiffData(): Promise<void> {
      if (!this.isLiffLoading) {
        // Code Here
      } else {
        alert("กำลังโหลด กรุณารอสักครู่...");
      }
    },
  },
};
</script>

<template>
  <main></main>
</template>
