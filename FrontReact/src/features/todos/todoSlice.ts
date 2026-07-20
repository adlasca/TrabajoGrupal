import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import type { Todo } from '../../models/Todo';

interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk(
  'todos/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Todo[]>('/todos');
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const fetchTodosByUserId = createAsyncThunk(
  'todos/fetchByUserId',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Todo[]>(`/users/${userId}/todos`);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const fetchTodoById = createAsyncThunk(
  'todos/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Todo>(`/todos/${id}`);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const createTodo = createAsyncThunk(
  'todos/create',
  async (todo: Omit<Todo, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Todo>('/todos', todo);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/update',
  async ({ id, todo }: { id: number; todo: Omit<Todo, 'id'> }, { rejectWithValue }) => {
    try {
      await api.put(`/todos/${id}`, todo);
      return { id, ...todo } as Todo;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/todos/${id}`);
      return id;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearSelectedTodo: (state) => {
      state.selectedTodo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTodosByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosByUserId.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodosByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTodoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodoById.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        state.selectedTodo = action.payload;
      })
      .addCase(fetchTodoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        state.todos.push(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        const index = state.todos.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.selectedTodo = action.payload;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.todos = state.todos.filter(t => t.id !== action.payload);
        if (state.selectedTodo?.id === action.payload) {
          state.selectedTodo = null;
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedTodo, clearError } = todoSlice.actions;
export default todoSlice.reducer;