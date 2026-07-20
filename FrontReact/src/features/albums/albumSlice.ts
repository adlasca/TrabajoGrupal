import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import type { Album } from '../../models/Album';

interface AlbumState {
  albums: Album[];
  selectedAlbum: Album | null;
  loading: boolean;
  error: string | null;
}

const initialState: AlbumState = {
  albums: [],
  selectedAlbum: null,
  loading: false,
  error: null,
};

export const fetchAlbums = createAsyncThunk(
  'albums/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Album[]>('/albums');
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const fetchAlbumById = createAsyncThunk(
  'albums/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Album>(`/albums/${id}`);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const createAlbum = createAsyncThunk(
  'albums/create',
  async (album: Omit<Album, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Album>('/albums', album);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const updateAlbum = createAsyncThunk(
  'albums/update',
  async ({ id, album }: { id: number; album: Omit<Album, 'id'> }, { rejectWithValue }) => {
    try {
      await api.put(`/albums/${id}`, album);
      return { id, ...album } as Album;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const deleteAlbum = createAsyncThunk(
  'albums/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/albums/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    clearSelectedAlbum: (state) => {
      state.selectedAlbum = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action: PayloadAction<Album[]>) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAlbumById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbumById.fulfilled, (state, action: PayloadAction<Album>) => {
        state.loading = false;
        state.selectedAlbum = action.payload;
      })
      .addCase(fetchAlbumById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action: PayloadAction<Album>) => {
        state.loading = false;
        state.albums.push(action.payload);
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action: PayloadAction<Album>) => {
        state.loading = false;
        const index = state.albums.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.albums[index] = action.payload;
        }
        state.selectedAlbum = action.payload;
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.albums = state.albums.filter(a => a.id !== action.payload);
        if (state.selectedAlbum?.id === action.payload) {
          state.selectedAlbum = null;
        }
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedAlbum, clearError } = albumSlice.actions;
export default albumSlice.reducer;