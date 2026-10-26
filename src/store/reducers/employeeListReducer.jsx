import {
  FETCH_EMPLOYEE_SUCCESS,
  FETCH_EMPLOYEE_FAILURE,
  FETCH_EMPLOYEE_REQUEST,
} from "../actionTypes";

const initialState = {
  employees: [],
  error: null,
  totalPages: 1,
  loading:false,
};

export const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading:true,
        error:null,
      };

    case FETCH_EMPLOYEE_SUCCESS:
      return {
         ...state,
        employees: action.payload.employees,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_EMPLOYEE_FAILURE:
      return { 
        ...state,
        error: action.payload,
        totalPages: 1,
        loading:false,
    };

    default:
      return state;
  }
};
