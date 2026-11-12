import apiClient from "../../api/apiClient";
import {
  FETCH_BORAD_OF_DIRECTOR_SUCCESS,
  FETCH_BORAD_OF_DIRECTOR_FAILURE,
  FETCH_BORAD_OF_DIRECTOR_REQUEST,
  FETCH_BORAD_OF_DIRECTOR_FAILURE_FOR_EXCEL,
  FETCH_BORAD_OF_DIRECTOR_REQUEST_FOR_EXCEL,
  FETCH_BORAD_OF_DIRECTOR_SUCCESS_FOR_EXCEL,
} from "../actionTypes";

export const fetchBoardOfDirectors = ({id,searchTerm='',role='',page,limit=10}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_BORAD_OF_DIRECTOR_REQUEST }); 

      const response=await apiClient.get(`/api/board-directors/director-list/${id}?page=${page}&limit=${limit}&searchTerm=${searchTerm}&role=${role}`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_BORAD_OF_DIRECTOR_SUCCESS,
        payload: {
          boardOfDirectors: response?.data?.data?.data ? response?.data?.data?.data : [],
          totalPages: response?.data?.data?.pagination?.totalPages,
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_BORAD_OF_DIRECTOR_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};

export const fetchBoardOfDirectorsForExcel = ({id,page="",limit="All"}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_BORAD_OF_DIRECTOR_REQUEST_FOR_EXCEL }); 

      const response=await apiClient.get(`/api/board-directors/director-list/${id}?page=${page}&limit=${limit}`);
      
      if(response?.data?.success){
        
        dispatch({
        type: FETCH_BORAD_OF_DIRECTOR_SUCCESS_FOR_EXCEL,
        payload: {
          boardOfDirectors: response?.data?.data?.data ? response?.data?.data?.data : [],
          totalPages: response?.data?.data?.pagination?.totalPages,
        },
      });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_BORAD_OF_DIRECTOR_FAILURE_FOR_EXCEL,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};
