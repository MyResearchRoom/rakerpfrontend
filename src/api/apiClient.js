import axios from "axios";
import {setToken} from "../store/slices/authSlice"
import {store} from "../store/store";
axios.defaults.withCredentials = true;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config)=>{
    const token=store.getState().auth.token;
    
    if(token) config.headers.Authorization=`Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use((res)=>res,async(err)=>{
    const originalRequest=err.config;
    
    if(err?.response?.status === 401 && !originalRequest._retry){
        
        originalRequest._retry = true;
        // Call refresh endpoint
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
          
        if(refreshResponse?.data?.success){
          const newData=refreshResponse?.data?.data;
          const newAccessToken = newData?.accessToken;

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          store?.dispatch(setToken(newAccessToken))

          return apiClient(originalRequest);
        }
    }
    throw err
})

export default apiClient
