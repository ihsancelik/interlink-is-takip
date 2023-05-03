import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './assets/main.css'

const app = createApp(App)

app.use(router)

const store = new createStore({
    state: {
        user: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        }
    },
    actions: {
        async login({ commit }, { username, password }) {
            try {
                const response = await axios.post('http://localhost:3000/login', {
                    username,
                    password
                })
                const user = response.data
                commit('setUser', user)
                return true
            } catch (error) {
                console.error(error)
                return false
            }
        }
    },
    getters: {
        isAuthenticated(state) {
            return !!state.accessToken
        }
    }
});

app.use(store);

app.mount('#app')