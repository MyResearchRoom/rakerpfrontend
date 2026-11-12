import {
  FETCH_COMPANY_SUCCESS,
  FETCH_COMPANY_FAILURE,
  FETCH_COMPANY_DATA_BY_ID_SUCCESS,
  FETCH_COMPANY_DATA_BY_ID_FAILURE,
  FETCH_COMPANY_REQUEST,
  FETCH_COMPANY_DATA_BY_ID_REQUEST,
  FETCH_COMPANY_DROPDOWN_FAILURE,
  FETCH_COMPANY_DROPDOWN_REQUEST,
  FETCH_COMPANY_DROPDOWN_SUCCESS
} from "../actionTypes";

const initialState = {
  companies: [],
  error: null,
  totalPages: 1,
  loading:false,
};

const companyByIdState ={
  company:{},
  error:null,
  loading:false,
}

const companyDropdownState = {
  companies: [],
  error: null,
  loading: false,
};

export const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMPANY_REQUEST:
      return {
         ...state,
        loading:true,
        error:null,
     };

    case FETCH_COMPANY_SUCCESS:
      return {
         ...state,
        companies: action.payload.companies,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_COMPANY_FAILURE:
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

export const companyDropdownReducer = (state = companyDropdownState, action) => {
  switch (action.type) {
    case FETCH_COMPANY_DROPDOWN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_COMPANY_DROPDOWN_SUCCESS:
      return {
        ...state,
        companies: action.payload.companies,
        loading: false,
      };

    case FETCH_COMPANY_DROPDOWN_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export const companyByIdReducer = (state = companyByIdState, action) => {
  switch (action.type) {
    case FETCH_COMPANY_DATA_BY_ID_REQUEST:
      return {
         ...state,
        loading:true,
        error:null,
     };

    case FETCH_COMPANY_DATA_BY_ID_SUCCESS:
      return {
         ...state,
        company: action.payload.company,
        loading:false,
     };

    case FETCH_COMPANY_DATA_BY_ID_FAILURE:
      return { 
        ...state,
        error: action.payload,
        loading:false,
    };

    default:
      return state;
  }
};
