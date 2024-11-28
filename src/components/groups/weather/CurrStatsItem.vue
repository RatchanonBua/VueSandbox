<script setup lang="ts"></script>

<template>
  <div class="w-1/3">
    <div class="text-lg">
      <slot name="value"></slot>
    </div>
    <div class="text-white text-[14px] text-opacity-60">
      <slot name="label"></slot>
    </div>
  </div>
</template>