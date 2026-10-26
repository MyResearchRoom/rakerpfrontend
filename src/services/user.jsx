import apiClient from "../api/apiClient";

export const addEmplyoee = async (formdata) => {
  try {
    const response = await apiClient.post(
      `/api/user/emp-register`,
      formdata,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data?.success) {
      return response.data;
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
};

export const getAllEmployees=async({searchTerm='',page,limit=10})=>{
    try {
        const response=await apiClient.get(`/api/user/getEmployees?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);
        if(response?.data?.success){
            return response?.data?.data
        }
    } catch (error) {
        const err=error.response.data.message || "Something went wrong"
        throw err
    }
}

export const deleteEmployee= async(id) =>{
    try {
        const response=await apiClient.delete(`/api/user/delete/${id}`)
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

export const getEmployeeDataById=async(id)=>{
     try {
        const response=await apiClient.get(`/api/user/${id}`)
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

export const editEmployee=async(payload,id)=>{
     try {
        const response=await apiClient.patch(`/api/user/edit/${id}`,payload,{
            headers:{
                "Content-Type": "application/json",
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