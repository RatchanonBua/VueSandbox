<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Card>
    <template #card-header>
      <h1>ชื่อ: {{ name }}</h1>
    </template>
    <!-- <template #card-button>
      <button @click="toggleDescription(id)">ดูรายละเอียด</button>
      &nbsp;
      <button @click="deleteEmployee(id)">ลบข้อมูล</button>
    </template> -->
    <template #card-content>
      <!-- <transition name="fade">
        <div v-show="isVisible">
          <p>เงินเดือน: {{ salary }} บาท | ตำแหน่งงาน: {{ department }}</p>
        </div>
      </transition> -->
      <p>เงินเดือน: {{ salary }} บาท | ตำแหน่งงาน: {{ department }} | เพศ: {{ gender }}</p>
      <p>ทักษะด้านภาษา: {{ skill }}</p>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from "./Card.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Person",
  components: {
    Card,
  },
  data() {
    return {
      message: "ข้อมูลพนักงานแต่ละคน",
    };
  },
  props: {
    // id: {
    //   type: Number
    // },
    // isVisible: {
    //   type: Boolean
    // },
    name: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      default: 15000,
    },
    department: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    skill: {
      type: Array,
    },
  },
  methods: {
    toggleDescription(id: number | undefined) {
      if (typeof id === "number") {
        console.log(id, "number", "toggleDescription");
        this.$emit("toggle", id);
      } else {
        console.log(id, typeof id, "toggleDescription");
      }
    },
    deleteEmployee(id: number | undefined) {
      if (typeof id === "number") {
        console.log(id, "number", "deleteEmployee");
        this.$emit("delete", id);
      } else {
        console.log(id, typeof id, "deleteEmployee");
      }
    },
  },
};
</script>

<style scoped>
/* h1 {
  color: red;
} */

/* li {
  margin: 1rem 0;
  font-size: 1.25rem;
  font-weight: bold;
  background: #8ddba4;
  padding: 0.5rem;
  color: #1f1f1f;
  border-radius: 25px;
} */

button {
  font: inherit;
  cursor: pointer;
  border: 1px solid #ff0077;
  background: #ff0077;
  color: white;
  padding: 0.05rem 1rem;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}
</style>
