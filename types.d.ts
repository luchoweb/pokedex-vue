export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default?: string;
  back_default?: string;
  other?: {
    ["official-artwork"]?: {
      front_default?: string;
    };
  };
  [key: string]: any;
}

export interface PokemonDetails {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: PokemonSprites;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonPageCache {
  entities: Record<number, PokemonDetails>;
  pages: Record<string, number[]>;
  pageFetchedAt: Record<string, number>;
  loadingPages: Record<string, boolean>;
}

export interface FetchPageParams {
  offset: number;
  limit: number;
  force?: boolean;
  swr?: boolean;
}

export type PokeType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

type NamedResource = { name: string; url: string };
type Stat = { base_stat: number; effort: number; stat: NamedResource };
type Ability = { ability: NamedResource; is_hidden: boolean; slot: number };
type TypeEntry = { slot: number; type: NamedResource };
type Sprites = {
  front_default?: string;
  back_default?: string;
  other?: {
    ["official-artwork"]?: { front_default?: string };
  };
};
type Cries = {
  latest: string;
  legacy: string;
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number;
  abilities: Ability[];
  stats: Stat[];
  types: TypeEntry[];
  sprites: Sprites;
  cries: Cries;
};
