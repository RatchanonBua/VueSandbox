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
      path: "/feeds",
      name: "Feeds",
      component: () => import("@/views/FeedsView.vue"),
    },
    {
      path: "/notifications",
      name: "Notifications",
      component: () => import("@/views/NotificationsView.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/ProfileView.vue"),
    },
    {
      path: "/currency_exchange",
      name: "Currency Exchange",
      component: () => import("@/views/CurrencyExchangeView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = typeof to.name === "string" ? to.name : "App";
  next();
});

export default router;
