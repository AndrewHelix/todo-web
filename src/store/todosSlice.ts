import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { todosApi } from '../api/todosApi';
import type { CreateTodoPayload, Todo, UpdateTodoPayload } from '../types/todo';

interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', () =>
  todosApi.getAll(),
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  (payload: CreateTodoPayload) => todosApi.create(payload),
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  ({ id, payload }: { id: string; payload: UpdateTodoPayload }) =>
    todosApi.update(id, payload),
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  (id: string) => todosApi.remove(id),
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load todos';
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to create todo';
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update todo';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.meta.arg);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete todo';
      });
  },
});

export const { clearError } = todosSlice.actions;
export default todosSlice.reducer;
