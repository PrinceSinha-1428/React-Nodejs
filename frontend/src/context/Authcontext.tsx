import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { handleError } from "../lib/errorHandler";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { FormDataTypes } from "../components/create-user";

interface AuthContextType {
  user: User | null;
  users: User[];
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  sessionLogout: () => Promise<ReturnType<typeof setTimeout> | undefined>;
  signIn: (email: string, password: string) => Promise<void>;
  createUser: (formData: FormDataTypes) => Promise<void>;
  errors: Record<string, string>;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  setUser: () => {},
  loading: false,
  logout: async () => {},
  fetchUsers: async () => {},
  sessionLogout: async () => undefined,
  signIn: async () => {},
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

  const logout = async () => {
    try {
      setLoading(true);
      const res =
        await axiosInstance.get<
          ApiResponse<{ isLoggedOut: boolean; route: string }>
        >("/api/auth/logout");
      if (res.data.success && res.data.data.isLoggedOut) {
        setUser(null);
        Cookies.remove("user");
        toast.success(res.data.message);
        window.location.href = res.data.data.route;
      } else {
        toast.error(res.data.message);
      }
    } catch (error: unknown) {
      toast.error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const sessionLogout = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        if (user) {
          setUser(null);
          Cookies.remove("user");
        }
        return;
      }
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp;

      if (!expiryTime) {
        await logout();
        return;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      const remaningTime = expiryTime - currentTime;
      if (remaningTime <= 0) {
        await logout();
        return;
      }
      const timerId = setTimeout(() => {
        logout();
      }, remaningTime * 1000);
      return timerId;
    } catch (error: unknown) {
      toast.error(handleError(error));
    }
  };

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
    clearErrors,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
