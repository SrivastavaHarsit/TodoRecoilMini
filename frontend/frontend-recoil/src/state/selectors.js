import { selector } from "recoil";
import { searchTermAtom, todoListFilterAtom } from "./atoms";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export const todoListQuery = selector({
    key: "todoListQuery",
    get: async () => {
        try {
            const response = await axios.get(`${API_URL}/todos`);
            return response.data;
        } catch(err) {
            console.error("Error fecthing todos:", err);
            throw err;
        }
    },
})

// Selector 1: Get the filtered list of Todo items based on completion status
export const filteredTodoListSelector = selector({
    key: "filteredTodoListSelector",
    get: ({ get }) => {
        const list = get(todoListQuery);
        const statusFilter  = get(todoListFilterAtom);
        const searchTerm = get(searchTermAtom).toLowerCase();

        const filteredBySearch = searchTerm === '' ? list : list.filter(todo => todo.title.includes(searchTerm) || todo.description.includes(searchTerm));

        switch(statusFilter) {
            case 'Show Completed':
                return filteredBySearch.filter(todo => todo.completed);
            case 'Show Incomplete':
                return filteredBySearch.filter(todo => !todo.completed);
            default:
                return filteredBySearch;
        }
    }
})

