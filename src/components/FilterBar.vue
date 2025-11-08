<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePokeTypesStore } from "@/stores/pokeTypes";

const props = defineProps<{
  modelValueQuery?: string;
  modelValueType?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValueQuery", v: string): void;
  (e: "update:modelValueType", v: string): void;
  (e: "change"): void;
}>();

const pokeTypesStore = usePokeTypesStore();
const { types, loadingTypes } = storeToRefs(pokeTypesStore);

const queryLocal = ref(props.modelValueQuery ?? "");
const typeLocal = ref(props.modelValueType ?? "");

watch(
  () => props.modelValueQuery,
  (v) => (queryLocal.value = v ?? "")
);
watch(
  () => props.modelValueType,
  (v) => (typeLocal.value = v ?? "")
);

let t: any = null;
watch(
  () => queryLocal.value,
  (v) => {
    clearTimeout(t);
    t = setTimeout(() => {
      emit("update:modelValueQuery", v);
      emit("change");
    }, 250);
  }
);

watch(
  () => typeLocal.value,
  (v) => {
    emit("update:modelValueType", v);
    emit("change");
  }
);

function clearAll() {
  queryLocal.value = "";
  typeLocal.value = "";
  emit("update:modelValueQuery", "");
  emit("update:modelValueType", "");
  emit("change");
}
</script>

<template>
  <div
    class="rounded-2xl ring-1 ring-black/10 dark:ring-white/10 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
  >
    <label
      class="flex-1 inline-flex items-center gap-2 rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white/70 dark:bg-slate-800/70 px-3 py-2"
    >
      <svg viewBox="0 0 24 24" class="size-5 opacity-70">
        <path
          d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <input
        v-model="queryLocal"
        type="text"
        inputmode="search"
        placeholder="Search by name or ID (e.g., pikachu or 25)"
        class="w-full bg-transparent outline-none text-sm"
      />
    </label>

    <div class="flex items-center gap-2">
      <div
        class="rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white/70 dark:bg-slate-800/70 px-3 py-2"
      >
        <select
          v-model="typeLocal"
          class="cursor-pointer bg-transparent outline-none text-sm capitalize"
        >
          <option value="">All types</option>
          <option v-if="loadingTypes" disabled>Loading types…</option>
          <option v-for="t in types" :key="t.name" :value="t.name">
            {{ t.name }}
          </option>
        </select>
      </div>

      <button
        @click="clearAll"
        class="cursor-pointer inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-black/10 dark:ring-white/10 bg-white/70 dark:bg-slate-800/70 hover:bg-white/30 transition"
        title="Clear filters"
      >
        Clear
        <svg viewBox="0 0 24 24" class="size-4 opacity-80">
          <path
            d="M6 6l12 12M18 6l-12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
