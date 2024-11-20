<script lang="ts">
export default {
  name: "IconProfile",
  props: {
    cssClass: {
      type: String,
      default: "",
    },
    imageURL: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      profileLoaded: true,
      profileCSS: "w-6 h-6 rounded-full object-cover border-2 border-gray-500 dark:border-gray-400 group-hover:border-blue-600 dark:group-hover:border-blue-500",
    };
  },
};
</script>

<template>
  <span class="relative" v-if="imageURL && profileLoaded">
    <img :src="imageURL" :class="profileCSS" alt="Profile Image" @error="profileLoaded = false" />
  </span>
  <span class="relative" v-else>
    <svg :class="cssClass" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
    </svg>
  </span>
</template>
