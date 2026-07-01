import { type FormEvent, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createTodo } from '../store/todosSlice';

export function TodoForm() {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    await dispatch(createTodo({ title: trimmed }));
    setTitle('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        maxLength={500}
      />
      <button type="submit">Add</button>
    </form>
  );
}
