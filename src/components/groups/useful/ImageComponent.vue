<script lang="ts">
import { ref, watch } from "vue";
import { addURLTimestampCache } from "@/utils/functions";
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
  methods: {
    addURLTimestamp(url: string): string {
      return addURLTimestampCache(url)
    }
  }
};
</script>

<template>
  <img :src="addURLTimestamp(urlImg)" :alt="altImg" :class="cssClass" @error="onLoadImageError" :style="{ display: !imageLoaded && isShowErr ? 'none' : 'initial' }" />
  <div v-if="!imageLoaded && isShowErr" :class="cssClass">
    <IconQuestion :cssClass="errClass"></IconQuestion>
  </div>
</template>
