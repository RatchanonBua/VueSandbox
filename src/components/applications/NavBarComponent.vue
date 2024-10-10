<script lang="ts">
import { RouterLink } from "vue-router";

import IconHome from "./icons/IconHome.vue";
import IconNotify from "./icons/IconNotify.vue";
import IconSetting from "./icons/IconSetting.vue";
import IconProfile from "./icons/IconProfile.vue";

export default {
  name: "NavBarComponent",
  components: { IconHome, IconNotify, IconSetting, IconProfile, RouterLink },
  props: {
    title: {
      type: String,
      default: "Application",
    },
  },
};
</script>

<template>
  <nav class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
      <RouterLink to="/" class="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <IconHome cssClass="w-6 h-6 mt-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Home</span>
      </RouterLink>
      <RouterLink to="/notifications" class="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <IconNotify cssClass="w-6 h-6 mt-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Notifications</span>
      </RouterLink>
      <RouterLink to="/settings" class="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <IconSetting cssClass="w-6 h-6 mt-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Settings</span>
      </RouterLink>
      <RouterLink to="/profile" class="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <IconProfile cssClass="w-6 h-6 mt-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Profile</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped></style>
