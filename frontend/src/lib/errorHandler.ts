export const handleError = (error: unknown): string => {
   if (typeof error === "object" && error !== null && "isAxiosError" in error) {
     const axiosError = error as any;
     const message = axiosError.response?.data?.message;
     if (typeof message === "string") return message;
     if (axiosError.message) return axiosError.message;
     return "An unknown Axios error occurred";
   }
 
   if (error instanceof Error) return error.message;
 
   if (typeof error === "string") return error;
   if (typeof error === "number") return `Error code: ${error}`;
 
   return "An unknown error occurred";
 };