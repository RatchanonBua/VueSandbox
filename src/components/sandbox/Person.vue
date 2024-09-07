<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <li>
    <h1>ชื่อ: {{ name }}</h1>
    <button>ดูรายละเอียด</button>&nbsp;<button>ลบข้อมูล</button>
    <div v-show="isVisible">
      <p>เงินเดือน: {{ salary }} บาท | ตำแหน่งงาน: {{ department }}</p>
    </div>
  </li>
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
    id: {
      type: Number
    },
    name: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      default: 15000
    },
    department: {
      type: String,
      required: true
    },
    isVisible: {
      type: Boolean
    }
  }
}
</script>

<style scoped>
/* h1 {
  color: red;
} */

li {
  margin: 1rem 0;
  font-size: 1.25rem;
  font-weight: bold;
  background: #8ddba4;
  padding: 0.5rem;
  color: #1f1f1f;
  border-radius: 25px;
}

button {
  font: inherit;
  cursor: pointer;
  border: 1px solid #ff0077;
  background: #ff0077;
  color: white;
  padding: 0.05rem 1rem;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
}
</style>
