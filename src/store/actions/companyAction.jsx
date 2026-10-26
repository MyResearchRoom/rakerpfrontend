import apiClient from "../../api/apiClient";
import {
  FETCH_COMPANY_SUCCESS,
  FETCH_COMPANY_FAILURE,
  FETCH_COMPANY_DATA_BY_ID_SUCCESS,
  FETCH_COMPANY_DATA_BY_ID_FAILURE,
  FETCH_COMPANY_REQUEST,
  FETCH_COMPANY_DATA_BY_ID_REQUEST,
  FETCH_COMPANY_DROPDOWN_FAILURE,
  FETCH_COMPANY_DROPDOWN_REQUEST,
  FETCH_COMPANY_DROPDOWN_SUCCESS
} from "../actionTypes";

export const fetchCompanies = ({searchTerm='',status,companyType='',employeeId,page,limit=10}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_COMPANY_REQUEST }); 
      
      const response=await apiClient.get(`/api/company/company-list?page=${page}&limit=${limit}&searchTerm=${searchTerm}&companyType=${companyType}&status=${status}&employeeId=${employeeId}`);
      
      if(response?.data?.success){
        
        dispatch({
          type: FETCH_COMPANY_SUCCESS,
          payload: {
            companies: response?.data?.data?.companies ? response?.data?.data?.companies : [],
            totalPages: response?.data?.data?.pagination?.totalPages,
          },
        });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_COMPANY_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};

export const fetchCompanyDropdownList = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_COMPANY_DROPDOWN_REQUEST });

      const response = await apiClient.get("/api/company/company-dropdown-list");

      if (response?.data?.success) {
        dispatch({
          type: FETCH_COMPANY_DROPDOWN_SUCCESS,
          payload: {
            companies: response?.data?.data?.companies ? response?.data?.data?.companies : [],
          },
        });
      }
    } catch (err) {
      dispatch({
        type: FETCH_COMPANY_DROPDOWN_FAILURE,
        payload: err.response?.data?.message || err.message || err,
      });
    }
  };
};

export const fetchCompanyDataById = (id) =>{
  return async (dispatch) => {
    try{
      dispatch({ type: FETCH_COMPANY_DATA_BY_ID_REQUEST }); 
      const response=await apiClient.get(`/api/company/${id}`)
      if(response?.data?.success){
        dispatch({
          type: FETCH_COMPANY_DATA_BY_ID_SUCCESS,
          payload: {
            company: response?.data?.data ? response?.data?.data: {},
          },
        });
      }
    }catch(err){
      dispatch({
          type: FETCH_COMPANY_DATA_BY_ID_FAILURE,
          payload: err.response?.data?.message || err.message || err ,
        });
    }
  };
};
