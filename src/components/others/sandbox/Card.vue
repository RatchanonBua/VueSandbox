<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <li>
    <img src="https://cdn-icons-png.flaticon.com/512/1308/1308491.png" alt="รูปภาพพนักงาน" />
    <hr />
    <slot name="card-header"></slot>
    <slot name="card-button"></slot>
    <slot name="card-content"></slot>
  </li>
</template>

<script lang="ts">
export default {}
</script>

<style scoped>
li {
  margin: 1rem 0;
  font-size: 1.25rem;
  font-weight: bold;
  background: purple;
  padding: 0.5rem;
  color: #fff;
  border-radius: 25px;
}

img {
  width: 100px;
  height: 100px;
}
</style>
