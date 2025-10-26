// componenets/TodoList.jsx

import React from 'react';
import { useRecoilValue } from 'recoil';
import { filteredTodoListSelector } from '../state/selectors';
import TodoItem from './TodoItem';
import SearchInput from './SearchInput';
import AddTodo from './AddTodo';
import TodoListFilters from './TodoListFilters';


function TodoList() {

    const list = useRecoilValue(filteredTodoListSelector);

    return (
        <div>
            <AddTodo />
            <div style={{ marginBottom: '20px' }}>
                <SearchInput />
                <TodoListFilters />
            </div>
            <hr />

            {list.length === 0 ? (<p>No todos match your search</p>) : (list.map(todo => (
                <TodoItem key={todo._id} todo={todo} />
            )))}

        </div>
    );
}

export default TodoList;