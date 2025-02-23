[![en](https://img.shields.io/badge/lang-en-green.svg)](https://github.com/DmitriyHoff/vue-hybrid-project/blob/main/README.md)
[![ru](https://img.shields.io/badge/lang-ru-red.svg)](https://github.com/DmitriyHoff/vue-hybrid-project/blob/main/README.ru.md)

# Vue Hybrid Project

Этот репозиторий предоставляет настройку, при которой компоненты Vue 2 и Vue 3 сосуществуют и могут рендериться из единой точки входа, используя Vite.

Этот гибридный подход позволяет постепенно мигрировать с Vue 2 на Vue 3 и поддерживать устаревшие компоненты, внедряя новые функции.

Использование единой сборки может быть проще по сравнению с отдельными проектами.

## Требования

- Node.js (18.x или новее)

## Структура проекта
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

## Как это работает

### Псевдоним для Vue 3
Vue 3 установлен как `vue3` и используется следующим образом:
```js
import { createApp } from 'vue3'
```

### Переопределение одноранговых зависимостей
Разрешает конфликты между @vitejs/plugin-vue и vue@2.7.16:
```json
// package.json
"overrides": {
  "@vitejs/plugin-vue": {
    "vue": "vue3"
  }
}
```
### Расширения файлов
 * `*.vue`: для компонентов Vue 2, обрабатываются `@vitejs/plugin-vue2`
 * `*.vue3.vue`: для компонентов Vue 3, обрабатываются `@vitejs/plugin-vue`

### Конфигурация Vite
```js
// vite.config.js

import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import vue3 from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    // Плагин Vue 2.7 для файлов *.vue
    vue2({
      include: /\.vue$/,
      exclude: /\.vue3\.vue$/,
    }),

    // Плагин Vue 3.5 для файлов *.vue3.vue
    vue3({
      include: /\.vue3\.vue$/, 
    }),
    {
      name: 'fix-vue3-imports',
      enforce: 'post', // Выполняется после других преобразований
      transform(code, id) {
        if (id.endsWith('.vue3.vue')) {

          // Заменяет импорты 'vue' на 'vue3' в скомпилированном выводе
          console.log('fix-vue3-imports: ', id);
          return code.replace(/from ['"]vue['"]/g, 'from "vue3"');
        }
        return null; // Без изменений для других файлов
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
#### Пользовательский плагин Vite (`fix-vue3-imports`)
Заменяет `from 'vue'` на `from 'vue3'` в файлах `*.vue3.vue` после компиляции, обеспечивая использование псевдонима `vue3` для компонентов Vue 3.

### Исправление
Модификация `@vitejs/plugin-vue` для использования `vue3`:

```json
"scripts": {
    "postinstall": "patch-package"
}
```
Выполняет`patch-package` после `npm install` для применения патча (`patches/@vitejs+plugin-vue+5.2.1.patch`).