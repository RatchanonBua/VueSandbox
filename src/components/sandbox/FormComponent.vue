<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FormComponent',
  data() {
    return {
      message: 'แบบฟอร์มบันทึกข้อมูลพนักงาน'
    }
  }
}
</script>

<style scoped>
h1 {
  color: green;
}
</style>
