import { type FC, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "danger";
}

const Button: FC<ButtonProps> = ({ children, variant = "primary", className, ...props }) => {
  const baseClasses =  "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white ",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white ",
    danger: "bg-red-500 hover:bg-red-600 text-white ",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`} {...props}>
      {children}
    </button>
  );
};

export default Button;