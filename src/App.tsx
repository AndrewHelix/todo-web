import { useEffect } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { clearError, fetchTodos } from './store/todosSlice';
import './App.css';

const number: string = 10;

function App() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <main className="app">
      <header>
        <h1>Todo List</h1>
        <p>Manage your tasks with add, edit, and delete actions.</p>
      </header>

      <TodoForm />

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearError())}>
            Dismiss
          </button>
        </div>
      )}

      <TodoList />
    </main>
  );
}

export default App;
