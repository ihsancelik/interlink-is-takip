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