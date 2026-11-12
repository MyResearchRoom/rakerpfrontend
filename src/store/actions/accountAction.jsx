import apiClient from "../../api/apiClient";
import {
  FETCH_ACCOUNT_FAILURE,
  FETCH_ACCOUNT_FAILURE_FOR_EXCEL,
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_REQUEST_FOR_EXCEL,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_SUCCESS_FOR_EXCEL,
} from "../actionTypes";

export const fetchAccount = ({
  searchTerm = "",
  companyId = "",
  type = "",
  financialYear="",
  date="",
  page = 1,
  limit = 10,
}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_ACCOUNT_REQUEST });

      const response = await apiClient.get(
        "/api/account/accountDetails",
        {
          params: {
            page,
            limit,
            searchTerm,
            companyId,
            type,
            financialYear,
            date
          },
        }
      );

      // console.log("Account Filters Sent:", {
      //   page,
      //   limit,
      //   searchTerm,
      //   companyId,
      //   type,
      //   fromDate,
      //   toDate,
      // });

      if (response?.data?.success) {
        dispatch({
          type: FETCH_ACCOUNT_SUCCESS,
          payload: {
            account: response?.data?.data?.account || [],
            total: response?.data?.data?.totals || {},
            totalPages:
              response?.data?.data?.pagination?.totalPages || 1,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: FETCH_ACCOUNT_FAILURE,
        payload:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch account details",
      });
    }
  };
};

export const fetchAccountForExcel = ({ searchTerm = '', companyId = '', type = '', fromDate = '', toDate = '', page, limit }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_ACCOUNT_REQUEST_FOR_EXCEL });
      const response = await apiClient.get(`/api/account/accountDetails?page=${page}&limit=${limit}&searchTerm=${searchTerm}&companyId=${companyId}&type=${type}&fromDate=${fromDate}&toDate=${toDate}`);
      console.log(response);

      if (response?.data?.success) {

        dispatch({
          type: FETCH_ACCOUNT_SUCCESS_FOR_EXCEL,
          payload: {
            account: response?.data?.data?.account ? response?.data?.data?.account : [],
            total: response?.data?.data?.totals ? response?.data?.data?.totals : {},
            totalPages: response?.data?.data?.pagination?.totalPages,
          },
        });
      }

    } catch (err) {
      dispatch({
        type: FETCH_ACCOUNT_FAILURE_FOR_EXCEL,
        payload: err.response?.data?.message || err.message || err,
      });
    }
  };
};
