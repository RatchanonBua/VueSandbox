<script setup lang="ts"></script>

<template>
  <div class="flex flex-wrap justify-around items-center mb-2 py-4 w-full rounded bg-black bg-opacity-20 text-xl text-center gap-y-4">
    <!-- Date -->
    <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-2">
      <span class="text-lg">
        <slot name="date-wkday"></slot>
      </span>
      <div class="text-white text-sm text-opacity-60">
        <slot name="date-label"></slot>
      </div>
    </div>
    <!-- Low Temp. -->
    <div class="w-1/3 bs-sm:w-1/6">
      <span class="text-lg">
        <slot name="low-value"></slot>
      </span>
      <div class="text-white text-sm text-opacity-60">ต่ำสุด</div>
    </div>
    <!-- High Temp. -->
    <div class="w-1/3 bs-sm:w-1/6">
      <span class="text-lg">
        <slot name="high-value"></slot>
      </span>
      <div class="text-white text-sm text-opacity-60">สูงสุด</div>
    </div>
    <!-- Icon -->
    <div class="w-1/3 bs-sm:w-1/6 bs-sm:-order-1">
      <div class="flex justify-center">
        <slot name="image"></slot>
      </div>
    </div>
    <!-- Wind -->
    <div class="w-1/3 bs-sm:w-1/6">
      <span class="text-lg">
        <slot name="wind-value"></slot>
      </span>
      <div class="text-white text-sm text-opacity-60">ความเร็วลม</div>
    </div>
    <!-- Rain -->
    <div class="w-1/3 bs-sm:w-1/6">
      <span class="text-lg">
        <slot name="rain-value"></slot>
      </span>
      <div class="text-white text-sm text-opacity-60">ค่าความชื้น</div>
    </div>
  </div>
</template>
