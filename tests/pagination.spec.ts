import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadNextPage, type PagingState, type PokemonDetails } from "@/test-utils/paging";

// Mock the axios instance
vi.mock("@/services/api", () => {
  return {
    api: {
      get: vi.fn(),
    },
  };
});

import { api } from "@/services/api";

describe("Pagination & incremental loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("appends new items and advances offset", async () => {
    const state: PagingState = { items: [], offset: 0, limit: 2 };

    // Arrange: first page returns 2 items
    (api.get as any)
      // list page:
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1" },
            { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2" },
          ],
        },
      })
      // detail 1
      .mockResolvedValueOnce({ data: { id: 1, name: "bulbasaur" } as PokemonDetails })
      // detail 2
      .mockResolvedValueOnce({ data: { id: 2, name: "ivysaur" } as PokemonDetails });

    await loadNextPage(state);

    expect(state.items.map((p) => p.id)).toEqual([1, 2]);
    expect(state.offset).toBe(2);

    // Arrange: second page
    (api.get as any)
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3" },
            { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4" },
          ],
        },
      })
      .mockResolvedValueOnce({ data: { id: 3, name: "venusaur" } })
      .mockResolvedValueOnce({ data: { id: 4, name: "charmander" } });

    await loadNextPage(state);

    // It keeps previous ones and appends new
    expect(state.items.map((p) => p.id)).toEqual([1, 2, 3, 4]);
    expect(state.offset).toBe(4);
    // Ensure called with correct URLs
    expect(api.get).toHaveBeenCalledWith("/pokemon?limit=2&offset=0");
    expect(api.get).toHaveBeenCalledWith("/pokemon?limit=2&offset=2");
  });
});
