import { useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { handleError } from "../../lib/errorHandler";
import toast from "react-hot-toast";
import Input from "../../components/common/input";
import Button from "../../components/common/button";
import { Navigate } from "react-router-dom";


type Role = "Super Admin" | "Admin" | "User";

export interface FormDataTypes {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const SignUp = () => {
  const { signUp, loading, errors, clearErrors, user } = useAuth();
  const [ispasswordVisible, setIspasswordVisible] = useState<boolean>(false);   
  const [formData, setFormData] = useState<FormDataTypes>({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleInputChange = (
    field: "name" | "email" | "password" | "role",
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (Object.keys(errors).length > 0) clearErrors();
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await signUp(formData);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "User"
      })
    } catch (error: unknown) {
      toast.error(handleError(error));
    }
  };

  if(user) return <Navigate to={"/"} />


  return (
    <div className="p-10 border dark:border-white/10 border-black ">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center py-4 px-2 gap-4 bg-white dark:bg-zinc-900"
      >
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex flex-col gap-1 w-full">
            <Input
              label="Name"
              id="Name"
              placeholder="Enter name..."
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
            <p
              className={`text-sm text-red-400 min-h-5 ${errors.name ? "visible" : "invisible"}`}
            >
              {errors.name ?? "\u00A0"}
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Input
              label="Email"
              id="Email"
              placeholder="Enter email..."
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
            <p
              className={`text-sm text-red-400 min-h-5 ${errors.email ? "visible" : "invisible"}`}
            >
              {errors.email ?? "\u00A0"}
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Input
              label="Password"
              id="Password"
              placeholder="Enter password..."
              value={formData.password}
              ispasswordVisible={ispasswordVisible}
              setIspasswordVisible={setIspasswordVisible}
              onChangeText={(value) => handleInputChange("password", value)}
            />
            <p
              className={`text-sm text-red-400 min-h-5 ${errors.password ? "visible" : "invisible"}`}
            >
              {errors.password ?? "\u00A0"}
            </p>
          </div>

        </div>
        <Button
          type="submit"
          className="cursor-pointer bg-blue-500! text-white! min-w-28"
          variant="primary"
        >
          {loading ? "Signing..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
