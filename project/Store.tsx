import { createSlice, configureStore } from '@reduxjs/toolkit';

const themeSlice = createSlice({
	name: 'theme',
	initialState: {
		theme: 'light' as 'light' | 'dark'
	},
	reducers: {
		setTheme: (state, action) => {
			state.theme = action.payload;
		}
	}
});

export const { setTheme } = themeSlice.actions;

export const store = configureStore({
	reducer: themeSlice.reducer
});
