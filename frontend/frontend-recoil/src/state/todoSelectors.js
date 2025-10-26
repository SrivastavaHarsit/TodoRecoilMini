import { selector, selectorFamily } from 'recoil';
import { fetchTodos, fetchTodoById, normalizeTodo } from '../api/todos';
import { searchTermAtom, todoListFilterAtom } from './atoms';
import { todoAtomFamily } from './todoAtoms';


/**
 * Fetch a single todo by id. Used as default for todoAtomFamily(id).
 * Suspense-friendly: components can wrap in <Suspense>.
 */
export const todoByIdSelectorFamily = selectorFamily({
    key: 'todoByIdSelectorFamily',
    get: (id) => async () => {
        const todo = await fetchTodoById(id);
        return todo;
    }
})

/**
 * Fetch a list of todos with parameters. This remains "read-only".
 * It returns the normalized array of todos.
 * Parameters:
 *  - search: string
 *  - filter: 'Show All' | 'Show Completed' | 'Show Incomplete'
 *  - page, pageSize: numbers (defaults suitable)
 */
export const todoListQueryFamily = selectorFamily({
    key: 'todoListQueryFamily',
    get: ({ search = '', filter = 'Show All', page = 1, pageSize = 50 } = {}) => async () => {
        let status = 'all';
        if(filter === 'Show Completed') status = 'completed';
        else if (filter === 'Show Incomplete') status = 'incomplete';
        const list = await fetchTodos({ search, status, page, pageSize });
        return list;
    },
})

/**
 * Client-side filtered IDs. We read the current search/filter atoms
 * and derive an array of ids to render. This version is "no-args",
 * but we also expose a parametric one for explicit control from components.
 */
export const filteredTodoIdSelector = selector({
    key: 'filteredTodoIdSelector',
    get: ({ get}) => {
        const search = get(searchTermAtom);
        const filter = get(todoListFilterAtom);
        const list = get(todoListQueryFamily({ search, filter, page: 1, pageSize: 200 })); // small-ish page

        const matches = list.filter((todo) => {
        const t = (todo.title || '').toLowerCase();
        const d = (todo.description || '').toLowerCase();
        const okSearch = !search || t.includes(search) || d.includes(search);
        const okFilter =
            filter === 'Show All'
            ? true
            : filter === 'Show Completed'
            ? todo.completed
            : !todo.completed;
        return okSearch && okFilter;
        });

        return matches.map((t) => t.id);
    },
});

/**
 * Parametric version: filtered IDs from explicit params.
 * Useful if you want to drive from component props instead of global atoms.
 */
export const filteredTodoIdsSelectorFamily = selectorFamily({
  key: 'filteredTodoIdsSelectorFamily',
  get:
    ({ filter = 'Show All', search = '' } = {}) =>
    ({ get }) => {
      const list = get(todoListQueryFamily({ search, filter, page: 1, pageSize: 200 }));
      const s = (search).toLowerCase();

      const matches = list.filter((todo) => {
        const t = (todo.title || '').toLowerCase();
        const d = (todo.description || '').toLowerCase();
        const okSearch = !s || t.includes(s) || d.includes(s);
        const okFilter =
          filter === 'Show All'
            ? true
            : filter === 'Show Completed'
            ? todo.completed
            : !todo.completed;
        return okSearch && okFilter;
      });

      return matches.map((t) => t.id);
    },
});
