import {
  FETCH_ACCOUNT_FAILURE,
  FETCH_ACCOUNT_FAILURE_FOR_EXCEL,
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_REQUEST_FOR_EXCEL,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_SUCCESS_FOR_EXCEL,
} from "../actionTypes";

const initialState = {
  account: [],
  total:{},
  error: null,
  totalPages: 1,
  loading:false,
};

const excelState = {
  account: [],
  total:{},
  error: null,
  totalPages: 1,
  loading:false,
};

export const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT_REQUEST:
      return {
        ...state,
        loading:true,
        error:null,
      };

    case FETCH_ACCOUNT_SUCCESS:
      return {
         ...state,
        account: action.payload.account,
        total:action.payload.total,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_ACCOUNT_FAILURE:
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

export const accountReducerForExcel = (state = excelState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT_REQUEST_FOR_EXCEL:
      return {
        ...state,
        loading:true,
        error:null,
      };

    case FETCH_ACCOUNT_SUCCESS_FOR_EXCEL:
      return {
         ...state,
        account: action.payload.account,
        total:action.payload.total,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_ACCOUNT_FAILURE_FOR_EXCEL:
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
