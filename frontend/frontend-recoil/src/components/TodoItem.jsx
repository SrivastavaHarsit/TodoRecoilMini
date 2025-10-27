// src/components/TodoItem.jsx
import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { todoAtomFamily, mutationStatusAtomFamily } from '../state/todoAtoms';
import { patchTodo, deleteTodo, toggleCompleteCompat } from '../api/todos';
import { useInvalidateTodos } from '../utils/recoilInvalidate';

const rowStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  boxSizing: 'border-box',
};

function TodoItem({ id, style }) {
  // READ: Loadable 
  const todoL = useRecoilValueLoadable(todoAtomFamily(id));
  // WRITE: set functions don’t cause suspense; they’re safe
  const setTodo = useSetRecoilState(todoAtomFamily(id));
  const setStatus = useSetRecoilState(mutationStatusAtomFamily(id));
  const invalidate = useInvalidateTodos();

  // local edit UI state (only used when the todo is loaded)
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // derive the todo value or a disabled fallback
  const todo = useMemo(() => (todoL.state === 'hasValue' ? todoL.contents : null), [todoL]);

  // initialize edit fields when item first loads or when entering edit mode
  useEffect(() => {
    if (todo && isEditing) {
      setEditTitle(todo.title || '');
      setEditDesc(todo.description || '');
    }
  }, [todo, isEditing]);

  const onToggle = useCallback(async () => {
    if (!todo) return;
    setStatus('saving');
    // optimistic UI assuming backend will succeed
    setTodo(prev => ({ ...prev, completed: !prev.completed }));
    try {
      const updated = await toggleCompleteCompat(id, !todo.completed);
      setTodo(updated);
      setStatus('idle');
    } catch (e) {
      console.error('Toggle failed:', e);
      setStatus('error');
      // revert
      setTodo(prev => ({ ...prev, completed: !prev.completed }));
    }
  }, [id, setStatus, setTodo, todo]);

  const onDelete = useCallback(async () => {
    setStatus('saving');
    try {
      await deleteTodo(id);
      setStatus('idle');
      await invalidate(); // removes it from list
    } catch (e) {
      console.error('Delete failed:', e);
      setStatus('error');
    }
  }, [id, invalidate, setStatus]);

  const onSave = useCallback(async () => {
    if (!todo) return;
    setStatus('saving');
    const old = todo;
    // optimistic edit
    setTodo(prev => ({ ...prev, title: editTitle, description: editDesc }));
    try {
      const updated = await patchTodo(id, { title: editTitle, description: editDesc });
      setTodo(updated);
      setIsEditing(false);
      setStatus('idle');
    } catch (e) {
      console.error('Save failed:', e);
      setStatus('error');
      setTodo(old); // revert
    }
  }, [id, editTitle, editDesc, setStatus, setTodo, todo]);

  const onCancel = useCallback(() => {
    setIsEditing(false);
    if (todo) {
      setEditTitle(todo.title || '');
      setEditDesc(todo.description || '');
    }
  }, [todo]);

  // ------- render states (Loadable pattern) -------
  if (todoL.state === 'loading') {
    return (
      <div style={{ ...rowStyle, ...style, opacity: 0.6 }}>
        <em>Loading…</em>
      </div>
    );
  }

  if (todoL.state === 'hasError') {
    return (
      <div style={{ ...rowStyle, ...style, borderColor: 'crimson', color: 'crimson' }}>
        Failed to load item {id}: {String(todoL.contents?.message || todoL.contents)}
        <div>
          <button onClick={invalidate}>Retry</button>
        </div>
      </div>
    );
  }

  // hasValue from here
  return (
    <div
      style={{
        ...rowStyle,
        ...style,
        textDecoration: todo.completed ? 'line-through' : 'none',
        opacity: todo.completed ? 0.6 : 1,
      }}
    >
      {!isEditing ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={!!todo.completed} onChange={onToggle} />
            <h3 style={{ margin: 0 }}>{todo.title}</h3>
          </div>
          {todo.description ? <p style={{ margin: '6px 0' }}>{todo.description}</p> : null}
          <div style={{ display: 'flex', gap: 8 }}>
            {!todo.completed && <button onClick={() => setIsEditing(true)}>Edit</button>}
            <button onClick={onDelete}>Delete</button>
          </div>
        </>
      ) : (
        <>
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
          <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={onSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </>
      )}
      <MutationBadge id={id} />
    </div>
  );
}

const MutationBadge = memo(function MutationBadge({ id }) {
  // mutationStatusAtomFamily is synchronous, safe to use directly
  const setStatus = useSetRecoilState(mutationStatusAtomFamily(id));
  // quick “show last state” trick: we don’t read it here to avoid re-renders;
  // if you want visible text, switch to useRecoilValue(mutationStatusAtomFamily(id))
  // and render it. Keeping it minimal to avoid noise.
  return null;
});

export default memo(TodoItem);
