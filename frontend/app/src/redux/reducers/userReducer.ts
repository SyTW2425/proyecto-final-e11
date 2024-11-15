import { UserActionTypes } from '../../types/userTypes';

const initialState = {
  userData: null,
  error: null,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UserActionTypes.REGISTER_USER_SUCCESS:
      return {
        ...state,
        userData: action.payload,
      };
    case UserActionTypes.REGISTER_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};