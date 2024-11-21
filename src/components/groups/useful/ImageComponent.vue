<script lang="ts">
import { ref, watch } from "vue";
import IconQuestion from "@/components/icons/useful/IconQuestion.vue";

export default {
  name: "ImageComponent",
  components: { IconQuestion },
  props: {
    urlImg: {
      type: String,
      default: "",
    },
    altImg: {
      type: String,
      default: "",
    },
    cssClass: {
      type: String,
      default: "",
    },
    isShowErr: {
      type: Boolean,
      default: true,
    },
    errClass: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const imageLoaded = ref(true);
    const onLoadImageError = () => {
      imageLoaded.value = false;
    };
    watch(() => props.urlImg, () => {
      imageLoaded.value = true;
    });
    return { imageLoaded, onLoadImageError };
  },
};
</script>

<template>
  <div class="image-container">
    <img :src="urlImg" :alt="altImg" :class="cssClass" @error="onLoadImageError" :style="{ display: !imageLoaded && isShowErr ? 'none' : 'initial' }" />
  </div>
  <div class="rounded-full bg-gray-200 bg-opacity-60">
    <IconQuestion v-if="!imageLoaded && isShowErr" :cssClass="errClass"></IconQuestion>
  </div>
</template>
