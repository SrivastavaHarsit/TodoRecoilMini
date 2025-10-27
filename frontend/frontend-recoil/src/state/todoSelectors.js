// src/state/todoSelectors.js
import { selector, selectorFamily } from 'recoil';
import { fetchTodos } from '../api/todos';
import { searchTermAtom, todoListFilterAtom } from './atoms';
import { todosCacheAtom } from './todoAtoms';

// parametric list fetch (server supports search/status/page… or ignores them)
export const todoListQueryFamily = selectorFamily({
  key: 'todoListQueryFamily',
  get:
    ({ search = '', filter = 'Show All', page = 1, pageSize = 200 } = {}) =>
    async () => {
      let status = 'all';
      if (filter === 'Show Completed') status = 'completed';
      else if (filter === 'Show Incomplete') status = 'incomplete';
      return fetchTodos({ search, status, page, pageSize });
    },
});

// backwards-compat shim for old code
export const todoListQuery = selector({
  key: 'todoListQuery',
  get: async () => fetchTodos({}),
});

// write-only selector: seed the cache with a list result (avoids N+1)
export const seedTodosCacheSelector = selector({
  key: 'seedTodosCacheSelector',
  get: () => null,
  set: ({ set }, newValue) => {
    const incoming = Array.isArray(newValue) ? newValue : [];
    set(todosCacheAtom, (prev) => {
      const next = { ...(prev || {}) };
      for (const t of incoming) {
        if (t?.id) next[t.id] = t;
      }
      return next;
    });
  },
});

// global, atom-driven filtered IDs (simple mode)
export const filteredTodoIdsSelector = selector({
  key: 'filteredTodoIdsSelector',
  get: ({ get }) => {
    const search = (get(searchTermAtom) || '').toLowerCase();
    const filter = get(todoListFilterAtom);
    const list = get(todoListQueryFamily({ search, filter, page: 1, pageSize: 200 }));

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

// parametric filtered IDs (advanced mode)
export const filteredTodoIdsSelectorFamily = selectorFamily({
  key: 'filteredTodoIdsSelectorFamily',
  get:
    ({ filter = 'Show All', search = '' } = {}) =>
    ({ get }) => {
      const list = get(todoListQueryFamily({ search, filter, page: 1, pageSize: 200 }));
      const s = (search || '').toLowerCase();

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

// derived stats
export const todoStatsSelector = selector({
  key: 'todoStatsSelector',
  get: ({ get }) => {
    const list = get(todoListQueryFamily({ page: 1, pageSize: 200 }));
    const total = list.length;
    const completed = list.filter((t) => t.completed).length;
    const remaining = total - completed;
    return { total, completed, remaining };
  },
});
