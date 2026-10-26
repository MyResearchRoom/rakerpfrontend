import apiClient from "../../api/apiClient";
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

export const fetchCount = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_COUNT_REQUEST }); 
      const response=await apiClient.get(`/api/count/countData`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_COUNT_SUCCESS,
        payload: {
          counts: response?.data?.data?.counts ? response?.data?.data?.counts : {},
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_COUNT_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};

export const fetchAdminDashboardCount = (year="") => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_ADMIN_DASH_COUNT_REQUEST }); 
      const response=await apiClient.get(`/api/count/countAdminDashboardData?year=${year}`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_ADMIN_DASH_COUNT_SUCCESS,
        payload: {
          counts: response?.data?.data?.counts ? response?.data?.data?.counts : {},
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_ADMIN_DASH_COUNT_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};

export const fetchCompanyDashboardCount = (year="") => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_COMPANY_DASH_COUNT_REQUEST }); 
      const response=await apiClient.get(`/api/count/companyDashboardCount?year=${year}`);
      
      if(response?.data?.success){
        console.log("count",response?.data?.data?.counts);
        
        
        dispatch({
        type: FETCH_COMPANY_DASH_COUNT_SUCCESS,
        payload: {
          counts: response?.data?.data?.counts ? response?.data?.data?.counts : {},
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_COMPANY_DASH_COUNT_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};