// src/components/TodoList.jsx
import React, { useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import {
  filteredTodoIdsSelector,
  todoListQueryFamily,
  seedTodosCacheSelector,
} from '../state/todoSelectors';
import TodoItem from './TodoItem';
import SearchInput from './SearchInput';
import AddTodo from './AddTodo';
import TodoListFilters from './TodoListFilters';

function TodoList() {
  // read filtered IDs as a Loadable so we control loading & error
  const idsL = useRecoilValueLoadable(filteredTodoIdsSelector);

  // also read the raw list for cache seeding (as a Loadable)
  const listL = useRecoilValueLoadable(todoListQueryFamily({ page: 1, pageSize: 200 }));
  const seedCache = useSetRecoilState(seedTodosCacheSelector);

  // seed cache only when the list has a value
  useEffect(() => {
    if (listL.state === 'hasValue') seedCache(listL.contents);
  }, [listL.state, listL.contents, seedCache]);

  return (
    <div>
      <AddTodo />
      <div style={{ marginBottom: '20px', display: 'flex', gap: 8 }}>
        <SearchInput />
        <TodoListFilters />
      </div>
      <hr />

      {idsL.state === 'loading' && <p>Loading todos...</p>}
      {idsL.state === 'hasError' && (
        <p style={{ color: 'crimson' }}>
          Failed to load todos: {String(idsL.contents?.message || idsL.contents)}
        </p>
      )}
      {idsL.state === 'hasValue' && (
        idsL.contents.length === 0 ? (
          <p>No todos match your search</p>
        ) : (
          idsL.contents.map((id) => <TodoItem key={id} id={id} />)
        )
      )}
    </div>
  );
}

export default TodoList;
