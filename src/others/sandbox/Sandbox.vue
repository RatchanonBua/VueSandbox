<template>
  <header>
    <h1>ระบบจัดการข้อมูลพนักงาน</h1>
  </header>
  <FormComponent @save="insertEmployee" />
  <section class="employee-content" v-if="employees.length > 0">
    <!-- {{ JSON.stringify(employees) }} -->
    <!-- <h1>App Component</h1> -->
    <!-- <FormComponent /> -->
    <!-- <ListData :employees="employees" /> -->
    <h2>ข้อมูลพนักงาน</h2>
    <ListData :employees="employees" />
  </section>
</template>

<script lang="ts">
import FormComponent from '../../components/sandbox/FormComponent.vue'
import ListData from '../../components/sandbox/ListData.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Sandbox',
  components: {
    ListData,
    FormComponent
  },
  data() {
    return {
      employees: [] as Object[]
    }
    // return {
    //   employees: [
    //     { name: 'ก้อง', salary: 40000 },
    //     { name: 'แก้ม', salary: 30000 },
    //     { name: 'โจโจ้' },
    //     { name: 'ชาลี', salary: 900 },
    //     { name: 'ตั๊กแตน' }
    //   ]
    // }
  },
  methods: {
    insertEmployee(data: Object) {
      // console.log('รับข้อมูลพนักงาน = ', data)
      this.employees.push(data)
      // console.log(this.employees)
    }
  }
}
</script>

<style scoped>
/* h1 {
  background: orange;
} */
</style>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  margin: 3rem;
  border-radius: 10px;
  padding: 1rem;
  background-color: purple;
  color: #fff;
  text-align: center;
}

.employee-content {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  margin: 3rem;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
}

.employee-content h2 {
  font-size: 2rem;
  border-bottom: 4px solid #ccc;
  color: purple;
  margin: 0 0 1rem 0;
}
</style>
