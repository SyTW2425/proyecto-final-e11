// src/types/userTypes.ts
export enum UserActionTypes {
  REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS',
  REGISTER_USER_FAIL = 'REGISTER_USER_FAIL',
  LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS',
  LOGIN_USER_FAIL = 'LOGIN_USER_FAIL',
}


export interface User {
  id_: string;
  nombre_: string;
  contacto_: number;
  claves_: [string, string];
  rol_: string;
}

export interface UserLogIn {
  nombre_usuario: string;
  contrasena: string;
}
