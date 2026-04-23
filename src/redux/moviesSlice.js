import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = "http://localhost:3001";

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const res = await fetch(`${BASE_URL}/movies`);
  return res.json();
});

export const fetchGenres = createAsyncThunk('movies/fetchGenres', async () => {
  const res = await fetch(`${BASE_URL}/genres`);
  return res.json();
});

export const deleteMovie = createAsyncThunk('movies/deleteMovie', async (id) => {
  await fetch(`${BASE_URL}/movies/${id}`, { method: 'DELETE' });
  return id;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    list: [],
    genres: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.list = state.list.filter(movie => movie.id !== action.payload);
      });
  }
});

export default moviesSlice.reducer;