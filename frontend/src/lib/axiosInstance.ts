import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';
import { handleError } from "./errorHandler";
import { refreshTokenHandler, logoutHandler } from "./tokenManager";

export const axiosInstance = axios.create({
   withCredentials: true,
});


axiosInstance.interceptors.request.use(
   (config) => {
      const token = Cookies.get("accessToken");
      if(token){
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   }
);
axiosInstance.interceptors.response.use(
   (res: any) => res,
   async (error: AxiosError) => {
      const originalRequest: any = error.config;
  
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/api/auth/refresh")
      ) {
        originalRequest._retry = true;
  
        try {
          await refreshTokenHandler();
          return axiosInstance(originalRequest);
        } catch (err) {
          await logoutHandler();
        }
      }
  
      handleError(error);
      return Promise.reject(error);
    }
);