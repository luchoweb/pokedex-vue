import { usePokeTypesStore, type TypeItem } from "@/stores/pokeTypes";

export function seedPokeTypes(typesToTest: TypeItem[]) {
  const typeStore = usePokeTypesStore();
  typeStore.seedTestTypes(typesToTest);
}
