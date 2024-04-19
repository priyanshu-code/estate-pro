'use client';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '@/features/user/userSlice';
import dashboardReducer from '../../features/dashboard/dashboardSlice';
import globalReducer from '../../features/global/globalSlice';

const userConfig = {
  key: 'user',
  version: 1,
  storage,
};

//persisted Reducer
const persistedUser = persistReducer(userConfig, userReducer);

const reducers = combineReducers({
  User: persistedUser,
  Dashboard: dashboardReducer,
  Global: globalReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
