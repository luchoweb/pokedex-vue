# Pokedex - Vue 3 + TypeScript + Vite

Pokedex app built with **Vue 3**, **TypeScript**, **Pinia**, and **Vue Router**.

It demonstrates modern frontend architecture practices: stores, composables, HTTP services, lazy loading, controlled concurrency, and separation of concerns.

---

## Prerequisites

- **Node.js** v24.x+
- **npm** (comes with Node)
- **Git** to clone the project
- (Optional) Developer extensions:
  - Vue Devtools
  - Pinia Devtools

---

## Installation

```shell
git clone https://github.com/luchoweb/pokedex-vue
cd pokedex-vue
npm install
```

---

## Run in development mode

`npm run dev`

Open in your browser:

http://localhost:5173

---

## Available scripts

```shell
npm run dev # development server
npm run build # production build
npm run preview # preview production build
npm run lint # run ESLint analysis
npm run format # format code with Prettier
npm run test # run tests
```

---

## Project structure

src/
|- assets/ # images and static resources
|- components/ # reusable UI components
|- pages/ # router views (Pokedex, About, Pokemon)
|- stores/ # global state with Pinia
|- composables/ # reactive logic (usePokedex)
|- services/ # HTTP functions and non-reactive logic
|- utils/ # pure helpers and utilities
|- router/ # route configuration
|- App.vue
|- main.ts

> Conventions:
>
> - stores/ → global state
> - composables/ → reactive logic (Composition API)
> - services/ → HTTP / non-Vue logic
> - lazy routes except for the initial view

---

## Key concepts

- Composition API + `<script setup>` → cleaner and more declarative code
- Pinia → global and persistent state
- Composables (useXxx.ts) → reusable and testable logic
- HTTP services → clean requests without hooks
- Lazy loading in the router:
  const About = () => import("@/pages/About.vue");
- Concurrency limiter → controls request loading
- Request cancellation → avoids race conditions

---

## Execution flow

1. main.ts mounts Vue, Pinia, and Router
2. Pokedex.vue initializes theme and types
3. usePokedex() manages filters, API, cache, and concurrency
4. The UI updates reactively

---

## Tests

- Suggested framework: Vitest
- Recommended test cases:
  - Pagination and incremental loading
  - Filter bar component
  - Theme store

---

## Production build

npm run build
npm run preview

The generated content in dist/ can be deployed to Vercel, Netlify, or any static server.

---

## License

MIT — free for educational or personal use.

---

## Credits

Developed as a modern Vue architecture exercise.  
API: https://pokeapi.co/
