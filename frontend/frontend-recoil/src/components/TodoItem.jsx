// components/TodoItem.jsx

import React, { memo, useCallback } from 'react';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { todoListQuery } from '../state/selectors';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function TodoItem({ todo }) {
    const refreshTodoList = useRecoilRefresher_UNSTABLE(todoListQuery)

    const handleComplete = useCallback(async () => {
        try {
            await axios.put(`${API_URL}/completed`, {
                id: todo._id,
            });
            refreshTodoList();
        } catch(err) {
            console.error('Failed to update todo:', err);
        }
    }, [todo._id]);

    const itemStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    textDecoration: todo.completed ? 'line-through' : 'none',
    opacity: todo.completed ? 0.6 : 1,
  };

  console.log(`Rendering TodoItem: ${todo.title}`);

  return (
    <div style={itemStyle}>
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      {!todo.completed && (
        <button onClick={handleComplete}>Mark as Complete</button>
      )}
    </div>
  );
}

export default memo(TodoItem);