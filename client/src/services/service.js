import axios from 'axios';
import store from '../store';

export async function department_manager({ departmentId }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const departmentManager = await axios.get('http://localhost:3000/departments/manager/' + departmentId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return departmentManager.data;
    } catch (error) {
        store.commit('setError', error);
        throw error;
    }
}

export async function task_conversations({ taskId }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const conversations = await axios.get('http://localhost:3000/conversations/' + taskId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return conversations.data;
    } catch (error) {
        store.commit('setError', error);
        throw error;
    }
}

export async function add_conversation({ taskId, formData }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const headers = { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }

        await axios.post('http://localhost:3000/conversations/' + taskId,
            formData,
            { headers: headers });

        return true;
    } catch (error) {
        store.commit('setError', error);
        return Promise.reject(error);
    }
}


export async function change_task_status({ taskId, status }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        const data = { status: status }
        await axios.put('http://localhost:3000/tasks/change-status/' + taskId,
            { data: data },
            { headers: headers });

        return true;
    } catch (error) {
        store.commit('setError', error);
        return Promise.reject(error);
    }
}

export async function change_task_priority({ taskId, priority }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        const data = { priority: priority }
        await axios.put('http://localhost:3000/tasks/change-priority/' + taskId,
            { data: data },
            { headers: headers });

        return true;
    } catch (error) {
        store.commit('setError', error);
        return Promise.reject(error);
    }
}

export async function change_task_type({ taskId, type }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        const data = { type: type }
        await axios.put('http://localhost:3000/tasks/change-type/' + taskId,
            { data: data },
            { headers: headers });

        return true;
    } catch (error) {
        store.commit('setError', error);
        return Promise.reject(error);
    }
}

export async function change_task_project({ taskId, project }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        const data = { project: project }
        await axios.put('http://localhost:3000/tasks/change-project/' + taskId,
            { data: data },
            { headers: headers });

        return true;
    } catch (error) {
        store.commit('setError', error);
        return Promise.reject(error);
    }
}

export async function change_task_related_person({ taskId, related_person }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        const data = { related_person: related_person }
        await axios.put('http://localhost:3000/tasks/change-related-person/' + taskId,
            { data: data },
            { headers: headers });

        return true;
    } catch (error) {
        store.commit('setError', error);
        return Promise.reject(error);
    }
}


export async function get_task({ taskId }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const task = await axios.get('http://localhost:3000/tasks/' + taskId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return task.data;
    } catch (error) {
        store.commit('setError', error);
        throw error;
    }
}

export async function download_file({ virtualFileName, fileName }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('http://localhost:3000/storage/' + virtualFileName, {
            responseType: 'blob',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    } catch (error) {
        store.commit('setError', error);
        throw error;
    }
}


export async function sent_reminder({ taskId }) {
    try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        await axios.get('http://localhost:3000/tasks/send-reminder/' + taskId,
            { headers: headers });

        return true;
    } catch (error) {
        store.commit('setError', error);
        return Promise.reject(error);
    }
}