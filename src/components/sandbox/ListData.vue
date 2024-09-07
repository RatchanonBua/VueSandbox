<template>
  <div>
    <!-- <h1>{{ message }}</h1> -->
    <!-- <Person name="ก้อง" salary="30000" />
    <Person name="โจโจ้" salary="20000" />
    <Person name="ตั๊กแตน" salary="15000" />
    <Person name="แก้ม" salary="18000" /> -->
    <ul>
      <Person
        v-for="(item, index) in employees"
        :key="index"
        :name="item.name"
        :salary="item.salary"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import Person from './Person.vue'
export default {
  name: 'ListData',
  components: {
    Person
  },
  props: ['employees']
  // data() {
  //   return {
  //     message: 'แสดงรายชื่อพนักงานทุกคน'
  //   }
  // }
}
</script>

<style scoped></style>
