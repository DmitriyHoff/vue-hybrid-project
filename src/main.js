import Vue from 'vue'
import App from './App.vue'

import { createApp } from 'vue3'
import AppVue3 from './App.vue3.vue'

// Vue 2 App
new Vue({render: (h) => h(App)}).$mount('#app-vue2')

// Vue3 App
createApp(AppVue3).mount('#app-vue3')