import apiClient from "../api/apiClient";

export const addCompanyBoardOfDirector = async (payload, id) => {
  try {
    const response = await apiClient.post(
      `/api/board-directors/add/${id}`,
      payload
    );

    if (response?.data?.success) {
      return response?.data?.message;
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

export const deleteBoardOfDirector= async(id) =>{
    try {
        const response=await apiClient.delete(`/api/board-directors/delete/${id}`)
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

export const getBoardOfDirectorById=async(id)=>{
     try {
        const response=await apiClient.get(`/api/board-directors/${id}`)
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

export const addBuldBoardOfDirector=async(payload,id)=>{
     try {
        const response=await apiClient.post(`/api/board-directors/upload-BOD/${id}`,payload,{
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

export const editCompanyBoardOfDirector=async(payload,id)=>{
     try {
        const response=await apiClient.patch(`/api/board-directors/edit/${id}`,payload)
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
