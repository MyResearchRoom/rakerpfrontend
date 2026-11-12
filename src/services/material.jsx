import apiClient from "../api/apiClient";

export const getMaterialById=async(id)=>{
     try {
        const response=await apiClient.get(`/api/material/${id}`)
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

export const editMaterial=async(payload,id)=>{
     try {
        const response=await apiClient.patch(`/api/material/edit/${id}`,payload,{
            headers:{
                "Content-Type":"application/json"
            }
        })
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

export const addNewMaterial=async(payload)=>{
     try {
        const response=await apiClient.post(`/api/material/add`,payload,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(response?.data?.success){
            return response?.data?.message
        }
    } catch (error) {
      console.log("erroe",error);
      
      // if (error.response && error.response.data) {
      //   const errData = error.response.data;

      //   if (Array.isArray(errData.errors) && errData.errors.length > 0) {
      //     throw errData.errors[0].message;
      //   }

      //   if (errData.message) {
      //     throw errData.message; 
      //   }
      // }

      // if (error?.message) {
      //   throw error.message;
      // }

      // throw "Something went wrong";

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

export const deleteMaterial= async(id) =>{
    try {
        const response=await apiClient.delete(`/api/material/delete/${id}`)
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
