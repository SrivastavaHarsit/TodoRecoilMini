// src/components/AddTodo.jsx
import React, { useState } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { createTodo } from '../api/todos';
import { todoAtomFamily, mutationStatusAtomFamily, localAddedIdsAtom } from '../state/todoAtoms';
import { useInvalidateTodos } from '../utils/recoilInvalidate';

function AddTodo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const setLocalIds = useSetRecoilState(localAddedIdsAtom);
  const invalidate = useInvalidateTodos();

  const setTodoById = useRecoilCallback(({ set }) => (id, value) => {
    set(todoAtomFamily(id), value);
  }, []);

  const setStatusById = useRecoilCallback(({ set }) => (id, value) => {
    set(mutationStatusAtomFamily(id), value);
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    const tempId = `temp-${Date.now()}`;

    const optimistic = {
        id: tempId,
        title: title.trim(),
        description: description.trim(),
        completed: false
    };

    try {
        setStatusById(tempId, 'saving');
        setTodoById(tempId, optimistic);
        setLocalIds((prev) => [tempId, ...prev]);

        setTitle('');
        setDescription('');

        const saved = await createTodo({ 
        title: optimistic.title, 
        description: optimistic.description 
        });
        
        // Update the atom with saved data
        setTodoById(saved.id, saved);
        setStatusById(saved.id, 'idle');
        
        // Clean up temp id
        setLocalIds((prev) => prev.filter((id) => id !== tempId));
        
        // Invalidate cache to refresh list
        await invalidate();
    } catch (err) {
        console.error('Add todo failed:', err);
        setStatusById(tempId, 'error');
    }
 };

  return (
    <div style={{ marginBottom: '10px', display: 'flex', gap: 8 }}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleAdd}>Add Todo</button>
    </div>
  );
}

export default AddTodo;
