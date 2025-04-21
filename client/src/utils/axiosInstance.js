import axios from "axios";
import { navigate } from "./useNavigateHook";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const refreshAccessToken = async () => {
  try { 
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refreshAccessToken`,
      {},
      {
        withCredentials: true,
      }
    );
    // console.log(response);
    return response.data.data.accessToken;
  } catch (error) {
    if(error?.status === 401){
      navigate("/Login");
    }
    console.error("Failed to refresh token, logging out...", error);
    return null;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        return axiosInstance(originalRequest); // Retry failed request
      } else {
        navigate("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
