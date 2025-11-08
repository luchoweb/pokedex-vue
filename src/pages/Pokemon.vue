<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useThemeTokensStore } from "@/stores/themeTokens";
import { api } from "@/services/api";
import type { Pokemon } from "types";

const tokens = useThemeTokensStore();

const route = useRoute();

const loading = ref(true);
const error = ref<string | null>(null);
const pokemon = ref<Pokemon | null>(null);

const idOrName = computed(() => String(route.params.idOrName ?? "").trim());

const themeClass = computed(() =>
  tokens.classFor(pokemon.value?.types?.[0]?.type?.name || "default")
);

function artworkUrl(pk: Pokemon | null) {
  return (
    pk?.sprites?.other?.["official-artwork"]?.front_default || pk?.sprites?.front_default || ""
  );
}

function displayName(name: string) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
}

async function loadPokemon(q: string) {
  loading.value = true;
  error.value = null;
  pokemon.value = null;
  try {
    const res = await api.get<Pokemon>(`/pokemon/${q.toLowerCase()}`);
    pokemon.value = res.data;
    document.title = `${displayName(res.data.name)} · Pokédex`;
  } catch (e: any) {
    error.value = "Could not load this Pokémon. Check the name/ID.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (idOrName.value) loadPokemon(idOrName.value);
});

watch(idOrName, (q) => {
  if (q) loadPokemon(q);
});

const types = computed(() => (pokemon.value?.types ?? []).map((t) => t.type.name));
const idPadded = computed(() => (pokemon.value ? String(pokemon.value.id).padStart(3, "0") : ""));
const heightMeters = computed(() => (pokemon.value ? (pokemon.value.height / 10).toFixed(1) : ""));
const weightKg = computed(() => (pokemon.value ? (pokemon.value.weight / 10).toFixed(1) : ""));

const asNumber = computed(() =>
  Number.isFinite(Number(idOrName.value)) ? Number(idOrName.value) : (pokemon.value?.id ?? null)
);
const prevLink = computed(() =>
  asNumber.value && asNumber.value > 1 ? `/pokemon/${asNumber.value - 1}` : null
);
const nextLink = computed(() =>
  asNumber.value && asNumber.value < 1010 ? `/pokemon/${asNumber.value + 1}` : null
);

const speaking = ref(false);
const supported = "speechSynthesis" in window;
const pronunciationOverrides: Record<string, string> = {
  pikachu: "Peekahchoo",
  ekans: "E-kans",
  "nidoran-f": "Ni doran-f",
  "nidoran-m": "Ni doran-m",
};

function speak(name: string) {
  if (!supported || !name) return;

  try {
    const pokemonName = pronunciationOverrides[name] || name;

    const u = new SpeechSynthesisUtterance(pokemonName);
    u.lang = "en-US";
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;

    speaking.value = true;
    u.onend = u.onerror = () => (speaking.value = false);

    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang === "en");
    if (voice) u.voice = voice;

    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch {
    speaking.value = false;
  }
}
</script>

