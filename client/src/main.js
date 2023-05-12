import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './assets/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.use(router)

const store = new createStore({
    state: {
        user: null,
        users: null,
        departments: null,
        roles: null,
        tasks: null,
        taskTypes: null,
        taskStatuses: null,
        taskPriorities: null,
        conversations: null,
        departmentManager: null,
        projects: null,
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
        },
        setTasks(state, tasks) {
            state.tasks = tasks
        },
        setTaskTypes(state, taskTypes) {
            state.taskTypes = taskTypes
        },
        setTaskStatuses(state, taskStatuses) {
            state.taskStatuses = taskStatuses
        },
        setTaskPriorities(state, taskPriorities) {
            state.taskPriorities = taskPriorities
        },
        setConversations(state, conversations) {
            state.conversations = conversations
        },
        setDepartmentManager(state, departmentManager) {
            state.departmentManager = departmentManager
        },
        setProjects(state, projects) {
            state.projects = projects
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
        async create_user({ commit }, { full_name, email, gsm, username, password, departmentid, roleid }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { full_name, email, gsm, username, password, departmentid, roleid }
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
        async edit_user({ commit }, { userId, full_name, email, gsm, username, password, departmentid, roleid }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { full_name, email, gsm, username, password, departmentid, roleid }
                console.log(data)

                await axios.put('http://localhost:3000/users/' + userId,
                    { data: data },
                    { headers: headers });

                store.dispatch('users');
                return true;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async delete_user({ commit }, { userId }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

                await axios.delete('http://localhost:3000/users/' + userId,
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


        async taskTypes({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const taskTypes = await axios.get('http://localhost:3000/task-types', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTaskTypes', taskTypes.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async taskStatuses({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const taskStatuses = await axios.get('http://localhost:3000/task-statuses', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTaskStatuses', taskStatuses.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async taskPriorities({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const taskPriorities = await axios.get('http://localhost:3000/task-priorities', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTaskPriorities', taskPriorities.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async projects({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const projects = await axios.get('http://localhost:3000/projects', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setProjects', projects.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        async tasks({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const tasks = await axios.get('http://localhost:3000/tasks', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTasks', tasks.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async create_task({ commit }, { title, description, related_project, related_person, related_department, type, status, priority }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { title, description, related_project, related_person, related_department, type, status, priority }
                console.log(data)

                await axios.post('http://localhost:3000/tasks',
                    { data: data },
                    { headers: headers });

                store.dispatch('tasks');
                return true;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async edit_task({ commit }, { taskId, title, description, related_project, related_person, related_department, type, status, priority }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { title, description, related_project, related_person, related_department, type, status, priority }

                await axios.put('http://localhost:3000/tasks/' + taskId,
                    { data: data },
                    { headers: headers });

                store.dispatch('tasks');
                return true;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async delete_user({ commit }, { taskId }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

                await axios.delete('http://localhost:3000/tasks/' + taskId,
                    { headers: headers });

                store.dispatch('tasks');
                return true;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },


        async conversations({ commit }, { taskId }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const conversations = await axios.get('http://localhost:3000/conversations/' + taskId, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setConversations', conversations.data);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async department_manager({ commit }, { departmentId }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const departmentManager = await axios.get('http://localhost:3000/departments/manager/' + departmentId, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setDepartmentManager', departmentManager.data);
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
        },
        getTasks(state) {
            return state.tasks
        },
        getTaskTypes(state) {
            return state.taskTypes
        },
        getTaskStatuses(state) {
            return state.taskStatuses
        },
        getTaskPriorities(state) {
            return state.taskPriorities
        },
        getConversations(state) {
            return state.conversations
        },
        getDepartmentManager(state) {
            return state.departmentManager
        },
        getProjects(state) {
            return state.projects
        }
    }
});

if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    store.commit('setUser', user);
}

app.use(store);

app.mount('#app')