import axios from "axios";
import Cookies from 'js-cookie';
import { handleError } from "./errorHandler";

export const axiosInstance = axios.create({
   withCredentials: true,
});


axiosInstance.interceptors.request.use(
   (config) => {
      const token = Cookies.get("token");
      if(token){
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   }
);
axiosInstance.interceptors.response.use(
   (res: any) => res,
   (error: unknown) => {
      handleError(error);
      return Promise.reject(error);
   }
);