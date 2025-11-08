import { setActivePinia, createPinia } from "pinia";
beforeEach(() => setActivePinia(createPinia()));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }),
});

if (!("speechSynthesis" in window)) {
  (window as any).speechSynthesis = {
    cancel() {},
    getVoices() {
      return [];
    },
    speak() {},
  };
}
