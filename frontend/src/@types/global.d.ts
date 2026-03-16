interface User {
   user_id: string;
   name: string;
   email: string;
   role: string;
}

interface ApiResponse<T = any> {
   success: boolean;
   message: string;
   data: T;
   accessToken: string
   user: T;
}

 interface FormDataTypes {
  name: string;
  email: string;
  password: string;
  role: Role;
}

type Data =  Omit<FormDataTypes, "password">
