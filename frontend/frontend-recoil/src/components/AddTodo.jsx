// components/AddTodo.jsx

import React, { useState } from 'react';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { todoListQuery } from '../state/selectors';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AddTodo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const refreshTodoList = useRecoilRefresher_UNSTABLE(todoListQuery);

    const handleAdd = async () => {
        if(!title) return;
        try {
            await axios.post(`${API_URL}/todo`, {
                title,
                description,
            });

            // Clear fields and refresh list
            setTitle('');
            setDescription('');
            refreshTodoList();
        } catch(err) {
            console.error('Failed to add todo:', err);
        }
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>
            <input type="text" placeholder='Description' value={description} onChange={e => setDescription(e.target.value)}/>
            <button onClick={handleAdd}>Add Todo</button>

        </div>
    );
}

export default AddTodo;