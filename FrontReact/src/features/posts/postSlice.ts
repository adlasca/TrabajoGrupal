import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import type { Post } from '../../models/Post';

interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Post[]>('/posts');
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (post: Omit<Post, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Post>('/posts', post);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, post }: { id: number; post: Omit<Post, 'id'> }, { rejectWithValue }) => {
    try {
      await api.put(`/posts/${id}`, post);
      return { id, ...post } as Post;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error??error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error??error.message);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.selectedPost = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.posts = state.posts.filter(p => p.id !== action.payload);
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedPost, clearError } = postSlice.actions;
export default postSlice.reducer;