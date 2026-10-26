import {
  FETCH_COMPLIANCE_FAILURE,
  FETCH_COMPLIANCE_REQUEST,
  FETCH_COMPLIANCE_SUCCESS,
} from "../actionTypes";
import { getComplianceList } from "../../services/compliance";

export const fetchCompliance = ({
  searchTerm = "",
  companyId = "",
  financialYear = "",
  page,
  limit = 10,
} = {}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_COMPLIANCE_REQUEST });

      const response = await getComplianceList({
        searchTerm,
        companyId,
        financialYear,
        page,
        limit,
      });
      console.log("compliance response",response);

      dispatch({
        type: FETCH_COMPLIANCE_SUCCESS,
        payload: {
          compliance: response?.compliance || [],
          statusSummary:response?.statusSummary|| {},
          totalPages: response?.pagination?.totalPages || 1,
        },
      });
    } catch (err) {
      console.log(err);
      
      dispatch({
        type: FETCH_COMPLIANCE_FAILURE,
        payload: err?.message || err,
      });
    }
  };
};
