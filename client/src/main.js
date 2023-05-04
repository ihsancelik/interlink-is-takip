import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import 'datatables.net-select'
import 'datatables.net-responsive'

DataTable.use(DataTablesCore);

import './assets/main.css'

const app = createApp(App)

app.use(router)

const store = new createStore({
    state: {
        user: null,
        users: null,
        departments: null,
        roles: null
    },
    mutations: {
        setUser(state, user) {
            state.user = JSON.stringify(user)
            localStorage.setItem('user', JSON.stringify(user))
        },
        setUsers(state, users) {
            state.users = users
        },
        setDepartments(state, departments) {
            state.departments = departments
        },
        setRoles(state, roles) {
            state.roles = roles
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
        },
        async users({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const users = await axios.get('http://localhost:3000/users', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setUsers', users.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async create_user({ commit }, { full_name, username, password, departmentid, roleid }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { full_name, username, password, departmentid, roleid }
                console.log(data)

                await axios.post('http://localhost:3000/users',
                    { data: data },
                    { headers: headers });

                store.dispatch('users');
                return true;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async departments({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const departments = await axios.get('http://localhost:3000/departments', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setDepartments', departments.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async roles({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const roles = await axios.get('http://localhost:3000/roles', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setRoles', roles.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
    },
    getters: {
        isAuthenticated(state) {
            return !!state.accessToken
        },
        getUsers(state) {
            return state.users
        },
        getDepartments(state) {
            return state.departments
        },
        getRoles(state) {
            return state.roles
        }
    }
});

if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    store.commit('setUser', user);
}

app.use(store);

app.mount('#app')