import { describe, it, expect, beforeEach } from "vitest";
import { useThemeTokensStore } from "@/stores/themeTokens";

describe("themeTokens store", () => {
  it("returns class for known type and falls back to default", () => {
    const t = useThemeTokensStore();
    const fire = t.classFor("fire");
    expect(fire).toMatch(/from-orange-400/);

    const unknown = t.classFor("unknown-type");
    const def = t.classFor();
    expect(unknown).toBe(def);
    expect(def.length).toBeGreaterThan(0);
  });

  it("applies overrides and uses them in classFor", () => {
    const t = useThemeTokensStore();
    const custom = "from-fuchsia-300 to-purple-600 ring-purple-400/30";
    t.setOverride("fire", custom);

    expect(t.classFor("fire")).toBe(custom);

    // Unknown type still falls back to default
    expect(t.classFor("nope")).toBe(t.classFor());
  });
});
