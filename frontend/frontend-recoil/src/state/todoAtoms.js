// src/state/todoAtoms.js
import { atom, atomFamily, selectorFamily } from 'recoil';
import { fetchTodoById, normalizeTodo } from '../api/todos';

// central cache: { [id]: todo }
// list layer can seed this to avoid N+1 fetches
export const todosCacheAtom = atom({
  key: 'todosCacheAtom',
  default: {},
});

// per-todo mutation status: 'idle' | 'saving' | 'error'
export const mutationStatusAtomFamily = atomFamily({
  key: 'mutationStatusAtomFamily',
  default: 'idle',
});

// optional: track temp ids for optimistic "add"
export const localAddedIdsAtom = atom({
  key: 'localAddedIdsAtom',
  default: [],
});

// per-id fetch with cache-first behavior (no import from list selectors → no cycles)
export const todoByIdSelectorFamily = selectorFamily({
  key: 'todoByIdSelectorFamily',
  get: (id) => async ({ get }) => {
    const cache = get(todosCacheAtom);
    if (cache?.[id]) return cache[id];
    const fetched = await fetchTodoById(id);
    return normalizeTodo(fetched);
  },
});

// per-todo atom; components read/write this.
// default delegates to by-id selector (Suspense friendly)
export const todoAtomFamily = atomFamily({
  key: 'todoAtomFamily',
  default: (id) => todoByIdSelectorFamily(id),
});
