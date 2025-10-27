// src/components/TodoDetails.jsx
import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { todoByIdSelectorFamily } from '../state/todoAtoms';

function TodoDetails({ id }) {
  const todoL = useRecoilValueLoadable(todoByIdSelectorFamily(id));

  if (todoL.state === 'loading') return <p>Loading details…</p>;
  if (todoL.state === 'hasError')
    return <p style={{ color: 'crimson' }}>Failed to load details: {String(todoL.contents?.message || todoL.contents)}</p>;

  const todo = todoL.contents;
  return (
    <div style={{ border: '1px dashed #bbb', padding: 10, marginTop: 10 }}>
      <h3>Details</h3>
      <div><b>ID:</b> {todo.id}</div>
      <div><b>Title:</b> {todo.title}</div>
      <div><b>Description:</b> {todo.description || '—'}</div>
      <div><b>Completed:</b> {todo.completed ? 'Yes' : 'No'}</div>
    </div>
  );
}

export default TodoDetails;
