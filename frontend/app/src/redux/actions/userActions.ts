import { Dispatch } from 'redux';
import axios from 'axios';
import { UserActionTypes } from '../../types/userTypes';
import { User } from '../../types/userTypes';  // Asegúrate de importar el tipo User

// Definir la acción para registrar un usuario
export const registerUser = (formData: User) => async (dispatch: Dispatch) => {
  try {
    // Enviar la solicitud HTTP POST
    const response = await axios.post('http://localhost:5000/usuarios', formData);

    // Despachar la acción de éxito con los datos recibidos
    dispatch({
      type: UserActionTypes.REGISTER_USER_SUCCESS,
      payload: response.data,  // payload es el usuario creado
    });
  } catch (error: any) {
    // Si ocurre un error, despachamos la acción de fallo
    dispatch({
      type: UserActionTypes.REGISTER_USER_FAIL,
      payload: error.message,
    });
  }
};
