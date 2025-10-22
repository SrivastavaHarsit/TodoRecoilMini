// src/App.jsx
import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import TodoList from './components/TodoList';

function App() {
  return (
    <RecoilRoot>
      <h1>My Todo App</h1>
      
      {/* Suspense is needed to show a loading state
          while the async selector 'todoListQuery' is fetching data. */}
      <Suspense fallback={<p>Loading todos...</p>}>
        <TodoList />
      </Suspense>
    </RecoilRoot>
  );
}

export default App;