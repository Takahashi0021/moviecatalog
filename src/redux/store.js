import { configureStore, createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: [],
  reducers: { setMovies: (state, action) => action.payload }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: JSON.parse(localStorage.getItem('user')) || null },
  reducers: { setUser: (state, action) => { state.user = action.payload; } }
});

export const { setMovies } = moviesSlice.actions;
export const { setUser } = authSlice.actions;

export const store = configureStore({
  reducer: { movies: moviesSlice.reducer, auth: authSlice.reducer }
});