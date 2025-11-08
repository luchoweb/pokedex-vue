<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const isDark = ref(false);

onMounted(() => {
  const saved = localStorage.getItem("theme") ?? "system";
  if (
    saved === "dark" ||
    (saved === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  }
});

watch(isDark, (v) => {
  localStorage.setItem("theme", v ? "dark" : "light");
  document.documentElement.classList.toggle("dark", v);
});

const isActive = (path: string) => route.path.startsWith(path);
</script>

<template>
  <header
    class="sticky top-0 z-50 backdrop-blur supports-backdrop-filter:bg-white/55 dark:supports-backdrop-filter:bg-slate-900/50 bg-white/80 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/5"
  >
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <RouterLink to="/" class="group inline-flex items-center gap-2">
        <div class="flex items-center gap-2 dark:text-white">
          <svg
            class="size-6"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="32" cy="32" r="28" />
            <path d="M4 32h56" />
            <circle cx="32" cy="32" r="8" />
          </svg>
          <span class="font-bold text-lg">Pokédex</span>
        </div>
      </RouterLink>

      <nav class="hidden sm:flex items-center gap-1">
        <RouterLink
          to="/"
          class="px-3 py-2 rounded-lg text-sm font-medium transition hover:bg-slate-900/5 dark:hover:bg-white/10"
          :class="isActive('/') ? 'bg-slate-900/10 dark:bg-white/10' : ''"
        >
          Pokedex
        </RouterLink>
        <RouterLink
          to="/about"
          class="px-3 py-2 rounded-lg text-sm font-medium transition hover:bg-slate-900/5 dark:hover:bg-white/10"
          :class="isActive('/about') ? 'bg-slate-900/10 dark:bg-white/10' : ''"
        >
          About
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center justify-center size-9 rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 shadow-sm transition"
          @click="isDark = !isDark"
          :aria-pressed="isDark"
          :title="isDark ? 'Light mode' : 'Dark mode'"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" class="size-5 text-white">
            <path
              d="M12 3v2m0 14v2M3 12h2m14 0h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <circle cx="12" cy="12" r="4" class="fill-current" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="size-5 text-slate-700">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" class="fill-current" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
