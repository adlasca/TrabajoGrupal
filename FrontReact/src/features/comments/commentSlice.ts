import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import type { Comment } from '../../models/Comment';

interface CommentState {
  comments: Comment[];
  selectedComment: Comment | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  selectedComment: null,
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Comment[]>('/comments');
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchByPostId',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const fetchCommentById = createAsyncThunk(
  'comments/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Comment>(`/comments/${id}`);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const createComment = createAsyncThunk(
  'comments/create',
  async (comment: Omit<Comment, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Comment>('/comments', comment);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/update',
  async ({ id, comment }: { id: number; comment: Omit<Comment, 'id'> }, { rejectWithValue }) => {
    try {
      await api.put(`/comments/${id}`, comment);
      return { id, ...comment } as Comment;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${id}`);
      return id;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearSelectedComment: (state) => {
      state.selectedComment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCommentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentById.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        state.selectedComment = action.payload;
      })
      .addCase(fetchCommentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        const index = state.comments.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
        state.selectedComment = action.payload;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.comments = state.comments.filter(c => c.id !== action.payload);
        if (state.selectedComment?.id === action.payload) {
          state.selectedComment = null;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedComment, clearError } = commentSlice.actions;
export default commentSlice.reducer;