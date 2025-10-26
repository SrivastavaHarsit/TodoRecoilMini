import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//Normalize function to convert _id to id
export function normalizeTodo(raw) {
    if(!raw) return null;
    const id = raw._id ?? raw.id ?? String(raw._id ?? raw.id);
    return {
        id, 
        title: raw.title,
        description: raw.description ?? '',
        completed: !!raw.completed,
    };
};

export async function fetchTodos({search = '', status = 'all', page = 1, pageSize = 50} = {}) {
    const params = new URLSearchParams();
    if(search) params.set('search', search);
    if(status && status !== 'all') params.set('status', status);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    const url = `${API_URL}/todos${params.toString() ? `?${params.toString()}` : ''}`;
    const { data } = await axios.get(url);
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list.map(normalizeTodo);
}

export async function fetchTodoById(id) {
    const { data } = await axios.get(`${API_URL}/todos/${id}`);
    return normalizeTodo(data);
}

export async function createTodo({title, description = ''}) {
    const { data } = await axios.post(`${API_URL}/todo`, {
        title,
        description,
    });
    return normalizeTodo(data);
}

export async function patchTodo(id, patch) {
    const { data } = await axios.patch(`${API_URL}/todos/${id}`, patch);
    return normalizeTodo(data);
}

export async function toggleCompleteCompat(id, completed) {
    await axios.put(`${API_URL}/completed`, { id, completed });
    return fetchTodoById(id);
}

export async function deleteTodo(id) {
    await axios.delete(`${API_URL}/todos/${id}`);
    return true;
}