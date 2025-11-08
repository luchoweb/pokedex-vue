<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { usePokeTypesStore } from "@/stores/pokeTypes";
import { useThemeTokensStore } from "@/stores/themeTokens";
import { usePokedex } from "@/composables/usePokedex";

import FilterBar from "@/components/FilterBar.vue";
import PokemonCard from "@/components/PokemonCard.vue";

const theme = useThemeTokensStore();
const typesStore = usePokeTypesStore();
const isLoading = ref(true);

const pokedex = usePokedex({ pageSize: 16, concurrency: 6 });
const { query, type, pokemons, loading, loadingMore, error, canLoadMore } = pokedex;

onMounted(async () => {
  theme.init();
  await typesStore.fetchTypes();
  await pokedex.reloadForFilters();
  isLoading.value = false;
});

watch([query, type], () => {
  pokedex.reloadForFilters();
});

function onLoadMore() {
  pokedex.loadMore();
}
</script>

<template>
  <section class="space-y-6">
    <FilterBar
      v-if="!isLoading"
      v-model:modelValueQuery="query"
      v-model:modelValueType="type"
      @change=""
    />

    <div
      v-if="loading && pokemons.length === 0"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="h-40 rounded-2xl bg-slate-200/50 dark:bg-slate-800/30 animate-pulse"
      />
    </div>

    <div v-else>
      <div
        v-if="error && pokemons.length === 0"
        class="rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-100"
      >
        {{ error }}
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <PokemonCard
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          :id="pokemon.id"
          :name="pokemon.name"
          :types="pokemon.types.map((t) => t.type.name)"
          :image="
            pokemon.sprites?.other?.['official-artwork']?.front_default ||
            pokemon.sprites?.front_default
          "
        />
      </div>

      <div class="flex justify-center mt-8" v-if="canLoadMore && !loading && !isLoading">
        <button
          v-if="!loadingMore"
          @click="onLoadMore"
          class="cursor-pointer inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-sm backdrop-blur-md bg-white/20 dark:bg-slate-900/30 ring-1 ring-black/10 dark:ring-white/10 shadow-sm text-slate-800 dark:text-slate-100 hover:bg-white/30 dark:hover:bg-slate-900/40 hover:brightness-110 transition-all duration-200 active:scale-95"
        >
          Load more
        </button>

        <div v-else class="text-center text-slate-500 dark:text-slate-300 mt-3">
          <span>Loading, please wait...</span>
        </div>
      </div>
    </div>
  </section>
</template>
