// components/TodoListFilters.jsx

import React from "react";
import { useRecoilState } from 'recoil';
import { todoListFilterAtom } from '../state/atoms';

function TodoListFilters() {
    const [filter, setFilter] = useRecoilState(todoListFilterAtom);

    return (
        <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="Show All">All</option>
            <option value="Show Completed">Completed</option>
            <option value="Show Incomplete">Incomplete</option>
        </select>
    );
}

export default TodoListFilters;