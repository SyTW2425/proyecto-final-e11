import { Dispatch } from 'redux';
import axios from 'axios';
import { UserLogIn } from '../../components/signin';  // Asegúrate de importar el tipo UserLogIn
import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_FAILURE, LOGIN_SUCCESS} from '../../types/userTypes';
import { User } from '../../components/signup';  // Asegúrate de importar el tipo User

// Definir la acción para registrar un usuario
export const registerUser = (formData: User) => async (dispatch: Dispatch) => {
  try {
    // Enviar la solicitud HTTP POST
    const response = await axios.post('http://localhost:5000/usuarios', formData);

    if (response.status === 201 && response.data) {
      dispatch({
        type: typeof REGISTER_SUCCESS,
        payload: response.data,
      });
      return true; // Login exitoso
    } else {
      dispatch({
        type: typeof REGISTER_FAILURE,
        payload: 'Parámetros incorrectos',
      });
      return false; // Login fallido
    }
  } catch (error: any) {
    dispatch({
      type: typeof REGISTER_FAILURE,
      payload: error.response?.data?.msg || error.message,
    });
    return false; // Login fallido
  }
};


export const verifyUser = (formData: UserLogIn) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.post('http://localhost:5000/login', { nombre_usuario: formData.nombre_usuario, contrasena: formData.contrasena});
    // buscar el usuario en la base de datos y sacar el rol

    const nuevo = await axios.get(`http://localhost:5000/usuarios/claves?nombre_usuario=${formData.nombre_usuario}&contrasena=${formData.contrasena}`);

    if (response.status === 200 && response.data) {
      const {token, user} = response.data;
      const {rol_} = nuevo.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('rol', JSON.stringify(rol_));

      dispatch({
        type: typeof LOGIN_SUCCESS,
        payload: { token, user, rol_ },
      });

      return true; // Login exitoso
    } else {
      dispatch({
        type: typeof LOGIN_FAILURE,
        payload: 'Usuario no encontrado o credenciales incorrectas',
      });

      return false; // Login fallido
    }
  } catch (error: any) {

    dispatch({
      type: typeof LOGIN_FAILURE,
      payload: error.response?.data?.msg || error.message,
    });

    return false; // Login fallido
  }
};


