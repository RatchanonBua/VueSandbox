<script lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'App',
  data() {
    return {
      realName: 'รัชชานนท์',
      lastName: 'บัวลีสอนสกุล',
      nickName: '',
      age: 27,
      address: '<strong>ปทุมธานี</strong>',
      picture: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      size: 150,
      social: 'https://www.facebook.com/ratchanon.bua',
      hobbies: ['การเล่นเกม', 'การฟังเพลง', 'การไลฟ์สตรีมสด'],
      general: { gender: 'ชาย', weight: 67.5, height: 175, status: false },
      count: 0
    }
  },
  methods: {
    getFullName() {
      return `${this.realName + ' ' + this.lastName}`
    },
    showData() {
      alert(this.realName)
    },
    increment(value = 1) {
      this.count += value
    },
    decrement(value = 1) {
      this.count -= value
    },
    setNickName(event) {
      // console.log(event.target.value)
      this.nickName = event.target.value
    },
    submitForm(event) {
      // event.preventDefault()
      alert('บันทึกชื่อเล่นเรียบร้อย')
    }
  }
}
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView /> -->
  <section>
    <img :src="picture" :width="size" :height="size" alt="Image" />
    <br />
    <!-- ป้อนชื่อเล่น: <input type="text" @input="setNickName" /> -->
    <form @submit.prevent="submitForm">
      <label>ป้อนชื่อเล่น:</label>
      <input type="text" @input="setNickName" />
      <button type="submit">บันทึก</button>
    </form>
    <h1>ชื่อ-นามสกุล: {{ getFullName() }} | ชื่อเล่น: {{ nickName }} | อายุ: {{ age }} ปี</h1>
    <p>ที่อยู่: <span v-html="address"></span></p>
    <p>Social: <a :href="social" target="_blank">Facebook</a></p>
    <p>งานอดิเรก:</p>
    <ul>
      <li>{{ hobbies[0] }}</li>
      <li>{{ hobbies[1] }}</li>
      <li>{{ hobbies[2] }}</li>
    </ul>
    <p>ข้อมูลพื้นฐาน:</p>
    <ul>
      <li>เพศ: {{ general.gender }}</li>
      <li>น้ำหนัก: {{ general.weight }} กก.</li>
      <li>ส่วนสูง: {{ general.height }} ซม.</li>
      <li>โรคประจำตัว: {{ general.status }}</li>
    </ul>
    <p>นับตัวเลข: {{ count }}</p>
    <button @click="showData()">คลิกเพื่อดูข้อมูล</button>
    <button @click.ctrl="increment()">เพิ่ม</button>
    <button @click.ctrl="increment(10)">เพิ่มทีละ 10</button>
    <button @click.left="decrement()">ลด</button>
    <button @click.left="decrement(10)">ลดทีละ 10</button>
  </section>
</template>

<style scoped>
/* header {
  line-height: 1.5;
  max-height: 100vh;
} */

/* .logo {
  display: block;
  margin: 0 auto 2rem;
} */

/* nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
} */

/* nav a.router-link-exact-active {
  color: var(--color-text);
} */

/* nav a.router-link-exact-active:hover {
  background-color: transparent;
} */

/* nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
} */

/* nav a:first-of-type {
  border: 0;
} */

@media (min-width: 1024px) {
  /* header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  } */

  /* .logo {
    margin: 0 2rem 0 0;
  } */

  /* header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  } */

  /* nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  } */
}
</style>
