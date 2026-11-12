import {
  FETCH_COMPLIANCE_FAILURE,
  FETCH_COMPLIANCE_REQUEST,
  FETCH_COMPLIANCE_SUCCESS,
} from "../actionTypes";

const initialState = {
  compliance: [],
  statusSummary: {},
  error: null,
  totalPages: 1,
  loading: false,
};

export const complianceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMPLIANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_COMPLIANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        compliance: action.payload.compliance,
        statusSummary: action.payload.statusSummary,
        totalPages: action.payload.totalPages,
        
      };

    case FETCH_COMPLIANCE_FAILURE:
      return {
        ...state,
        error: action.payload,
        totalPages: 1,
        loading: false,
      };

    default:
      return state;
  }
};
