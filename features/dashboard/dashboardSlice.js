import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  dashActive: 'Account',
  subService: 'Manage',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashActive: (state, actions) => {
      state.dashActive = actions.payload;
    },
    setDashSubSerivce: (state, actions) => {
      state.subService = actions.payload;
    },
  },
});

export const { setDashActive, setDashSubSerivce } = dashboardSlice.actions;

export default dashboardSlice.reducer;
