import React, { useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { handleError } from "../../lib/errorHandler";
import toast from "react-hot-toast";
import Input from "../../components/common/input";
import Button from "../../components/common/button";
import { Navigate, useNavigate } from "react-router-dom";

interface FormTypes {
  email: string;
  password: string;
}

const SignIn = () => {

  const { signIn, loading, user, errors, clearErrors } = useAuth();

  if (user) return <Navigate to="/" />;
  const navigate = useNavigate();
  const [ispasswordVisible, setIspasswordVisible] = useState<boolean>(false);
  const [form, setForm] = useState<FormTypes>({
    email: "",
    password: "",
  });

  const handleInputChange = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (Object.keys(errors).length > 0) clearErrors();
  };

  const handleSignIn = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await signIn(form.email, form.password);
      setForm({
        email: "",
        password: "",
      });
    } catch (error: unknown) {
      toast.error(handleError(error));
    } finally {
      setIspasswordVisible(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col items-center justify-center"
      >
        <div className="flex items-start flex-col justify-center min-w-100  mt-4 gap-4 p-4">
          <div className="flex flex-col gap-1 w-full">
            <Input
              label="Email"
              id="Email"
              placeholder="Enter email..."
              value={form.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Input
              label="Password"
              id="Password"
              placeholder="Enter password..."
              type="password"
              value={form.password}
              ispasswordVisible={ispasswordVisible}
              setIspasswordVisible={setIspasswordVisible}
              onChangeText={(value) => handleInputChange("password", value)}
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>
        </div>
        <div className="flex flex-col items-center justify-end mt-6 gap-4">
          <Button
            type="submit"
            className="cursor-pointer px-4"
            variant="primary"
          >
            {loading ? "Signing..." : "Sign in"}
          </Button>
          <p onClick={() => navigate("/sign-up")} className="text-xs cursor-pointer hover:text-blue-500 text-blue-700">Don't have an account.</p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
