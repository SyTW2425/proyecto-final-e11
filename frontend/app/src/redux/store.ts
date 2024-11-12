// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import exampleReducer from './exampleReducer';

const rootReducer = combineReducers({
  example: exampleReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
