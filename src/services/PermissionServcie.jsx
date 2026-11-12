
import apiClient from "../api/apiClient";

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL


 export const getPermissionList=async()=>{
    try {
      const response =await apiClient.get(`${API_BASE_URL}/api/permission/list`);
      if(response?.data?.success){
        return response?.data?.data;
      }
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to get permission list");
    }
  }

  export const getPermissionListByEmployee=async(id)=>{
    try {
        const response = await apiClient.get(`${API_BASE_URL}/api/permission/${id}`);
      if(response?.data?.success){
        return response?.data?.data;
      }
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to get permission list");
    }
  }
  
  export const grantPermission=async({userId,permissionIds})=>{
    try {
        const response = await apiClient.post(`${API_BASE_URL}/api/permission/add-userPermission`,
            {userId,permissionIds}
        );
        if(response?.data?.success){
            return response?.data?.message;
        }
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to grant permission");
    }
  }
