[![en](https://img.shields.io/badge/lang-en-green.svg)](https://github.com/DmitriyHoff/vue-hybrid-project/blob/main/README.md)
[![ru](https://img.shields.io/badge/lang-ru-red.svg)](https://github.com/DmitriyHoff/vue-hybrid-project/blob/main/README.ru.md)

# Vue Hybrid Project

This repository provides a setup where Vue 2 and Vue 3 components coexist and can be rendered from a single entry point using Vite.

This hybrid approach allows for a gradual migration from Vue 2 to Vue 3 and supports maintaining legacy components while introducing new features.

Using a unified build can be simpler compared to separate projects.
## Prerequisites
- Node.js (v18.x or later recommended)

## Project structure
```
vue-hybrid-project/
├── patches             # patch files directory
│   └── @vitejs+plugin-vue+5.2.1.patch
├── public              # static assets
│   └── vite.svg
├── src                # source code directory         
│   ├── App.vue        # Vue 2 app component
│   ├── App.vue3.vue   # Vue 3 app component 
│   └── main.js        # entry point
├── index.html         # HTML entry point
├── package.json       # dependencies and scripts
├── README.md          # this file
└── vite.config.js     # Vite config file
```

## How it works

### Vue 3 Alias
Vue 3 installed as `vue3` and used as:
```js
import { createApp } from 'vue3'
```

### Peer Dependency Overrides
Resolves conflicts between `@vitejs/plugin-vue` and `vue@2.7.16`:
```json
// package.json
"overrides": {
  "@vitejs/plugin-vue": {
    "vue": "vue3"
  }
}
```
### File Extensions
 * `*.vue`: For Vue 2 components, processed by `@vitejs/plugin-vue2`
 * `*.vue3.vue`: For Vue 3 components, processed by `@vitejs/plugin-vue`

### Vite configuration
```js
// vite.config.js

import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import vue3 from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    // Vue 2.7 plugin for *.vue files
    vue2({
      include: /\.vue$/,
      exclude: /\.vue3\.vue$/,
    }),

    // Vue 3.5 plugin for *.vue3.vue files
    vue3({
      include: /\.vue3\.vue$/, 
    }),
    {
      name: 'fix-vue3-imports',
      enforce: 'post', // Run after other transforms
      transform(code, id) {
        if (id.endsWith('.vue3.vue')) {

          // Replace 'vue' imports with 'vue3' in the compiled output
          console.log('fix-vue3-imports: ', id);
          return code.replace(/from ['"]vue['"]/g, 'from "vue3"');
        }
        return null; // No change for other files
      },
    },
    
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',            // Vue 2.7
      vue3: 'vue3/dist/vue.esm-bundler.js',  // Vue 3.5
    },
  },
})
```
#### Custom Vite Plugin (`fix-vue3-imports`)
Rewrites `from 'vue'` to `from 'vue3'` in `*.vue3.vue` files after compilation, ensuring Vue 3 components use the `vue3` alias consistently.

### Patching
Modifies `@vitejs/plugin-vue` to use `vue3`:

```json
"scripts": {
    "postinstall": "patch-package"
}
```
Runs `patch-package` after `npm install` to apply patches (e.g., `patches/@vitejs+plugin-vue+5.2.1.patch`).