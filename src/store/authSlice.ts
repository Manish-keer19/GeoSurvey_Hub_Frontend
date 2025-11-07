import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  code: string;
  name: string;
  role: string;
  selectedReport?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedReport: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  selectedReport: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User; selectedReport?: string }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.selectedReport = action.payload.selectedReport || null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      if (action.payload.selectedReport) {
        localStorage.setItem('selectedReport', action.payload.selectedReport);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.selectedReport = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedReport');
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const selectedReport = localStorage.getItem('selectedReport');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
        state.selectedReport = selectedReport;
      }
    },
    setTempSelectedReport: (state, action: PayloadAction<string>) => {
      state.selectedReport = action.payload;
    },
  },
});

export const { loginSuccess, logout, loadFromStorage, setTempSelectedReport } = authSlice.actions;
export default authSlice.reducer;