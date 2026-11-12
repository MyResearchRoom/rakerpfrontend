import apiClient from "../../api/apiClient";
import {
    FETCH_EXPENSE_REQUEST,
    FETCH_EXPENSE_SUCCESS,
    FETCH_EXPENSE_FAILURE
} from "../actionTypes";

export const fetchExpenses = ({
  searchTerm = "",
  categoryId = null,
  companyId = null,
  status = "",
  paymentMethod = "",
  financialYear="",
  page = 1,
  limit = 10,
}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_EXPENSE_REQUEST });

      const response = await apiClient.get(
        "/api/expense/expenseList",
        {
          params: {
            page,
            limit,
            searchTerm,
            categoryId,
            companyId,
            status,
            paymentMethod,
            financialYear,
          },
        }
      );

      if (response?.data?.success) {
        dispatch({
          type: FETCH_EXPENSE_SUCCESS,
          payload: {
            expenses: response?.data?.data?.expenses || [],
            totalPages:
              response?.data?.data?.pagination?.totalPages || 1,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: FETCH_EXPENSE_FAILURE,
        payload:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch expenses",
      });
    }
  };
};