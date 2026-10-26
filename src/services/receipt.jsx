import apiClient from "../api/apiClient";

export const generateNewReceipt=async(payload)=>{
     try {
        const response=await apiClient.post(`/api/receipts/add`,payload,{
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

export const getReceiptById=async(id)=>{
     try {
        const response=await apiClient.get(`/api/receipts/${id}`)
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

export const deleteReceipt= async(id) =>{
    try {
        const response=await apiClient.delete(`/api/receipts/delete/${id}`)
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