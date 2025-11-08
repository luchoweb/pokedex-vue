import { defineStore } from "pinia";
import type { PokeType } from "types";

const DEFAULT_THEME_BY_TYPE: Record<PokeType | "default", string> = {
  normal: "from-stone-300/30 to-stone-400/30 ring-stone-400/30",
  fire: "from-orange-400/25 to-red-500/25 ring-orange-400/30",
  water: "from-sky-400/25 to-blue-600/25 ring-sky-400/30",
  electric: "from-yellow-300/25 to-amber-400/25 ring-amber-400/30",
  grass: "from-emerald-300/25 to-green-500/25 ring-emerald-400/30",
  ice: "from-cyan-300/30 to-sky-300/25 ring-cyan-300/30",
  fighting: "from-red-300/25 to-rose-500/25 ring-rose-400/30",
  poison: "from-purple-400/25 to-fuchsia-500/25 ring-purple-400/30",
  ground: "from-amber-300/25 to-yellow-600/25 ring-yellow-500/30",
  flying: "from-indigo-300/25 to-sky-400/25 ring-indigo-400/30",
  psychic: "from-pink-300/25 to-rose-500/25 ring-pink-400/30",
  bug: "from-lime-300/25 to-green-500/25 ring-lime-400/30",
  rock: "from-yellow-400/25 to-stone-500/25 ring-stone-400/30",
  ghost: "from-violet-500/25 to-purple-700/25 ring-violet-500/30",
  dragon: "from-indigo-400/25 to-purple-700/25 ring-indigo-400/30",
  dark: "from-slate-700/25 to-slate-900/25 ring-slate-600/40",
  steel: "from-slate-300/25 to-slate-500/25 ring-slate-400/30",
  fairy: "from-pink-200/40 to-fuchsia-300/25 ring-fuchsia-300/40",
  default: "from-stone-300/30 to-stone-400/30 ring-stone-400/30",
};

export const useThemeTokensStore = defineStore("themeTokens", {
  state: () => ({
    map: { ...DEFAULT_THEME_BY_TYPE } as Record<string, string>,
  }),
  getters: {
    classFor:
      (state) =>
      (typeName?: string): string => {
        const key = (typeName ?? "default").toLowerCase();
        return state.map[key] || state.map.default || "";
      },
  },
  actions: {
    init() {
      const raw = localStorage.getItem("themeByTypeOverrides");
      if (raw) {
        try {
          const overrides = JSON.parse(raw) as Record<string, string>;
          this.map = { ...DEFAULT_THEME_BY_TYPE, ...overrides };
        } catch {
          this.map = { ...DEFAULT_THEME_BY_TYPE };
        }
      }
    },
    setOverride(typeName: string, classes: string) {
      const key = typeName.toLowerCase();
      this.map[key] = classes;
      const overrides: Record<string, string> = {};
      for (const [k, v] of Object.entries(this.map)) {
        if (DEFAULT_THEME_BY_TYPE[k as keyof typeof DEFAULT_THEME_BY_TYPE] !== v) {
          overrides[k] = v;
        }
      }
      localStorage.setItem("themeByTypeOverrides", JSON.stringify(overrides));
    },
    reset() {
      this.map = { ...DEFAULT_THEME_BY_TYPE };
      localStorage.removeItem("themeByTypeOverrides");
    },
  },
});
