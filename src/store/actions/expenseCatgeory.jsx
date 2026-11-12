import apiClient from "../../api/apiClient";
import {
    FETCH_EXPENSE_CATEGORY_FAILURE,
    FETCH_EXPENSE_CATEGORY_SUCCESS,
    FETCH_EXPENSE_CATEGORY_REQUEST
} from "../actionTypes";

export const fetchExpenseCategory = ({searchTerm='',page,limit=10,companyId=''}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_EXPENSE_CATEGORY_REQUEST }); 
      const response=await apiClient.get(`/api/expenseCategory/categoriesList?page=${page}&limit=${limit}&searchTerm=${searchTerm}&companyId=${companyId}`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_EXPENSE_CATEGORY_SUCCESS,
        payload: {
          categories: response?.data?.data?.categories ? response?.data?.data?.categories : [],
          totalPages: response?.data?.data?.pagination?.totalPages,
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_EXPENSE_CATEGORY_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};
