import { useAppSelector } from '../store/hooks';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { items, status } = useAppSelector((state) => state.todos);

  if (status === 'loading') {
    return <p className="status-message">Loading todos...</p>;
  }

  if (items.length === 0) {
    return <p className="status-message">No todos yet. Add your first task above.</p>;
  }

  return (
    <ul className="todo-list">
      {items.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
