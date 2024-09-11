<template>
  <!-- <h1>{{ message }}</h1> -->
  <!-- <Person name="ก้อง" salary="30000" />
  <Person name="โจโจ้" salary="20000" />
  <Person name="ตั๊กแตน" salary="15000" />
  <Person name="แก้ม" salary="18000" /> -->
  <ul>
    <!-- <Card>
      พนักงานคนที่ 1
    </Card>
    <Card>
      พนักงานคนที่ 2
    </Card>
    <Card>
      พนักงานคนที่ 3
    </Card> -->
    <!-- <Person
      v-for="item in employees"
      :key="item.id"
      :id="item.id"
      :name="item.name"
      :salary="item.salary"
      :department="item.department"
      :isVisible="item.isVisible"
      @toggle="toggleVisible"
      @delete="removeEmployee"
    /> -->
    <Person
      v-for="(item, index) in employees"
      :key="index"
      :name="item.name"
      :salary="item.salary"
      :department="item.department"
      :gender="item.gender"
      :skill="item.skill"
    />
  </ul>
</template>

<script lang="ts">
import Person from './Person.vue'
export default {
  name: 'ListData',
  components: {
    Person
  },
  props: ['employees'],
  data() {
    // return {
    //   employees: [
    //     { id: 1, name: 'ก้อง รักสยาม', salary: 40000, department: 'โปรแกรมเมอร์', isVisible: false },
    //     { id: 2, name: 'แก้ม เรียนดี', salary: 30000, department: 'ฝ่ายการตลาด', isVisible: false },
    //     { id: 3, name: 'โจโจ้ ขยันทำงาน', department: 'โปรแกรมเมอร์', isVisible: false },
    //     { id: 4, name: 'ชาลี ยิ้มเก่ง', salary: 900, department: 'กราฟิก', isVisible: false },
    //     { id: 5, name: 'ตั๊กแตน เรียนดี', department: 'ฝ่ายขาย', isVisible: false }
    //   ]
    // }
  },
  methods: {
    toggleVisible(id: number) {
      console.log('Child ID = ', id, 'toggleVisible')
      // this.employees = this.employees.map((item) => {
      //   if (item.id === id) {
      //     return { ...item, isVisible: !item.isVisible }
      //   }
      //   return item
      // })
    },
    removeEmployee(id: number) {
      console.log('Child ID = ', id, 'removeEmployee')
      // this.employees = this.employees.filter((item) => {
      //   return item.id !== id
      // })
    }
  }
  // props: ['employees']
  // data() {
  //   return {
  //     message: 'แสดงรายชื่อพนักงานทุกคน'
  //   }
  // }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
}
</style>
