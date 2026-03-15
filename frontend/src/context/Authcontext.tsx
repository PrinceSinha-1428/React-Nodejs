import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { handleError } from "../lib/errorHandler";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { FormDataTypes } from "../components/create-user";
import { useNavigate } from "react-router-dom";
import { setAuthHandlers } from "../lib/tokenManager";

interface AuthContextType {
  user: User | null;
  users: User[];
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  refreshNewToken: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  sessionLogout: () => Promise<ReturnType<typeof setTimeout> | undefined>;
  signIn: (email: string, password: string) => Promise<void>;
  createUser: (formData: FormDataTypes) => Promise<void>;
  signUp: (formData: FormDataTypes) => Promise<void>;
  errors: Record<string, string>;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  setUser: () => {},
  loading: false,
  logout: async () => {},
  refreshNewToken: async () => {},
  fetchUsers: async () => {},
  sessionLogout: async () => undefined,
  signIn: async () => {},
  signUp: async () => {},
  createUser: async () => {},
  errors: {},
  clearErrors: () => {},
});

export const AuthcontextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = Cookies.get("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedOutRef = useRef<boolean>(!user);

  const clearErrors = () => setErrors({});

  const signIn = async (email: string, password: string) => {
    const fieldErrors: Record<string, string> = {};
    if (!email.trim()) fieldErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fieldErrors.email = "Invalid email";
    if (!password) fieldErrors.password = "Password is required";
    else if (password.length < 6)
      fieldErrors.password = "Password must be at least 6 characters";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post<ApiResponse<User>>(
        "/api/auth/sign-in",
        { email, password },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setUser(res.data.user);
        Cookies.set("user", JSON.stringify(res.data.user));
        isLoggedOutRef.current = false;
      } else {
        toast.error(res.data.message);
      }
    } catch (error: unknown) {
      toast.error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (formData: FormDataTypes) => {
    const fieldErrors: Record<string, string> = {};
    if (!formData.name.trim()) fieldErrors.name = "Name is required";
    if (!formData.email.trim()) fieldErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      fieldErrors.email = "Invalid email";
    if (!formData.password) fieldErrors.password = "Password is required";
    else if (formData.password.length < 6)
      fieldErrors.password = "Password must be at least 6 characters";
    if (!["Super Admin", "Admin", "User"].includes(formData.role))
      fieldErrors.role = "Invalid role";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post<ApiResponse<User>>(
        "/api/users",
        formData,
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) => [...prev, res.data.user]);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: unknown) {
      toast.error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (formData: FormDataTypes) => {
    const fieldErrors: Record<string, string> = {};
    if (!formData.name.trim()) fieldErrors.name = "Name is required";
    if (!formData.email.trim()) fieldErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      fieldErrors.email = "Invalid email";
    if (!formData.password) fieldErrors.password = "Password is required";
    else if (formData.password.length < 6)
      fieldErrors.password = "Password must be at least 6 characters";
    if (!["Super Admin", "Admin", "User"].includes(formData.role))
      fieldErrors.role = "Invalid role";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    try {
      const res = await axiosInstance.post<ApiResponse<string>>("/api/auth/sign-up", formData);
      if(res.data.success){
        toast.success(res.data.message);
      }
      } catch (error: unknown) {
        toast.error(handleError(error));
      }
  }

  const logout = async () => {
    try {
      setLoading(true);
      const res =
        await axiosInstance.get<
          ApiResponse<{ isLoggedOut: boolean; route: string }>
        >("/api/auth/logout");
      if (res.data.success && res.data.data.isLoggedOut) {
        clearAllCookies();
        toast.success(res.data.message);
        navigate(res.data.data.route);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: unknown) {
      toast.error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const clearAllCookies = () => {
    isLoggedOutRef.current = true;
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    setUser(null);
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("sessionExpiresAt");
  };

  const sessionLogout = async () => {
    try {
      const expiresAt = Cookies.get("sessionExpiresAt");
      if (!expiresAt) {
        if (user) {
          alert("Session expired");
          clearAllCookies();
          await logout();
        }
        return;
      }
      const expiryTime = Number(expiresAt);
      const remaningTime = expiryTime - Date.now();
      if (remaningTime <= 0) {
        alert("Session expired");
        clearAllCookies();
        await logout();
        return;
      }
      const timerId = setTimeout(async () => {
        alert("Session expired");
        clearAllCookies();
        await logout();
      }, remaningTime);
      return timerId;
    } catch (error: unknown) {
      toast.error(handleError(error));
    }
  };

  const refreshNewToken = async () => {
    if (isLoggedOutRef.current) return;
    try {
      console.log("token resfreshing")
      const res = await axiosInstance.get<ApiResponse>("/api/auth/refresh");
      if(res.data.success && !isLoggedOutRef.current){
        scheduleRefreshAccessToken();
      }
    } catch (error: unknown) {
      clearAllCookies();
      await logout();
    }
  }

  const scheduleRefreshAccessToken = async () => {
    if (isLoggedOutRef.current) return;
    try {
      const token = Cookies.get("accessToken");
      if(!token){
        return;
      }
      const decode = jwtDecode<{exp: number}>(token);
      const expiryTime = decode.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if(!expiryTime){
        return;
      }

      const remaningTime = expiryTime - currentTime;

      if(remaningTime <=0){
        await refreshNewToken();
        return;
      }
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      refreshTimerRef.current = setTimeout(() => {
        refreshNewToken();
      }, remaningTime * 1000);
    } catch (error: unknown) {
      toast.error(handleError(error));
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get<ApiResponse<User[]>>("/api/users");
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: unknown) {
      toast.error(handleError(error));
    }
  };

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const autoLogout = async () => {
      timerId = await sessionLogout();
    };
    autoLogout();
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      scheduleRefreshAccessToken();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshNewToken();
    }
  }, []);

  useEffect(() => {
    setAuthHandlers(refreshNewToken, logout);
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    logout,
    signIn,
    createUser,
    sessionLogout,
    fetchUsers,
    users,
    errors,
    signUp,
    clearErrors,
    refreshNewToken
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
