import { api } from "@/services/api";
import type { PokemonDetails, PokemonListItem } from "types";

export interface PagingState {
  items: PokemonDetails[];
  offset: number;
  limit: number;
}

export async function loadNextPage(state: PagingState) {
  // Fetch the slice (list endpoint)
  const list = await api.get<{ results: PokemonListItem[] }>(
    `/pokemon?limit=${state.limit}&offset=${state.offset}`
  );
  // Fetch details in parallel
  const details = await Promise.all(
    list.data.results.map((p) => api.get<PokemonDetails>(p.url).then((r) => r.data))
  );
  // Sort for visual consistency, then append (incremental)
  details.sort((a, b) => a.id - b.id);
  state.items.push(...details);
  state.offset += state.limit;
  return state;
}
