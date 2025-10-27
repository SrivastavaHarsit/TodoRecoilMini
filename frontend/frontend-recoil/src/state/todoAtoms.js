// state/todoAtoms.js
import { atomFamily, atom } from 'recoil';
import { todoByIdSelectorFamily } from './todoSelectors';

// Per-todo atoms
export const todoAtomFamily = atomFamily({
  key: 'todoAtomFamily',
  default: (id) => todoByIdSelectorFamily(id), 
});

// Optional: per-todo mutation status (idle | saving | error)
export const mutationStatusAtomFamily = atomFamily({
  key: 'mutationStatusAtomFamily',
  default: 'idle',
});

// Optional: local added IDs for optimistic insertion
export const localAddedIdsAtom = atom({
  key: 'localAddedIdsAtom',
  default: [], // array of ids created locally before server confirmation
});