<template>
  <section
    class="relative overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 md:p-8"
  >
    <div
      v-if="pokemon && artworkUrl(pokemon)"
      class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <img
        :src="artworkUrl(pokemon)"
        :alt="pokemon?.name"
        class="w-full h-full object-cover object-center opacity-25 blur-sm scale-110"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute inset-0 bg-linear-to-br via-transparent mix-blend-multiply"
        :class="themeClass"
      ></div>
    </div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex items-start gap-4">
        <div
          class="grid place-items-center size-24 rounded-2xl bg-white/70 dark:bg-slate-900/70 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
        >
          <img
            v-if="pokemon && artworkUrl(pokemon)"
            :src="artworkUrl(pokemon)"
            :alt="pokemon?.name"
            class="h-20 w-20 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
            {{ pokemon ? displayName(pokemon.name) : "Loading..." }}
            <button className="cursor-pointer ms-2" @click="pokemon?.name && speak(pokemon.name)">
              <small>🔊</small>
            </button>
          </h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 font-mono">
            <span v-if="pokemon">#{{ idPadded }}</span>
          </p>

          <div v-if="pokemon" class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="t in types"
              :key="t"
              class="inline-flex items-center rounded-full backdrop-blur-md bg-white/65 dark:bg-slate-900/65 ring-1 ring-black/5 dark:ring-white/10 px-2.5 py-1 text-xs font-semibold capitalize"
            >
              {{ t }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/pokedex"
          class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-white/80 dark:bg-slate-800/80 ring-1 ring-black/5 dark:ring-white/10 hover:bg-white/30 transition"
        >
          ← Back to list
        </RouterLink>
        <div class="hidden sm:flex items-center gap-2">
          <RouterLink
            v-if="prevLink"
            :to="prevLink"
            class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-white/75 dark:bg-slate-800/80 ring-1 ring-black/5 dark:ring-white/10 hover:bg-white/30 transition"
            aria-label="Previous Pokémon"
          >
            ‹ Prev
          </RouterLink>
          <RouterLink
            v-if="nextLink"
            :to="nextLink"
            class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-white/75 dark:bg-slate-800/80 ring-1 ring-black/5 dark:ring-white/10 hover:bg-white/30 transition"
            aria-label="Next Pokémon"
          >
            Next ›
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2">
      <div class="h-40 rounded-xl bg-slate-200/60 dark:bg-slate-800/40 animate-pulse" />
      <div class="h-40 rounded-xl bg-slate-200/60 dark:bg-slate-800/40 animate-pulse" />
      <div
        class="h-24 rounded-xl bg-slate-200/60 dark:bg-slate-800/40 animate-pulse md:col-span-2"
      />
    </div>

    <div
      v-else-if="error"
      class="mt-6 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-100"
    >
      {{ error }}
    </div>

    <div v-else-if="pokemon" class="mt-6 grid gap-6 md:grid-cols-2">
      <section
        class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-slate-900/60 p-4"
      >
        <h2 class="text-lg font-bold mb-3">About</h2>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt class="text-slate-600 dark:text-slate-400">Height</dt>
            <dd class="font-semibold">{{ heightMeters }} m</dd>
          </div>
          <div>
            <dt class="text-slate-600 dark:text-slate-400">Weight</dt>
            <dd class="font-semibold">{{ weightKg }} kg</dd>
          </div>
          <div>
            <dt class="text-slate-600 dark:text-slate-400">Base EXP</dt>
            <dd class="font-semibold">{{ pokemon.base_experience ?? "—" }}</dd>
          </div>
          <div>
            <dt class="text-slate-600 dark:text-slate-400">Abilities</dt>
            <dd class="font-semibold">
              <span v-for="(a, i) in pokemon.abilities" :key="a.ability.name" class="capitalize">
                {{ a.ability.name }}
                <span v-if="i < pokemon.abilities.length - 1">,</span>
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section
        class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-slate-900/60 p-4"
      >
        <h2 class="text-lg font-bold mb-3">Sprites</h2>
        <div class="grid grid-cols-3 gap-3">
          <div
            class="grid place-items-center rounded-xl bg-white/70 dark:bg-slate-800/70 ring-1 ring-black/5 dark:ring-white/10 p-3"
          >
            <img
              :src="pokemon.sprites.front_default || artworkUrl(pokemon)"
              alt="Front"
              class="h-16 w-16 object-cover"
            />
            <small class="mt-1 text-slate-500 dark:text-slate-400">Front</small>
          </div>
          <div
            class="grid place-items-center rounded-xl bg-white/70 dark:bg-slate-800/70 ring-1 ring-black/5 dark:ring-white/10 p-3"
          >
            <img
              :src="pokemon.sprites.back_default || artworkUrl(pokemon)"
              alt="Back"
              class="h-16 w-16 object-cover"
            />
            <small class="mt-1 text-slate-500 dark:text-slate-400">Back</small>
          </div>
          <div
            class="grid place-items-center rounded-xl bg-white/70 dark:bg-slate-800/70 ring-1 ring-black/5 dark:ring-white/10 p-3"
          >
            <img :src="artworkUrl(pokemon)" alt="Artwork" class="h-16 w-16 object-contain" />
            <small class="mt-1 text-slate-500 dark:text-slate-400">Artwork</small>
          </div>
        </div>
      </section>

      <section
        class="md:col-span-2 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-slate-900/60 p-4"
      >
        <h2 class="text-lg font-bold mb-4">Stats</h2>
        <ul class="space-y-3">
          <li
            v-for="s in pokemon.stats"
            :key="s.stat.name"
            class="grid grid-cols-[140px_1fr_auto] gap-3 items-center"
          >
            <span class="capitalize text-sm text-slate-700 dark:text-slate-300">
              {{ s.stat.name }}
            </span>
            <div
              class="h-3 rounded-md bg-slate-200/70 dark:bg-slate-800/70 overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
            >
              <div
                class="h-full bg-linear-to-r from-blue-500 to-indigo-600"
                :style="{ width: Math.min(100, Math.round((s.base_stat / 180) * 100)) + '%' }"
              />
            </div>
            <span class="text-sm font-semibold tabular-nums">{{ s.base_stat }}</span>
          </li>
        </ul>
      </section>

      <div class="md:col-span-2 flex items-center justify-between pt-2 sm:hidden">
        <RouterLink
          v-if="prevLink"
          :to="prevLink"
          class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-white/75 dark:bg-slate-800/80 ring-1 ring-black/5 dark:ring-white/10 hover:bg-white transition"
        >
          ‹ Prev
        </RouterLink>
        <div class="flex-1"></div>
        <RouterLink
          v-if="nextLink"
          :to="nextLink"
          class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-white/75 dark:bg-slate-800/80 ring-1 ring-black/5 dark:ring-white/10 hover:bg-white transition"
        >
          Next ›
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
