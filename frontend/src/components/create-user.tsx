import { useEffect, useState } from "react";
import Input from "./common/input";
import Select from "./common/select";
import Button from "./common/button";
import toast from "react-hot-toast";
import { handleError } from "../lib/errorHandler";
import { useAuth } from "../context/Authcontext";

type Role = "Super Admin" | "Admin" | "User";
const roles: Role[] = ["Super Admin", "Admin", "User"];

export interface FormDataTypes {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const CreateUser = () => {
  const { createUser, loading, errors, clearErrors } = useAuth();
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
      await createUser(formData);
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

  useEffect(() => {
    console.log(errors);
  }, [errors]);

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
              onChangeText={(value) => handleInputChange("password", value)}
            />
            <p
              className={`text-sm text-red-400 min-h-5 ${errors.password ? "visible" : "invisible"}`}
            >
              {errors.password ?? "\u00A0"}
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Select
              label="Role"
              value={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              options={roles}
              placeholder="Select a role"
            />
            <p
              className={`text-sm text-red-400 min-h-5 ${errors.role ? "visible" : "invisible"}`}
            >
              {errors.role ?? "\u00A0"}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          className="cursor-pointer bg-black! dark:bg-white! dark:text-black! text-white! min-w-28"
          variant="primary"
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;
