<script setup lang="ts"></script>

<template>
  <div class="rounded py-4 text-lg bg-black bg-opacity-15 text-center">
    <div class="text-base mb-1">
      <slot name="time"></slot>
    </div>
    <div class="p-2 pt-0 flex justify-center rounded-full">
      <slot name="image"></slot>
    </div>
    <div class="text-sm">
      <slot name="value"></slot>
    </div>
  </div>
</template>
