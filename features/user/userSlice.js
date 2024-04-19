import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = {
  token: '',
  user: {},
  favorites: [],
  userProperties: [],
  userErrors: [],
  userSuccess: [],
  userLoading: false,
  favoritesLoading: false,
  userPropertiesLoading: false,
};

// Fetch user
export const getUser = createAsyncThunk('user/getUser', async (data, thunkAPI) => {
  try {
    const token = data || thunkAPI.getState().User.token;
    const { url } = thunkAPI.getState().Global;
    const response = await axios.get(url + 'user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response?.data?.msg || "Get user Error");
  }
});



// Get Favorites
export const getUserFavorites = createAsyncThunk('user/getUserFavorites', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().User.token;
    const { url } = thunkAPI.getState().Global;
    const response = await axios.get(url + 'user/getUserFavorites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    console.log(error.response.data);
    console.log(error);
    return thunkAPI.rejectWithValue(error.response?.data?.msg || "Get favorites Error");
  }
});

// Get use created properties
export const getUserProperties = createAsyncThunk('user/getUserProperties', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().User.token;
    const { url } = thunkAPI.getState().Global;
    const response = await axios.get(url + 'user/getUserProperties', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    console.log(error.response.data);
    console.log(error);
    return thunkAPI.rejectWithValue(error.response?.data?.msg || "Get favorites Error");
  }
});

// Update user
export const updateUser = createAsyncThunk('user/updateUser', async (user, thunkAPI) => {
  try {
    const { token } = thunkAPI.getState().User;
    const { url } = thunkAPI.getState().Global;
    const response = await axios.patch(url + 'user', user, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.msg);
  }
});




const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      return { ...initialState };
    },
    setToken: (state, actions) => {
      state.token = actions.payload;
    },
    setUser: (state, actions) => {
      state.user = actions.payload;
    },
    removeUserProperty: (state, actions) => {
      state.user = actions.payload;
    },
    shiftUserError: (state) => {
      state.userErrors = [state.userErrors].slice(1);
    },
    shiftUserSuccess: (state) => {
      state.userSuccess = [state.userSuccess].slice(1);
    },
  },
  extraReducers: (builder) => {
    // Get user
    builder.addCase(getUser.pending, (state, actions) => {
      state.userLoading = true;
      state.userErrors = [];
    });
    builder.addCase(getUser.fulfilled, (state, actions) => {
      const { user } = actions.payload;
      state.user = user;
      state.userLoading = false;
    });
    builder.addCase(getUser.rejected, (state, actions) => {
      state.userErrors = [...state.userErrors, actions.payload];
      state.userLoading = false;
    });

    // Get getUserFavorites
    builder.addCase(getUserFavorites.pending, (state, actions) => {
      state.favoritesLoading = true;
      state.userErrors = [];
    });
    builder.addCase(getUserFavorites.fulfilled, (state, actions) => {
      const { properties } = actions.payload;
      state.favorites = properties;
      state.favoritesLoading = false;
    });
    builder.addCase(getUserFavorites.rejected, (state, actions) => {
      state.userErrors = [...state.userErrors, actions.payload];
      state.favoritesLoading = false;
    });

    // Get getUserProperties
    builder.addCase(getUserProperties.pending, (state, actions) => {
      state.userPropertiesLoading = true;
      state.userErrors = [];
    });
    builder.addCase(getUserProperties.fulfilled, (state, actions) => {
      const { properties } = actions.payload;
      state.userProperties = properties;
      state.userPropertiesLoading = false;
    });
    builder.addCase(getUserProperties.rejected, (state, actions) => {
      state.userErrors = [...state.userErrors, actions.payload];
      state.userPropertiesLoading = false;
    });

    // Update user
    builder.addCase(updateUser.pending, (state, actions) => {
      state.userErrors = [];
      state.userLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, actions) => {
      const { user } = actions.payload;
      state.user = user;
      state.userSuccess = [...state.userSuccess, `User updated successfully.`];
      state.userLoading = false;
    });
    builder.addCase(updateUser.rejected, (state, actions) => {
      state.userErrors = [...state.userErrors, actions.payload];
      state.userLoading = false;
    });

  },
});

export const { logoutUser, setToken, setUser, shiftUserError, shiftUserSuccess } = userSlice.actions;
export default userSlice.reducer;
