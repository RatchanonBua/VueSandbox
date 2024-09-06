<template>
  <div>
    <!-- <h1>App Component</h1> -->
    <FormComponent />
    <ListData />
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
  }
}
</script>

<style scoped>
/* h1 {
  background: orange;
} */
</style>
