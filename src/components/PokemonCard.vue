<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useThemeTokensStore } from "@/stores/themeTokens";

const props = defineProps<{
  id: number;
  name: string;
  types: string[];
  image?: string | null;
}>();

const tokens = useThemeTokensStore();
const themeClass = computed(() => tokens.classFor(props.types?.[0]));
const displayName = computed(() => props.name.charAt(0).toUpperCase() + props.name.slice(1));
</script>

<template>
  <RouterLink :to="`/pokemon/${name}`">
    <article
      class="group relative overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-linear-to-br backdrop-blur-xl transition hover:shadow-lg hover:brightness-105"
      :class="themeClass"
    >
      <div v-if="image" class="absolute inset-0 -z-20 overflow-hidden">
        <img
          :src="image"
          :alt="name"
          class="w-full h-full object-cover object-center opacity-10 scale-110 group-hover:scale-125 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div
          class="absolute inset-0 bg-linear-to-br from-black/15 via-transparent to-white/10 mix-blend-multiply"
        ></div>
      </div>

      <div class="relative p-5 flex flex-col gap-4 text-slate-900 dark:text-slate-100">
        <header class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-extrabold tracking-tight drop-shadow-md">
              {{ displayName }}
            </h3>
            <p class="text-sm text-slate-700/80 dark:text-slate-300/80 font-mono">
              #{{ id.toString().padStart(3, "0") }}
            </p>
          </div>

          <div
            class="shrink-0 grid place-items-center size-20 rounded-xl backdrop-blur-md bg-white/60 dark:bg-slate-900/60 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
            aria-hidden="true"
          >
            <img
              v-if="image"
              :src="image"
              :alt="name + ' thumbnail'"
              class="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
          </div>
        </header>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="type in types"
            :key="type"
            class="inline-flex items-center rounded-full backdrop-blur-md bg-white/60 dark:bg-slate-900/60 ring-1 ring-black/5 dark:ring-white/10 px-2.5 py-1 text-xs font-semibold capitalize"
          >
            {{ type }}
          </span>
        </div>
      </div>

      <div
        class="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(transparent,transparent,rgba(0,0,0,0.05))]"
      ></div>
    </article>
  </RouterLink>
</template>

<style scoped></style>
