import { type FormEvent, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { deleteTodo, updateTodo } from '../store/todosSlice';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleToggle = () => {
    dispatch(updateTodo({ id: todo.id, payload: { completed: !todo.completed } }));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    await dispatch(updateTodo({ id: todo.id, payload: { title: trimmed } }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      {isEditing ? (
        <form className="todo-edit-form" onSubmit={handleSave}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={500}
            autoFocus
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span className="todo-title">{todo.title}</span>
          <div className="todo-actions">
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
