import apiClient from "../api/apiClient";

export const getCompaniesList=async({searchTerm='',status, employeeId ,page,limit=10})=>{
    try {
        const response=await apiClient.get(`/api/company/company-list?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}&employeeId=${employeeId}`);

        if(response?.data?.success){
            return response?.data?.data
        }
    } catch (error) {
        const err=error.response.data.message || "Something went wrong"
        throw err
    }
}

export const addNewCompany=async(payload)=>{
     try {
        const response=await apiClient.post(`/api/company/add`,payload,{
            headers:{
                // "Content-Type":"application/json"
                "Content-Type": "multipart/form-data", 
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

export const getCompanyById = async (id) => {
  try {
    const response = await apiClient.get(`/api/company/${id}`);

    console.log("Company API response:", response.data);

    if (response?.data?.success) {
      return response?.data?.data;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Request failed"
      );
    }
    throw new Error("Server not reachable");
  }
};

export const editCompany=async(payload,id)=>{
     try {
        const response=await apiClient.post(`/api/company/edit/${id}`,payload,{
            headers:{
                "Content-Type": "multipart/form-data", 
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

export const completeCompanyProfile=async(payload,id)=>{
     try {
        const response=await apiClient.post(`/api/company-details/add/${id}`,payload,{
            headers:{
                "Content-Type": "multipart/form-data", 
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

export const getCompanyProfileByCompanyId=async(id)=>{
     try {
        const response=await apiClient.get(`/api/company-details/${id}`)
        if(response?.data?.success){
            return response?.data?.data
        }else {
          return null; 
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

export const editCompanyProfile=async(payload,id)=>{
     try {
        const response=await apiClient.patch(`/api/company-details/edit/${id}`,payload,{
            headers:{
                "Content-Type": "multipart/form-data", 
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

export const chnageStatusOfCompany=async(id)=>{
     try {
        const response=await apiClient.patch(`/api/company/changeStatus/${id}`)
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