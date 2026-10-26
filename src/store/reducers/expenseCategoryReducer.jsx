import {
    FETCH_EXPENSE_CATEGORY_FAILURE,
    FETCH_EXPENSE_CATEGORY_SUCCESS,
    FETCH_EXPENSE_CATEGORY_REQUEST
} from "../actionTypes";

const initialState = {
  categories: [],
  error: null,
  totalPages: 1,
  loading:false,
};


export const expenseCategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPENSE_CATEGORY_REQUEST:
      return {
         ...state,
        loading:true,
        error:null,
     };

    case FETCH_EXPENSE_CATEGORY_SUCCESS:
      return {
         ...state,
        categories: action.payload.categories,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_EXPENSE_CATEGORY_FAILURE:
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
