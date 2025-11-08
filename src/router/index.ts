import { createRouter, createWebHistory } from "vue-router";

import Pokedex from "@/pages/Pokedex.vue";

// Lazy
const About = () => import("@/pages/About.vue");
const Pokemon = () => import("@/pages/Pokemon.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Pokedex },
    { path: "/about", component: About },
    { path: "/pokemon/:idOrName", component: Pokemon },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

export default router;
