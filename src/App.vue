<script setup lang="ts">
import Header from "./components/Header.vue";
</script>

<template>
  <div
    class="min-h-dvh bg-linear-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100"
  >
    <Header />

    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>

    <footer class="mx-auto max-w-6xl px-4 pb-10 pt-4 text-sm text-slate-500 dark:text-slate-400">
      <div class="flex items-center justify-between">
        <p>© {{ new Date().getFullYear() }} Pokédex by Lucho</p>
        <a href="https://pokeapi.co" target="_blank" rel="noopener" class="hover:underline">
          PokéAPI
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
