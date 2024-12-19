// src/types/authTypes.ts
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { id: string; username: string } | null;
  error: string | null;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: { token: string; user: { id: string; username: string } };
}

export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: { token: string; user: { id: string; username: string } };
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

export interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
  payload: string;
}

export type AuthActionTypes = 
  | LoginSuccessAction
  | RegisterSuccessAction
  | LogoutAction
  | LoginFailureAction
  | RegisterFailureAction;