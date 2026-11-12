import {
  FETCH_BORAD_OF_DIRECTOR_SUCCESS,
  FETCH_BORAD_OF_DIRECTOR_FAILURE,
  FETCH_BORAD_OF_DIRECTOR_REQUEST,
  FETCH_BORAD_OF_DIRECTOR_FAILURE_FOR_EXCEL,
  FETCH_BORAD_OF_DIRECTOR_REQUEST_FOR_EXCEL,
  FETCH_BORAD_OF_DIRECTOR_SUCCESS_FOR_EXCEL
} from "../actionTypes";

const initialState = {
  boardOfDirectors: [],
  error: null,
  totalPages: 1,
  loading: false,
};

const stateForExcel = {
  boardOfDirectorsForExcel: [],
  errorForExcel: null,
  totalPagesForExcel: 1,
  loadingForExcel: false,
};

export const getListOfBosardOfDirectoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BORAD_OF_DIRECTOR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_BORAD_OF_DIRECTOR_SUCCESS:
      return {
         ...state,
        loading: false,
        boardOfDirectors: action.payload.boardOfDirectors,
        totalPages:action.payload.totalPages,
     };

    case FETCH_BORAD_OF_DIRECTOR_FAILURE:
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

export const getListOfBODForExcelReducer = (state = stateForExcel, action) => {
  switch (action.type) {
    case FETCH_BORAD_OF_DIRECTOR_REQUEST_FOR_EXCEL:
      return {
        ...state,
        loadingForExcel: true,
        errorForExcel: null,
      };

    case FETCH_BORAD_OF_DIRECTOR_SUCCESS_FOR_EXCEL:
      return {
         ...state,
        loadingForExcel: false,
        boardOfDirectorsForExcel: action.payload.boardOfDirectors,
        totalPagesForExcel:action.payload.totalPages,
     };

    case FETCH_BORAD_OF_DIRECTOR_FAILURE_FOR_EXCEL:
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
