import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import type { Photo } from '../../models/Photo';

interface PhotoState {
  photos: Photo[];
  selectedPhoto: Photo | null;
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photos: [],
  selectedPhoto: null,
  loading: false,
  error: null,
};

export const fetchPhotos = createAsyncThunk(
  'photos/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Photo[]>('/photos');
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);


export const fetchPhotoById = createAsyncThunk(
  'photos/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Photo>(`/photos/${id}`);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const createPhoto = createAsyncThunk(
  'photos/create',
  async (photo: Omit<Photo, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Photo>('/photos', photo);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const updatePhoto = createAsyncThunk(
  'photos/update',
  async ({ id, photo }: { id: number; photo: Omit<Photo, 'id'> }, { rejectWithValue }) => {
    try {
      await api.put(`/photos/${id}`, photo);
      return { id, ...photo } as Photo;
    }  catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

export const deletePhoto = createAsyncThunk(
  'photos/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/photos/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
          error.response?.data?.error ?? error.message
      );

    }
  }
);

const photoSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    clearSelectedPhoto: (state) => {
      state.selectedPhoto = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchPhotoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotoById.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.loading = false;
        state.selectedPhoto = action.payload;
      })
      .addCase(fetchPhotoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.loading = false;
        state.photos.push(action.payload);
      })
      .addCase(createPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.loading = false;
        const index = state.photos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.photos[index] = action.payload;
        }
        state.selectedPhoto = action.payload;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.photos = state.photos.filter(p => p.id !== action.payload);
        if (state.selectedPhoto?.id === action.payload) {
          state.selectedPhoto = null;
        }
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedPhoto, clearError } = photoSlice.actions;
export default photoSlice.reducer;