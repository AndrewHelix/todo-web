export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoPayload {
  title?: string;
  completed?: boolean;
}
