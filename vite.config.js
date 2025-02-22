import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import vue3 from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    // Vue 2.7 plugin for *.vue files
    vue2({
      include: /\.vue$/, // Only process *.vue files with Vue 2.7
      exclude: /\.vue3\.vue$/,

    }),
    // Vue 3.5 plugin for *.vue3.vue files
    vue3({
      include: /\.vue3\.vue$/, // Only process *.vue3.vue files with Vue 3.5
    }),
    {
      name: 'fix-vue3-imports',
      enforce: 'post', // Run after other transforms
      transform(code, id) {
        if (id.endsWith('.vue3.vue')) {
          // Replace 'vue' imports with 'vue3' in the compiled output
          console.log('fix-vue3-imports: ', id);
          return code.replace(
            /from ['"]vue['"]/g,
            'from "vue3"'
          );
        }
        return null; // No change for other files
      },
    },
    
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',           // Vue 2.7
      vue3: 'vue3/dist/vue.esm-bundler.js',  // Vue 3.5
    },
  },
})
