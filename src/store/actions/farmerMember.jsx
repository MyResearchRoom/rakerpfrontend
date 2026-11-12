import apiClient from "../../api/apiClient";
import {
  FETCH_FARMER_MEMBER_SUCCESS,
  FETCH_FARMER_MEMBER_FAILURE,
  FETCH_FARMER_MEMBER_REQUEST,
  FETCH_FARMER_MEMBER_FAILURE_FOR_EXCEL,
  FETCH_FARMER_MEMBER_REQUEST_FOR_EXCEL,
  FETCH_FARMER_MEMBER_SUCCESS_FOR_EXCEL,
} from "../actionTypes";

export const fetchFarmerMemebrs = ({id,searchTerm='',page,limit=10}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_FARMER_MEMBER_REQUEST }); 

      const response=await apiClient.get(`/api/farmer-member/farmer-list/${id}?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_FARMER_MEMBER_SUCCESS,
        payload: {
          farmerMember: response?.data?.data?.data ? response?.data?.data?.data : [],
          totalPages: response?.data?.data?.pagination?.totalPages,
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_FARMER_MEMBER_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};

export const fetchFMForExcel = ({id,page="",limit="All"}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_FARMER_MEMBER_REQUEST_FOR_EXCEL }); 

      const response=await apiClient.get(`/api/farmer-member/farmer-list/${id}?page=${page}&limit=${limit}`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_FARMER_MEMBER_SUCCESS_FOR_EXCEL,
        payload: {
          farmerMember: response?.data?.data?.data ? response?.data?.data?.data : [],
          totalPages: response?.data?.data?.pagination?.totalPages,
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_FARMER_MEMBER_FAILURE_FOR_EXCEL,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};
