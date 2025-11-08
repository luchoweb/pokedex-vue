import { ref, computed } from "vue";
import { createLimiter } from "@/utils/limiter";
import { listPokemon, getPokemonDetailsByUrl, getPokemonDetailsByName } from "@/services/pokemon";
import { usePokeTypesStore } from "@/stores/pokeTypes";
import type { PokemonDetails } from "types";

type Mode = "all" | "type" | "name";

export function usePokedex(options?: { pageSize?: number; concurrency?: number }) {
  const pageSize = options?.pageSize ?? 24;
  const limitDetails = createLimiter(options?.concurrency ?? 6);
  const query = ref("");
  const type = ref("");
  const mode = ref<Mode>("all");
  const pokemons = ref<PokemonDetails[]>([]);
  const loading = ref(false);
  const loadingMore = ref(false);
  const error = ref<string | null>(null);
  const offset = ref(0);
  const typeNames = ref<string[]>([]);
  const typeCursor = ref(0);
  const detailsCache = new Map<string, PokemonDetails>();

  let requestToken: symbol | null = null;
  function newToken() {
    requestToken = Symbol("req");
    return requestToken;
  }
  function isStale(token: symbol) {
    return requestToken !== token;
  }

  const typesStore = usePokeTypesStore();

  async function loadAllPage() {
    const token = newToken();
    const first = offset.value === 0;
    if (first) {
      loading.value = true;
      error.value = null;
      pokemons.value = [];
    } else {
      loadingMore.value = true;
    }

    try {
      const list = await listPokemon(pageSize, offset.value);
      if (isStale(token)) return;

      const details = await Promise.all(
        list.map(async (p) => {
          const name = p.name;
          if (detailsCache.has(name)) return detailsCache.get(name)!;
          const d = await getPokemonDetailsByUrl(p.url);
          detailsCache.set(name, d);
          return d;
        })
      );
      if (isStale(token)) return;

      details.sort((a, b) => a.id - b.id);
      pokemons.value.push(...details);
      offset.value += pageSize;
    } catch (e) {
      if (!isStale(token)) error.value = "Failed to load Pokémon.";
    } finally {
      if (!isStale(token)) {
        loading.value = false;
        loadingMore.value = false;
      }
    }
  }

  async function loadTypeFirstPage(selectedType: string) {
    const token = newToken();
    loading.value = true;
    error.value = null;
    pokemons.value = [];
    typeNames.value = [];
    typeCursor.value = 0;

    try {
      await typesStore.ensureTypeSet(selectedType);
      if (isStale(token)) return;

      const set = typesStore.getTypeSet(selectedType);
      const names = set ? Array.from(set) : [];
      names.sort((a, b) => a.localeCompare(b));
      typeNames.value = names;

      await loadTypeNextPage();
    } catch {
      if (!isStale(token)) error.value = "Failed to load by type.";
    } finally {
      if (!isStale(token)) loading.value = false;
    }
  }

  async function loadTypeNextPage() {
    const token = newToken();
    const start = typeCursor.value;
    const end = Math.min(start + pageSize, typeNames.value.length);
    const slice = typeNames.value.slice(start, end);
    if (slice.length === 0) return;

    loadingMore.value = true;
    try {
      const out: PokemonDetails[] = [];
      await Promise.all(
        slice.map((name) =>
          limitDetails(async () => {
            if (detailsCache.has(name)) {
              out.push(detailsCache.get(name)!);
              return;
            }
            const d = await getPokemonDetailsByName(name);
            detailsCache.set(name, d);
            out.push(d);
          })
        )
      );

      if (isStale(token)) return;
      out.sort((a, b) => a.id - b.id);
      pokemons.value.push(...out);
      typeCursor.value = end;
    } finally {
      if (!isStale(token)) loadingMore.value = false;
    }
  }

  async function loadByExactName(q: string) {
    const token = newToken();
    loading.value = true;
    error.value = null;
    pokemons.value = [];
    try {
      const cached = detailsCache.get(q.toLowerCase());
      const d = cached ?? (await getPokemonDetailsByName(q));
      if (!cached) detailsCache.set(d.name, d);
      if (!isStale(token)) pokemons.value = [d];
    } catch {
      if (!isStale(token)) {
        pokemons.value = [];
        error.value = "No Pokémon found with that exact name or ID.";
      }
    } finally {
      if (!isStale(token)) loading.value = false;
    }
  }

  async function reloadForFilters() {
    const q = query.value.trim();
    const t = type.value.trim();

    if (q) {
      mode.value = "name";
      await loadByExactName(q);
      return;
    }
    if (t) {
      mode.value = "type";
      await loadTypeFirstPage(t);
      return;
    }
    mode.value = "all";
    offset.value = 0;
    await loadAllPage();
  }

  async function loadMore() {
    if (mode.value === "all") return loadAllPage();
    if (mode.value === "type") return loadTypeNextPage();
  }

  const canLoadMore = computed(() => {
    if (mode.value === "all") return true;
    if (mode.value === "type") return typeCursor.value < typeNames.value.length;
    return false;
  });

  function reset() {
    mode.value = "all";
    pokemons.value = [];
    loading.value = false;
    loadingMore.value = false;
    error.value = null;
    offset.value = 0;
    typeNames.value = [];
    typeCursor.value = 0;
    detailsCache.clear();
    requestToken = null;
  }

  return {
    query,
    type,
    mode,
    pokemons,
    loading,
    loadingMore,
    error,
    canLoadMore,
    reloadForFilters,
    loadMore,
    reset,
  };
}
