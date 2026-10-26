import {
    FETCH_INVOICES_REQUEST,
    FETCH_INVOICES_SUCCESS,
    FETCH_INVOICES_FAILURE
} from "../actionTypes";

const initialState = {
  invoices: [],
  error: null,
  totalPages: 1,
  loading:false,
};


export const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INVOICES_REQUEST:
      return {
         ...state,
        loading:true,
        error:null,
     };

    case FETCH_INVOICES_SUCCESS:
      return {
         ...state,
        invoices: action.payload.invoices,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_INVOICES_FAILURE:
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
