// src/state/atoms.js
import { atom } from 'recoil';

// Atom 1: This atom holds the text the user types to search box
export const searchTermAtom = atom({
    key: 'searchTermAtom',
    default: ''
});

// Atom 2: The simple string that holds our current filter setting
export const todoListFilterAtom = atom({
    key: 'todoListFilterAtom',
    default: 'Show All'
})

