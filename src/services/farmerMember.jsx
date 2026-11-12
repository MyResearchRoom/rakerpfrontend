import apiClient from "../api/apiClient";

export const addCompanyFarmerMember=async(payload,id)=>{
     try {
        const response=await apiClient.post(`/api/farmer-member/add/${id}`,payload)
        if(response?.data?.success){
            return response?.data?.message
        }
    } catch (error) {
      const err = error?.response?.data;
      if (Array.isArray(err?.errors) && err.errors.length > 0) {
        throw err.errors[0].message; 
      }

      if (err?.message) {
        throw err.message;
      }

      throw "Something went wrong";
  }
}

export const deleteFarmerMember= async(id) =>{
    try {
        const response=await apiClient.delete(`/api/farmer-member/delete/${id}`)
        if(response?.data?.success){
            return response?.data?.message
        }
    } catch (error) {
      const err = error?.response?.data;
      if (Array.isArray(err?.errors) && err.errors.length > 0) {
        throw err.errors[0].message; 
      }

      if (err?.message) {
        throw err.message;
      }

      throw "Something went wrong";
  }
}

export const getFarmerMemberById=async(id)=>{
     try {
        const response=await apiClient.get(`/api/farmer-member/${id}`)
        if(response?.data?.success){
            return response?.data?.data
        }
    } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Request failed"
      );
    }
    throw new Error("Server not reachable");
  }
}

export const addBulkFarmerMembers=async(payload,id)=>{
     try {
        const response=await apiClient.post(`/api/farmer-member/upload-farmers/${id}`,payload,{
            headers:{
                "Content-Type": "multipart/form-data", 
            }
        })
        if(response?.data?.success){
            return response?.data
        }
    } catch (error) {
      const err = error?.response?.data;
      if (Array.isArray(err?.errors) && err.errors.length > 0) {
        throw err.errors[0].message; 
      }

      if (err?.message) {
        throw err.message;
      }

      throw "Something went wrong";
  }
}

export const editFarmerMember=async(payload,id)=>{
     try {
        const response=await apiClient.patch(`/api/farmer-member/edit/${id}`,payload)
        if(response?.data?.success){
            return response?.data?.message
        }
    } catch (error) {
      const err = error?.response?.data;
      if (Array.isArray(err?.errors) && err.errors.length > 0) {
        throw err.errors[0].message; 
      }

      if (err?.message) {
        throw err.message;
      }

      throw "Something went wrong";
  }
}
