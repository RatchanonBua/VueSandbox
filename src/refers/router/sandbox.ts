import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/refers/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "About",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/refers/views/AboutView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = typeof to.name === "string" ? to.name : "App";
  next();
});

export default router;
