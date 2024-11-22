// src/reducers/authReducer.ts
import { AuthState, AuthActionTypes, LOGIN_SUCCESS, LOGOUT, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE } from '../../types/userTypes';

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  error: null,
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        error: null,
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;