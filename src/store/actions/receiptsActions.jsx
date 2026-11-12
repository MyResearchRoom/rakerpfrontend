import apiClient from "../../api/apiClient";
import {
  FETCH_RECEIPTS_REQUEST,
  FETCH_RECEIPTS_SUCCESS,
  FETCH_RECEIPTS_FAILURE
} from "../actionTypes";

export const fetchReceipts = ({
  searchTerm = "",
  paymentMethod = "",
  companyId = "",
  financialYear = "",
  date = "",
  page,
  limit = 10,
}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_RECEIPTS_REQUEST });

      const response = await apiClient.get(
        "/api/receipts/receiptsList",
        {
          params: {
            page,
            limit,
            searchTerm,
            paymentMethod,
            companyId,
            financialYear, 
            date,
          }
        }
      );

      if (response?.data?.success) {
        dispatch({
          type: FETCH_RECEIPTS_SUCCESS,
          payload: {
            receipts: response?.data?.data?.receipts || [],
            totalPages:
              response?.data?.data?.pagination?.totalPages,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: FETCH_RECEIPTS_FAILURE,
        payload:
          err.response?.data?.message ||
          err.message ||
          err,
      });
    }
  };
};