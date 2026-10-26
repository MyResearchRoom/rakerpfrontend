import apiClient from "../../api/apiClient";
import {
  FETCH_INVOICES_REQUEST,
  FETCH_INVOICES_SUCCESS,
  FETCH_INVOICES_FAILURE
} from "../actionTypes";

export const fetchInvoices = ({
  searchTerm = "",
  date = "",
  companyId = "",
  status = "",
  financialYear="",
  page = 1,
  limit = 10,
}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_INVOICES_REQUEST });

      const response = await apiClient.get(
        "/api/invoice/invoiceList",
        {
          params: {
            page,
            limit,
            searchTerm,
            date,
            companyId,
            status,
            financialYear
          },
        }
      );

      // console.log("Invoice Filters Sent:", {
      //   page,
      //   limit,
      //   searchTerm,
      //   date,
      //   companyId,
      //   status,
      //   startDate,
      //   endDate,
      // });

      if (response?.data?.success) {
        dispatch({
          type: FETCH_INVOICES_SUCCESS,
          payload: {
            invoices: response?.data?.data?.invoices || [],
            totalPages:
              response?.data?.data?.pagination?.totalPages || 1,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: FETCH_INVOICES_FAILURE,
        payload:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch invoices",
      });
    }
  };
};