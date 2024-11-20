import { Dispatch } from 'redux';
import axios from 'axios';
import { UserActionTypes, UserLogIn } from '../../types/userTypes';
import { User } from '../../types/userTypes';  // Asegúrate de importar el tipo User

// Definir la acción para registrar un usuario
export const registerUser = (formData: User) => async (dispatch: Dispatch) => {
  try {
    // Enviar la solicitud HTTP POST
    const response = await axios.post('http://localhost:5000/usuarios', formData);

    if (response.status === 201 && response.data) {
      dispatch({
        type: UserActionTypes.REGISTER_USER_SUCCESS,
        payload: response.data,
      });
      return true; // Login exitoso
    } else {
      dispatch({
        type: UserActionTypes.REGISTER_USER_FAIL,
        payload: 'Parámetros incorrectos',
      });
      return false; // Login fallido
    }
  } catch (error: any) {
    dispatch({
      type: UserActionTypes.REGISTER_USER_FAIL,
      payload: error.response?.data?.msg || error.message,
    });
    return false; // Login fallido
  }
};




export const verifyUser = (formData: UserLogIn) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/usuarios/claves?nombre_usuario=${formData.nombre_usuario}&contrasena=${formData.contrasena}`
    );

    if (response.status === 200 && response.data) {
      const {token, user} = response.data;
      localStorage.setItem('token', token);

      dispatch({
        type: UserActionTypes.LOGIN_USER_SUCCESS,
        payload: user,
      });
      return true; // Login exitoso
    } else {
      dispatch({
        type: UserActionTypes.LOGIN_USER_FAIL,
        payload: 'Usuario no encontrado o credenciales incorrectas',
      });
      return false; // Login fallido
    }
  } catch (error: any) {
    dispatch({
      type: UserActionTypes.LOGIN_USER_FAIL,
      payload: error.response?.data?.msg || error.message,
    });
    return false; // Login fallido
  }
};

