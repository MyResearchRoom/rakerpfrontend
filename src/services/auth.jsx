import axios from "axios"
import apiClient from "../api/apiClient";

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL

export const userLogin = async (formdata) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formdata, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
    if (response?.data?.success) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const changePassword = async (formdata) => {
  try {
    const response = await apiClient.patch(`${API_BASE_URL}/api/auth/changePassword`, formdata, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
    if (response?.data?.success) {
      return response?.data?.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const acceptTerms = async () => {
  try {
    const response = await apiClient.patch(
      `${API_BASE_URL}/api/auth/accept-terms`,
      { agreed: true },
      { headers: { "Content-Type": "application/json" } }
    );
    if (response?.data?.success && response?.data?.data?.verified === true) {
      return response.data.data;
    }
    throw new Error(response?.data?.message || "Failed to save terms acceptance");
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message || "Something went wrong");
  }
};
