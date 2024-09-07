<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1>ชื่อ: {{ name }} | เงินเดือน: {{ salary }}</h1>
  </div>
</template>

<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Person',
  data() {
    return {
      message: 'ข้อมูลพนักงานแต่ละคน'
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      default: 15000
    }
  }
}
</script>

<style scoped>
h1 {
  color: red;
}
</style>
