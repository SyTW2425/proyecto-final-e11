import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/userReducer';

const store = configureStore({
  reducer: authReducer,  // Asegúrate de que tu reducer esté configurado correctamente
});

// Exporta el tipo de `dispatch` para usarlo en los componentes
export type AppDispatch = typeof store.dispatch;

export default store;
