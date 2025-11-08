import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import FilterBar from "@/components/FilterBar.vue";
import { seedPokeTypes } from "@/test-utils/pokeTypes";

describe("FilterBar.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("emits debounced query and selected type from store", async () => {
    await seedPokeTypes([{ name: "fire", url: "/api/v2/type/10/" }]);

    const wrapper = mount(FilterBar, {
      props: { modelValueQuery: "", modelValueType: "" },
    });

    await nextTick();

    const input = wrapper.find("#search-query");
    expect(input.exists()).toBe(true);

    await input.setValue("pikachu");
    vi.advanceTimersByTime(300);
    await nextTick();

    const select = wrapper.find("#select-types");
    expect(select.exists()).toBe(true);

    const options = wrapper.findAll("option").map((o) => o.attributes("value"));
    expect(options).toContain("fire");

    await select.setValue("fire");
    await nextTick();

    const emits = wrapper.emitted();
    expect(emits["update:modelValueQuery"]?.[0]?.[0]).toBe("pikachu");
    expect(emits["update:modelValueType"]?.[0]?.[0]).toBe("fire");
  });
});
