import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/notifications",
      name: "Notifications",
      component: () => import("@/views/NotificationsView.vue"),
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("@/views/SettingsView.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/ProfileView.vue"),
    },
    {
      path: "/currentcy_exchange",
      name: "Currentcy Exchange",
      component: () => import("@/views/CurrencyExchangeView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = typeof to.name === "string" ? to.name : "App";
  next();
});

export default router;
