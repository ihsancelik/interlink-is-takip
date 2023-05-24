import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import './assets/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { } from './services/push-notification-permission'

const app = createApp(App)

app.use(router)



if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    store.commit('setUser', user);
}

import store from './store'

app.use(store.store);

app.mount('#app')