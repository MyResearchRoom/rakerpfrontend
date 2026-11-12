import {
    FETCH_EXPENSE_REQUEST,
    FETCH_EXPENSE_SUCCESS,
    FETCH_EXPENSE_FAILURE
} from "../actionTypes";

const initialState = {
  expenses: [],
  error: null,
  totalPages: 1,
  loading:false,
};


export const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPENSE_REQUEST:
      return {
         ...state,
        loading:true,
        error:null,
     };

    case FETCH_EXPENSE_SUCCESS:
      return {
         ...state,
        expenses: action.payload.expenses,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_EXPENSE_FAILURE:
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
