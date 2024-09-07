<template>
  <div>
    <!-- <h1>App Component</h1> -->
    <FormComponent />
    <ListData :employees="employees" />
  </div>
</template>

<script lang="ts">
import FormComponent from './components/sandbox/FormComponent.vue'
import ListData from './components/sandbox/ListData.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Sandbox',
  components: {
    ListData,
    FormComponent
  },
  data() {
    return {
      employees: [
        { name: 'ก้อง', salary: 40000 },
        { name: 'แก้ม', salary: 30000 },
        { name: 'โจโจ้', salary: 20000 },
        { name: 'สมปอง', salary: 15000 },
        { name: 'ชาลี', salary: 18000 },
        { name: 'ตุ๊กตา', salary: 50000 }
      ]
    }
  }
}
</script>

<style scoped>
/* h1 {
  background: orange;
} */
</style>
