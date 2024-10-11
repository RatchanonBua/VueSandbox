<script lang="ts">
import { RouterLink } from "vue-router";

import IconHome from "./icons/IconHome.vue";
import IconFeed from "./icons/IconFeed.vue";
import IconNotify from "./icons/IconNotify.vue";
import IconProfile from "./icons/IconProfile.vue";

export default {
  name: "NavBarComponent",
  components: { IconHome, IconFeed, IconNotify, IconProfile, RouterLink },
  data() {
    return {
      btnCSS: "inline-flex flex-col items-center justify-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800 group",
      navCSS: "w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500",
    };
  },
};
</script>

<template>
  <nav class="fixed bottom-0 left-0 z-50 w-full h-12 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
      <RouterLink :class="btnCSS" title="Home" to="/">
        <IconHome :cssClass="navCSS" />
      </RouterLink>
      <RouterLink :class="btnCSS" title="Feed" to="/feeds">
        <IconFeed :cssClass="navCSS" />
      </RouterLink>
      <RouterLink :class="btnCSS" title="Notifications" to="/notifications">
        <IconNotify :cssClass="navCSS" />
      </RouterLink>
      <RouterLink :class="btnCSS" title="Profile" to="/profile">
        <IconProfile :cssClass="navCSS" imageURL="https://images.pexels.com/photos/27897903/pexels-photo-27897903/free-photo-of-close-up-portrait-of-a-man.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped></style>
