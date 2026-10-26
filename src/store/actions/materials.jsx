import apiClient from "../../api/apiClient";
import {
    FETCH_MATERIALS_SUCCESS,
    FETCH_MATERIALS_FAILURE,
    FETCH_MATERIALS_REQUEST
} from "../actionTypes";

export const fetchMaterials = ({searchTerm='',companyId='',unit='',gstRate='',page,limit=10}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_MATERIALS_REQUEST }); 
      const params = {
        page,
        limit,
      };

      if (searchTerm) params.searchTerm = searchTerm;
      if (unit) params.unit = unit;
      if (gstRate) params.gstRate = gstRate;
      if (companyId) params.companyId = companyId;

      const response = await apiClient.get(
        "/api/material/materialList",
        { params }
      );
      
      if(response?.data?.success){
        
        dispatch({
          type: FETCH_MATERIALS_SUCCESS,
          payload: {
            materials: response?.data?.data?.materials ? response?.data?.data?.materials : [],
            totalPages: response?.data?.data?.pagination?.totalPages,
          },
        });
      }
      
    } catch (err) {
      dispatch({
        type: FETCH_MATERIALS_FAILURE,
        payload: err.response?.data?.message || err.message || err ,
      });
    }
  };
};