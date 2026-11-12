import apiClient from "../../api/apiClient";
import {
  FETCH_EMPLOYEE_SUCCESS,
  FETCH_EMPLOYEE_FAILURE,
  FETCH_EMPLOYEE_REQUEST,
} from "../actionTypes";

export const fetchEmployee = ({searchTerm='',page,limit=10}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_EMPLOYEE_REQUEST }); 
      const response=await apiClient.get(`/api/user/getEmployees?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_EMPLOYEE_SUCCESS,
        payload: {
          employees: response?.data?.data?.employees ? response?.data?.data?.employees : [],
          totalPages: response?.data?.data?.pagination?.totalPages,
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_EMPLOYEE_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};
