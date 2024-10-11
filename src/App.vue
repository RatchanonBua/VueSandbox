<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import NavBarComponent from "@/components/NavBarComponent.vue";
</script>

<template>
  <!-- If login is true -->
  <main v-if="true">
    <RouterView />
    <NavBarComponent />
  </main>
  <!-- If login is false -->
  <main v-else>
    <div></div>
  </main>
</template>

<style scoped></style>
