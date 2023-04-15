import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

import authReducer from './features/auth/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
const persistConfig = {
  key: 'root',
  storage,
};
// // const persistedReducer = persistReducer(persistConfig);
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  })
);

export const store = configureStore({
  // remouve persist Reducer
  reducer:persistedReducer
  //  {
  //   [apiSlice.reducerPath]: apiSlice.reducer,
  //   auth: authReducer,
  // }
  ,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
export const persistor = persistStore(store);

// export const persistor=persistStore(store)
