import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/services/api";

export type TypeItem = { name: string; url: string };

export const usePokeTypesStore = defineStore("pokeTypes", () => {
  const allTypes = ref<TypeItem[] | null>(null);
  const typeIndex = new Map<string, Set<string>>();
  const loadingTypes = ref(false);
  const loadingTypeMap = new Map<string, boolean>();

  // actions
  async function fetchTypes(): Promise<void> {
    if (allTypes.value || loadingTypes.value) return;
    loadingTypes.value = true;
    try {
      const res = await api.get<{ results: TypeItem[] }>("/type");
      allTypes.value = res.data.results.filter((t) => t.name !== "unknown" && t.name !== "shadow");
    } finally {
      loadingTypes.value = false;
    }
  }

  async function ensureTypeSet(typeName: string): Promise<void> {
    if (!typeName) return;
    if (typeIndex.has(typeName)) return;
    if (loadingTypeMap.get(typeName)) return;

    loadingTypeMap.set(typeName, true);
    try {
      const res = await api.get<{
        pokemon: { pokemon: { name: string; url: string } }[];
      }>(`/type/${typeName}`);

      const set = new Set<string>();
      for (const it of res.data.pokemon) set.add(it.pokemon.name);
      typeIndex.set(typeName, set);
    } finally {
      loadingTypeMap.delete(typeName);
    }
  }

  const types = computed(() => allTypes.value ?? []);
  function getTypeSet(typeName: string): Set<string> | null {
    return typeIndex.get(typeName) ?? null;
  }

  function hasType(pokemonName: string, typeName: string): boolean {
    const set = typeIndex.get(typeName);
    return !!set && set.has(pokemonName);
  }

  function reset(): void {
    allTypes.value = null;
    typeIndex.clear();
    loadingTypes.value = false;
    loadingTypeMap.clear();
  }

  return {
    loadingTypes,
    types,
    getTypeSet,
    hasType,
    fetchTypes,
    ensureTypeSet,
    reset,
  };
});
