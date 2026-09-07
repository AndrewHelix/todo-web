import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

const { mockDispatch, updateTodo, deleteTodo } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  updateTodo: vi.fn((arg: unknown) => ({ type: 'todos/updateTodo', arg })),
  deleteTodo: vi.fn((id: string) => ({ type: 'todos/deleteTodo', id })),
}));

vi.mock('../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../store/todosSlice', () => ({
  updateTodo,
  deleteTodo,
}));

function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 'todo-1',
    title: 'Buy milk',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderTodoItem(todo: Todo = createTodo()) {
  return render(
    <ul>
      <TodoItem todo={todo} />
    </ul>,
  );
}

describe('TodoItem', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockDispatch.mockResolvedValue(undefined);
    updateTodo.mockClear();
    deleteTodo.mockClear();
  });

  it('renders the title and an unchecked checkbox for an incomplete todo', () => {
    renderTodoItem();

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('listitem')).not.toHaveClass('completed');
    expect(
      screen.getByRole('checkbox', { name: 'Mark "Buy milk" as complete' }),
    ).toBeInTheDocument();
  });

  it('marks a completed todo as checked and applies the completed class', () => {
    renderTodoItem(createTodo({ completed: true }));

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('listitem')).toHaveClass('todo-item', 'completed');
    expect(
      screen.getByRole('checkbox', { name: 'Mark "Buy milk" as incomplete' }),
    ).toBeInTheDocument();
  });

  it('dispatches updateTodo when the checkbox is toggled', async () => {
    const user = userEvent.setup();
    const todo = createTodo({ completed: false });
    renderTodoItem(todo);

    await user.click(screen.getByRole('checkbox'));

    expect(updateTodo).toHaveBeenCalledWith({
      id: 'todo-1',
      payload: { completed: true },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'todos/updateTodo',
      arg: { id: 'todo-1', payload: { completed: true } },
    });
  });

  it('dispatches deleteTodo when Delete is clicked', async () => {
    const user = userEvent.setup();
    renderTodoItem();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteTodo).toHaveBeenCalledWith('todo-1');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'todos/deleteTodo',
      id: 'todo-1',
    });
  });

  it('enters edit mode with the current title', async () => {
    const user = userEvent.setup();
    renderTodoItem();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('Buy milk')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('saves a trimmed title and leaves edit mode', async () => {
    const user = userEvent.setup();
    renderTodoItem();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const input = screen.getByDisplayValue('Buy milk');
    await user.clear(input);
    await user.type(input, '  Walk the dog  ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateTodo).toHaveBeenCalledWith({
      id: 'todo-1',
      payload: { title: 'Walk the dog' },
    });
    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  });

  it('does not save an empty or whitespace-only title', async () => {
    const user = userEvent.setup();
    renderTodoItem();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByDisplayValue('Buy milk'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateTodo).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

    await user.type(screen.getByRole('textbox'), '   ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateTodo).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('cancels editing and restores the original title', async () => {
    const user = userEvent.setup();
    renderTodoItem();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const input = screen.getByDisplayValue('Buy milk');
    await user.clear(input);
    await user.type(input, 'Changed title');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(updateTodo).not.toHaveBeenCalled();
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByDisplayValue('Buy milk')).toBeInTheDocument();
  });
});
