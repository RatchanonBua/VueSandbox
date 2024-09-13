<script lang="ts">
export default {
  name: "App",
  data() {
    return {
      realName: "รัชชานนท์",
      lastName: "บัวลีสอนสกุล",
      nickName: "",
      age: 27,
      address: "<strong>ปทุมธานี</strong>",
      picture: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      size: 150,
      social: "https://www.facebook.com/ratchanon.bua",
      // hobbies: [],
      hobbies: ["การเล่นเกม", "การฟังเพลง", "การไลฟ์สตรีมสด"],
      general: { gender: "ชาย", weight: 67.5, height: 175, status: false },
      count: 0,
      isVisible: false,
      salary: 20000,
    };
  },
  methods: {
    _getFullName() {
      return `${this.realName + " " + this.lastName}`;
    },
    showData() {
      alert(this.realName);
    },
    increment(value = 1) {
      this.count += value;
    },
    decrement(value = 1) {
      this.count -= value;
    },
    setNickName(event: Event) {
      // console.log(event.target.value);
      if (event.target instanceof HTMLInputElement) {
        this.nickName = event.target.value;
      }
    },
    submitForm(event: Event) {
      // event.preventDefault();
      const input = this.$refs.nickNameEl as HTMLInputElement;
      this.nickName = input.value;

      if (event.target instanceof HTMLFormElement) {
        // console.log(event);
        const form = this.$refs.myForm as HTMLFormElement;
        const formData = new FormData(form);
        const nickName = formData.get("nickName") as string;
        console.log(`บันทึกชื่อเล่น ${nickName} เรียบร้อย`);
      }
    },
    toggleVisible() {
      this.isVisible = !this.isVisible;
    },
    getRandomByMethod() {
      return Math.random();
    },
    addSalary(value: number = 0) {
      this.salary += value;
    },
  },
  computed: {
    getFullName() {
      return `${this.realName + " " + this.lastName}`;
    },
    getRandomByComputed() {
      return Math.random();
    },
    getIncome() {
      return this.salary * 12;
    },
    getDepartment() {
      return this.salary >= 35000 ? "Project Manager" : "Programmer";
    },
  },
  watch: {
    salary(value) {
      if (value > 50000) {
        alert("เงินเดือนไม่ควรเกิน 50,000 บาท");
        setTimeout(() => {
          this.salary = 50000;
        }, 100);
      }
    },
  },
};
</script>

<template>
  <section>
    <img :src="picture" :width="size" :height="size" ref="imageEl" alt="Image" />
    <br />
    <!-- ป้อนชื่อเล่น: <input type="text" @input="setNickName" /> -->

    <form @submit.prevent="submitForm" ref="myForm" v-show="false">
      <label>ป้อนชื่อเล่น:</label>
      <input type="text" name="nickName" ref="nickNameEl" />
      <button type="submit">บันทึก</button>
    </form>

    <h1>ชื่อ-นามสกุล: {{ getFullName }} | ชื่อเล่น: {{ nickName }} | อายุ: {{ age }} ปี</h1>
    <h1>เงินเดือน: {{ salary }} บาท</h1>
    <!-- <h1>รายได้ต่อปี: {{ getIncome }} บาท</h1> -->
    <h1>ตำแหน่งงาน: {{ getDepartment }}</h1>
    <button @click="addSalary(5000)">เพิ่มเงินเดือน</button>

    <!-- <h2>Method 1: {{ getRandomByMethod() }}</h2> -->
    <!-- <h2>Method 2: {{ getRandomByMethod() }}</h2> -->
    <!-- <hr /> -->
    <!-- <h2>Computed 1: {{ getRandomByComputed }}</h2> -->
    <!-- <h2>Computed 2: {{ getRandomByComputed }}</h2> -->

    <button @click="toggleVisible">{{ isVisible ? "ซ่อน" : "แสดง" }}รายละเอียด</button>
    <article v-show="isVisible">
      <p>ที่อยู่: <span v-html="address"></span></p>
      <p>Social: <a :href="social" target="_blank">Facebook</a></p>

      <div v-if="hobbies.length === 0">
        <p>ไม่มีงานอดิเรก</p>
      </div>
      <div v-else>
        <p>งานอดิเรก:</p>
        <ul>
          <li v-for="(item, index) in hobbies" :key="index">{{ index + 1 }} - {{ item }}</li>
          <!-- <li>{{ hobbies[0] }}</li> -->
          <!-- <li>{{ hobbies[1] }}</li> -->
          <!-- <li>{{ hobbies[2] }}</li> -->
        </ul>
      </div>

      <p>ข้อมูลพื้นฐาน:</p>
      <ul>
        <li v-for="(item, key) in general" :key="key">{{ key }} - {{ item }}</li>
        <!-- <li>เพศ: {{ general.gender }}</li> -->
        <!-- <li>น้ำหนัก: {{ general.weight }} กก.</li> -->
        <!-- <li>ส่วนสูง: {{ general.height }} ซม.</li> -->
        <!-- <li>โรคประจำตัว: {{ general.status }}</li> -->
      </ul>
    </article>

    <div v-show="false">
      <p>นับตัวเลข: {{ count }}</p>
      <button @click="showData()">คลิกเพื่อดูข้อมูล</button>
      <button @click.ctrl="increment()">เพิ่ม</button>
      <button @click.ctrl="increment(10)">เพิ่มทีละ 10</button>
      <button @click.left="decrement()">ลด</button>
      <button @click.left="decrement(10)">ลดทีละ 10</button>
    </div>
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
