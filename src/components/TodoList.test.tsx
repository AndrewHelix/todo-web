import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import todosReducer from '../store/todosSlice';

function mockFetch(): ReturnType<typeof vi.fn<typeof fetch>> {
  const mock = vi.fn<typeof fetch>();
  vi.stubGlobal('fetch', mock);
  return mock;
}

function renderApp() {
  const store = configureStore({
    reducer: {
      todos: todosReducer,
    },
  });

  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('TodoList', () => {
  it('shows loading, requests the agreed URL and renders titles', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'todo-1',
            title: 'CI makes failures visible',
            completed: false,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ]),
        { status: 200 },
      ),
    );

    renderApp();

    expect(
      screen.getByText('A title that is never returned'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('CI makes failures visible'),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/todos',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows a useful error for a non-success HTTP response', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(new Response('unavailable', { status: 500 }));

    renderApp();

    expect(await screen.findByRole('alert')).toHaveTextContent('unavailable');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows a network error', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockRejectedValue(new Error('Network unavailable'));

    renderApp();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Network unavailable',
    );
  });

  it('accepts an empty list as a successful response', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(new Response('[]', { status: 200 }));

    renderApp();

    expect(
      await screen.findByText('No todos yet. Add your first task above.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
