import type {
  CreateTodoPayload,
  Todo,
  UpdateTodoPayload,
} from '../types/todo';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const todosApi = {
  getAll: () => request<Todo[]>('/todos'),
  create: (payload: CreateTodoPayload) =>
    request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: UpdateTodoPayload) =>
    request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    request<void>(`/todos/${id}`, {
      method: 'DELETE',
    }),
};
