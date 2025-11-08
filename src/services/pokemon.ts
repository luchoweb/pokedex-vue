import { api } from "@/services/api";
import type { PokemonDetails, PokemonListItem } from "types";

export async function listPokemon(limit: number, offset: number) {
  const res = await api.get<{ results: PokemonListItem[] }>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
  return res.data.results;
}

export async function getPokemonDetailsByUrl(url: string) {
  const res = await api.get<PokemonDetails>(url);
  return res.data;
}

export async function getPokemonDetailsByName(nameOrId: string) {
  const res = await api.get<PokemonDetails>(`/pokemon/${nameOrId.toLowerCase()}`);
  return res.data;
}
