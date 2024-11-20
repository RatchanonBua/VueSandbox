<script setup lang="ts"></script>

<template>
  <div class="bg-gray-50 flex items-center justify-center">
    <div class="w-full h-screen relative">
      <div class="bg-gradient-to-br from-green-600 to-blue-700 dark:from-gray-700 dark:to-gray-800 pt-6 pb-12 px-4 text-white">
        <h1 class="text-3xl font-bold mb-3">Currency Exchange</h1>
        <div class="mb-5">
          <input type="text" class="w-full text-white bg-white bg-opacity-20 rounded-full border-2 border-transparent focus:border-white focus:border-opacity-50 focus:outline-none px-3 py-1 leading-none text-sm transition-colors placeholder-white placeholder-opacity-50" placeholder="Search..." />
        </div>
      </div>
      <div class="bg-gray-100 dark:bg-gray-600 px-2">
        <ul class="relative -top-10 pb-3">
          <li class="mb-2 bg-white dark:bg-gray-500 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-pink-500">
            <div class="flex items-center">
              <div class="w-16 text-3xl leading-none">
                <i class="cc BTC text-yellow-500"></i>
              </div>
              <div class="w-full dark:text-white">Bitcoin <span class="ml-3 text-gray-400 dark:text-white">BTC</span></div>
              <div class="text-green-500 dark:text-white">+0.65%</div>
            </div>
          </li>
          <li class="mb-2 bg-white dark:bg-gray-500 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-pink-500">
            <div class="flex items-center">
              <div class="w-16 text-3xl leading-none">
                <i class="cc ETH text-gray-700"></i>
              </div>
              <div class="w-full dark:text-white">Ethereum <span class="ml-3 text-gray-400 dark:text-white">ETH</span></div>
              <div class="text-green-500 dark:text-white">+0.98%</div>
            </div>
          </li>
          <li class="mb-2 bg-white dark:bg-gray-500 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-pink-500">
            <div class="flex items-center">
              <div class="w-16 text-3xl leading-none">
                <i class="cc XLM text-blue-300"></i>
              </div>
              <div class="w-full dark:text-white">Stellar <span class="ml-3 text-gray-400 dark:text-white">XLM</span></div>
              <div class="text-red-500 dark:text-white">-1.24%</div>
            </div>
          </li>
          <li class="mb-2 bg-white dark:bg-gray-500 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-pink-500">
            <div class="flex items-center">
              <div class="w-16 text-3xl leading-none">
                <i class="cc XRP text-blue-700"></i>
              </div>
              <div class="w-full dark:text-white">Ripple <span class="ml-3 text-gray-400 dark:text-white">XRP</span></div>
              <div class="text-green-500 dark:text-white">+0.30%</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rounded-4xl {
  border-radius: 3.5rem;
}
.phone-top {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 3rem;
  z-index: 1;
}
.phone-top-inner {
  position: relative;
  height: 2rem;
  width: 100%;
  background-color: #fff;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
.phone-top-inner:before {
  content: "";
  position: absolute;
  top: 0;
  left: -1rem;
  height: 1rem;
  width: 1rem;
  border-top-right-radius: 50%;
  box-shadow: 0.5rem -0.5rem 0 0 #fff;
}
.phone-top-inner:after {
  content: "";
  position: absolute;
  top: 0;
  right: -1rem;
  height: 1rem;
  width: 1rem;
  border-top-left-radius: 50%;
  box-shadow: -0.5rem -0.5rem 0 0 #fff;
}
</style>
