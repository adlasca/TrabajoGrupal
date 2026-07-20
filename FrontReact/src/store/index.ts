import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/userSlice';
import postReducer from '../features/posts/postSlice';
import commentReducer from '../features/comments/commentSlice';
import albumReducer from '../features/albums/albumSlice';
import photoReducer from '../features/photos/photoSlice';
import todoReducer from '../features/todos/todoSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    posts: postReducer,
    comments: commentReducer,
    albums: albumReducer,
    photos: photoReducer,
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;