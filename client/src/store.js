import { createStore } from 'vuex';
import axios from 'axios'
import { api_url } from './helpers/constants.js';

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
        error: null,
        createdTaskId: null
    },
    mutations: {
        setError(state, error) {
            console.log(error);
            if (error.status == 401 && window.location.href != '/login') {
                localStorage.removeItem('user');
                window.location.href = '/login';
                return false;
            }
            navigator.showErrorAlert(error.response.data.message, 'danger');
            state.error = error;
        },
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
        },
        setCreatedTaskId(state, createdTaskId) {
            state.createdTaskId = createdTaskId
        }
    },
    actions: {
        async login({ commit }, { username, password, device_id }) {
            try {
                const response = await axios.post(api_url + '/login', {
                    username,
                    password,
                    device_id
                })
                const user = response.data
                commit('setUser', user)
                return true
            } catch (error) {
                commit('setError', error)
                return false
            }
        },
        async users({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const users = await axios.get(api_url + '/users', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setUsers', users.data);
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async create_user({ commit }, { full_name, email, gsm, username, password, departmentid, roleid }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { full_name, email, gsm, username, password, departmentid, roleid }

                await axios.post(api_url + '/users',
                    { data: data },
                    { headers: headers });

                store.dispatch('users');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async create_department({ commit }, { name }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { name }

                await axios.post(api_url + '/departments',
                    { data: data },
                    { headers: headers });

                store.dispatch('departments');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async create_project({ commit }, { name }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { name }

                await axios.post(api_url + '/projects',
                    { data: data },
                    { headers: headers });

                store.dispatch('projects');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async edit_user({ commit }, { userId, full_name, email, gsm, username, password, departmentid, roleid }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { full_name, email, gsm, username, password, departmentid, roleid }

                await axios.put(api_url + '/users/' + userId,
                    { data: data },
                    { headers: headers });

                store.dispatch('users');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async edit_department({ commit }, { departmentId, name }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { name }

                await axios.put(api_url + '/departments/' + departmentId,
                    { data: data },
                    { headers: headers });

                store.dispatch('departments');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async edit_project({ commit }, { projectId, name }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { name }

                await axios.put(api_url + '/projects/' + projectId,
                    { data: data },
                    { headers: headers });

                store.dispatch('projects');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async delete_user({ commit }, { userId }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

                await axios.delete(api_url + '/users/' + userId,
                    { headers: headers });

                store.dispatch('users');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async delete_department({ commit }, { departmentId }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

                await axios.delete(api_url + '/departments/' + departmentId,
                    { headers: headers });

                store.dispatch('departments');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async delete_project({ commit }, { projectId }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

                await axios.delete(api_url + '/projects/' + projectId,
                    { headers: headers });

                store.dispatch('projects');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async departments({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const departments = await axios.get(api_url + '/departments', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setDepartments', departments.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },
        async roles({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const roles = await axios.get(api_url + '/roles', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setRoles', roles.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },


        async taskTypes({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const taskTypes = await axios.get(api_url + '/task-types', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTaskTypes', taskTypes.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },
        async taskStatuses({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const taskStatuses = await axios.get(api_url + '/task-statuses', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTaskStatuses', taskStatuses.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },
        async taskPriorities({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const taskPriorities = await axios.get(api_url + '/task-priorities', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTaskPriorities', taskPriorities.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },
        async projects({ commit }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const projects = await axios.get(api_url + '/projects', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setProjects', projects.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },

        async tasks({ commit }, query = '0') {
            try {
                const token = JSON.parse(this.state.user).token;
                const tasks = await axios.get(api_url + '/tasks/with-query/' + query, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setTasks', tasks.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },
        async create_task({ commit }, { title, description, related_project, related_person, related_department, type, status, priority }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { title, description, related_project, related_person, related_department, type, status, priority }

                const response = await axios.post(api_url + '/tasks',
                    { data: data },
                    { headers: headers });

                const createdTaskId = response.data._id;
                commit('setCreatedTaskId', createdTaskId);

                store.dispatch('tasks');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async edit_task({ commit }, { taskId, title, description, related_project, related_person, related_department, type, status, priority }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                const data = { title, description, related_project, related_person, related_department, type, status, priority }

                await axios.put(api_url + '/tasks/' + taskId,
                    { data: data },
                    { headers: headers });

                store.dispatch('tasks');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        async delete_task({ commit }, { taskId }) {
            try {
                const token = JSON.parse(this.state.user).token;

                const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

                await axios.delete(api_url + '/tasks/' + taskId,
                    { headers: headers });

                store.dispatch('tasks');
                return true;
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },


        async conversations({ commit }, { taskId }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const conversations = await axios.get(api_url + '/conversations/' + taskId, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setConversations', conversations.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },
        async department_manager({ commit }, { departmentId }) {
            try {
                const token = JSON.parse(this.state.user).token;
                const departmentManager = await axios.get(api_url + '/departments/manager/' + departmentId, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setDepartmentManager', departmentManager.data);
                return true;
            } catch (error) {
                commit('setError', error)
                return false;
            }
        },
    },
    getters: {
        getError(state) {
            return state.error
        },
        getUser(state) {
            return state.user
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
        },
        getCreatedTaskId(state) {
            return state.createdTaskId
        }
    }
});

const serviceStore = {
    commit: store.commit,
    dispatch: store.dispatch,
    store: store
};

export default serviceStore;