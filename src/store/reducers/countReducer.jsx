import {
  FETCH_COUNT_FAILURE,
  FETCH_COUNT_REQUEST,
  FETCH_COUNT_SUCCESS,
  FETCH_ADMIN_DASH_COUNT_FAILURE,
  FETCH_ADMIN_DASH_COUNT_REQUEST,
  FETCH_ADMIN_DASH_COUNT_SUCCESS,
  FETCH_COMPANY_DASH_COUNT_REQUEST,
  FETCH_COMPANY_DASH_COUNT_FAILURE,
  FETCH_COMPANY_DASH_COUNT_SUCCESS,
} from "../actionTypes";

const initialState = {
  counts: {},
  error: null,
  loading:false,
};

const initialAdminDashboardState = {
  counts: {},
  error: null,
  loading:false,
};

const initialCompanyDashboardState = {
  counts: {},
  error: null,
  loading:false,
};

export const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COUNT_REQUEST:
      return {
        ...state,
        loading:true,
        error:null,
      };

    case FETCH_COUNT_SUCCESS:
      return {
         ...state,
        counts: action.payload.counts,
        loading:false,
     };

    case FETCH_COUNT_FAILURE:
      return { 
        ...state,
        error: action.payload,
        loading:false,
    };

    default:
      return state;
  }
};

export const countAdminDashboardReducer = (state = initialAdminDashboardState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_DASH_COUNT_REQUEST:
      return {
        ...state,
        loading:true,
        error:null,
      };

    case FETCH_ADMIN_DASH_COUNT_SUCCESS:
      return {
         ...state,
        counts: action.payload.counts,
        loading:false,
     };

    case FETCH_ADMIN_DASH_COUNT_FAILURE:
      return { 
        ...state,
        error: action.payload,
        loading:false,
    };

    default:
      return state;
  }
};

export const countCompanyDashboardReducer = (state = initialCompanyDashboardState, action) => {
  switch (action.type) {
    case FETCH_COMPANY_DASH_COUNT_REQUEST:
      return {
        ...state,
        loading:true,
        error:null,
      };

    case FETCH_COMPANY_DASH_COUNT_SUCCESS:
      return {
         ...state,
        counts: action.payload.counts,
        loading:false,
     };

    case FETCH_COMPANY_DASH_COUNT_FAILURE:
      return { 
        ...state,
        error: action.payload,
        loading:false,
    };

    default:
      return state;
  }
};
