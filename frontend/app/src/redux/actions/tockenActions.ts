import { Dispatch } from 'redux';
import axios from 'axios';
import { UserActionTypes } from '../../types/userTypes';

export const validateToken = () => async (dispatch: Dispatch) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await axios.get('http://localhost:5000/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200 && response.data) {
        dispatch({
          type: UserActionTypes.LOGIN_USER_SUCCESS,
          payload: response.data.user, // Supongamos que el backend devuelve el usuario
        });
        return true;
      } else {
        throw new Error('Invalid session');
      }
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.LOGIN_USER_FAIL,
        payload: error.response?.data?.msg || error.message,
      });
      localStorage.removeItem('token'); // Elimina el token si no es válido
      return false;
    }
  };

  export const logout = () => (dispatch: Dispatch) => {
    localStorage.removeItem('token'); // Elimina el JWT del almacenamiento
    dispatch({ type: UserActionTypes.LOGIN_USER_FAIL });
  };