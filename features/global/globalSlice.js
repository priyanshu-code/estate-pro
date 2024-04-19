import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  url: process.env.NEXT_PUBLIC_BACKEND_URL,
  authModalOpen: false,
  authPage: 'login',
  dashActive: 'Account',
  searchQuery: '',
  searchFilters: {
    minPrice: 5000000,
    maxPrice: 50000000,
    location: '',
    type: ''
  },
  searchProperties: [],
  searchMessage: '',
  searchLoading: false

};
const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    closeAuthModal: (state) => {
      state.authModalOpen = false
    },
    openAuthModal: (state) => {
      state.authModalOpen = true
    },
    setAuthPage: (state, actions) => {
      state.authPage = actions.payload
    },
    setDashActive: (state, actions) => {
      state.dashActive = actions.payload;
    },
    setSearchQuery: (state, actions) => {
      state.searchQuery = actions.payload
    },
    setSearchFilters: (state, actions) => {
      state.searchFilters = actions.payload
    },
    setSearchLoading: (state, actions) => {
      state.searchLoading = actions.payload
    },
    setSearchProperties: (state, actions) => {
      state.searchProperties = actions.payload
    },
    setSearchMessages: (state, actions) => {
      state.searchMessage = actions.payload
    }

  },
});

export const { closeAuthModal, openAuthModal, setAuthPage, setDashActive, setSearchQuery, setSearchFilters, setSearchLoading, setSearchProperties, setSearchMessages } = globalSlice.actions;

export default globalSlice.reducer;
