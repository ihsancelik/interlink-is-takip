import axios from 'axios';

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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
        return Promise.reject(error);
    }
}