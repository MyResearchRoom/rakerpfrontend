import {
  FETCH_FARMER_MEMBER_SUCCESS,
  FETCH_FARMER_MEMBER_FAILURE,
  FETCH_FARMER_MEMBER_REQUEST,
  FETCH_FARMER_MEMBER_FAILURE_FOR_EXCEL,
  FETCH_FARMER_MEMBER_REQUEST_FOR_EXCEL,
  FETCH_FARMER_MEMBER_SUCCESS_FOR_EXCEL,
} from "../actionTypes";

const initialState = {
  farmerMember: [],
  error: null,
  totalPages: 1,
  loading: false,
};

const stateForExcel = {
  farmerMemberForExcel: [],
  errorForExcel: null,
  totalPagesForExcel: 1,
  loadingForExcel: false,
};

export const getListOfFarmerMemberReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FARMER_MEMBER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_FARMER_MEMBER_SUCCESS:
      return {
         ...state,
        loading: false,
        farmerMember: action.payload.farmerMember,
        totalPages:action.payload.totalPages,
     };

    case FETCH_FARMER_MEMBER_FAILURE:
      return { 
        ...state,
        loading: false,
        error: action.payload,
        totalPages: 1,
    };

    default:
      return state;
  }
};

export const getListOfFMForExcelReducer = (state = stateForExcel, action) => {
  switch (action.type) {
    case FETCH_FARMER_MEMBER_REQUEST_FOR_EXCEL:
      return {
        ...state,
        loadingForExcel: true,
        errorForExcel: null,
      };

    case FETCH_FARMER_MEMBER_SUCCESS_FOR_EXCEL:
      return {
         ...state,
        loadingForExcel: false,
        farmerMemberForExcel: action.payload.farmerMember,
        totalPagesForExcel:action.payload.totalPages,
     };

    case FETCH_FARMER_MEMBER_FAILURE_FOR_EXCEL:
      return { 
        ...state,
        loadingForExcel: false,
        errorForExcel: action.payload,
        totalPagesForExcel: 1,
    };

    default:
      return state;
  }
};
