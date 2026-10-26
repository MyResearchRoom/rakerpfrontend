import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const resolveComplianceError = (error) => {
  const err = error?.response?.data;

  if (Array.isArray(err?.errors) && err.errors.length > 0) {
    return err.errors[0].message;
  }

  if (err?.message) {
    return err.message;
  }

  if (err?.error) {
    return err.error;
  }

  if (typeof err === "string") {
    return err;
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong";
};

const buildComplianceQuery = ({
  searchTerm = "",
  companyId = "",
  financialYear = "",
  page = 1,
  limit = 10,
} = {}) => {
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("limit", limit);
  params.set("searchTerm", searchTerm || "");
  params.set("companyId", companyId);
  if (financialYear) params.set("financialYear", financialYear);

  return params.toString();
};

export const getFinancialYearOptions = async () => {
  const response = await axios.get("/api/compliance/financial-years");
  return response.data.data.financialYears;
};

export const getComplianceList = async (params) => {
  try {
    // const response = await apiClient.get(
    //   `/api/compliance/complianceList?${buildComplianceQuery(params)}`
    // );
    // toast.success("one");
    const response = await apiClient.get(
      `/api/compliance/complianceDocList?${buildComplianceQuery(params)}`
    );
    // toast.success("two");


    if (response?.data?.success) {
      return response?.data?.data;
    }
  } catch (error) {
    console.log(error);

    throw resolveComplianceError(error);
  }
};

export const addCompliance = async (payload) => {
  try {
    const response = await apiClient.post(`/api/compliance/add`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response?.data?.success) {
      return response?.data;   // ✅ { message, data: { documents, otherDocuments } }
    }
  } catch (error) {
    throw resolveComplianceError(error);
  }
};

export const getComplianceById = async (id, financialYear = "") => {
  try {
    const query = financialYear ? `?financialYear=${encodeURIComponent(financialYear)}` : "";
    const response = await apiClient.get(`/api/compliance/${id}${query}`);

    if (response?.data?.success) {
      return response?.data?.data;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Request failed");
    }

    throw new Error("Server not reachable");
  }
};

export const editCompliance = async (payload) => {
  try {
    const response = await apiClient.patch(`/api/compliance/edit`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response?.data?.success) {
      return response?.data;   // ✅ same shape
    }
  } catch (error) {
    throw resolveComplianceError(error);
  }
};

export const deleteCompliance = async (id) => {
  try {
    const response = await apiClient.delete(`/api/compliance/delete/${id}`);

    if (response?.data?.success) {
      return response?.data?.message;
    }
  } catch (error) {
    throw resolveComplianceError(error);
  }
};
