import { Dispatch } from 'redux';
import axios from 'axios';
import { LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT} from '../../types/userTypes';

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
          type: typeof LOGIN_SUCCESS,
          payload: response.data.user, // Supongamos que el backend devuelve el usuario
        });
        return true;
      } else {
        throw new Error('Invalid session');
      }
    } catch (error: any) {
      dispatch({
        type: typeof LOGIN_FAILURE,
        payload: error.response?.data?.msg || error.message,
      });
      localStorage.removeItem('token'); // Elimina el token si no es válido
      localStorage.removeItem('user');
      return false;
    }
  };

  
export const logoutUser = () => (dispatch: Dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch({ 
    type: LOGOUT
  });
};
  