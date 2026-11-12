import {
    FETCH_RECEIPTS_REQUEST,
    FETCH_RECEIPTS_SUCCESS,
    FETCH_RECEIPTS_FAILURE
} from "../actionTypes";

const initialState = {
  receipts: [],
  error: null,
  totalPages: 1,
  loading:false,
};


export const receiptsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RECEIPTS_REQUEST:
      return {
         ...state,
        loading:true,
        error:null,
     };

    case FETCH_RECEIPTS_SUCCESS:
      return {
         ...state,
        receipts: action.payload.receipts,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_RECEIPTS_FAILURE:
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
