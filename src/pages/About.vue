<script setup lang="ts">
import { RouterLink } from "vue-router";

const requirements = [
  { label: "Framework: Vue 3 (Composition API preferred)", done: true },
  { label: "State management: Pinia (optional, but valued)", done: true },
  { label: "Routing: Vue Router", done: true },
  { label: "HTTP: Axios or Fetch API", done: true },
  { label: "Testing: Vitest/Jest (≥1 unit test per main component)", done: true },
];

const badges = ["Vue 3", "TypeScript", "Pinia", "Vue Router", "Axios", "Vitest", "Tailwind v4"];
</script>

<template>
  <section
    class="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white/80 dark:bg-slate-900/60 ring-1 ring-black/5 dark:ring-white/10 p-6 md:p-8 shadow-sm"
  >
    <header class="space-y-2">
      <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
        About - FED Technical Assessment
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        This project is a technical assessment for a Frontend Developer position. It implements a
        Pokédex using Vue 3 (Composition API), routing with Vue Router, state management with Pinia,
        HTTP requests via Axios, and unit tests with Vitest.
      </p>
    </header>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="b in badges"
        :key="b"
        class="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
      >
        {{ b }}
      </span>
    </div>

    <div class="grid gap-3">
      <div
        v-for="requirement in requirements"
        :key="requirement.label"
        class="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 ring-1 ring-black/5 dark:ring-white/10"
      >
        <span
          class="inline-grid place-items-center size-6 rounded-md bg-linear-to-br from-blue-500 to-indigo-600 text-white"
          aria-hidden="true"
          title="Requirement covered"
        >
          <svg viewBox="0 0 24 24" class="size-4">
            <path
              d="M20 6L9 17l-5-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <p class="text-sm md:text-base text-slate-800 dark:text-slate-100">
          {{ requirement.label }}
        </p>
      </div>
    </div>

    <div class="space-y-2">
      <h2 class="text-lg font-bold">Implementation Notes</h2>
      <ul class="list-disc pl-5 text-slate-700 dark:text-slate-200 space-y-1">
        <li>
          Main routes:
          <code class="px-1 rounded bg-black/5 dark:bg-white/10">/</code>
          and
          <code class="px-1 rounded bg-black/5 dark:bg-white/10">/pokemon/:idOrName</code>
          .
        </li>
        <li>Pinia caches types and theme settings to improve UX.</li>
        <li>Axios to consume PokéAPI.</li>
        <li>Vitest for unit tests on key views/composables.</li>
        <li>
          Tailwind v4 with dark mode via the
          <code>.dark</code>
          class.
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center gap-3 pt-2">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow ring-1 ring-black/5 hover:brightness-110 transition"
      >
        Open Pokédex
      </RouterLink>

      <a
        href="https://github.com/luchoweb/pokedex-vue"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100 ring-1 ring-black/5 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
      >
        Repository
      </a>
    </div>
  </section>
</template>

<style scoped></style>
