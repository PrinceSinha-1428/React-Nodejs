import { Eye, EyeClosed } from "lucide-react";
import { type FC, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  ispasswordVisible?: boolean;
  onChangeText: (value: string) => void;
  setIspasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Input: FC<InputProps> = ({
  label,
  id,
  value,
  onChangeText,
  placeholder,
  ispasswordVisible,
  setIspasswordVisible,
  type = "text",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full ">
      <label htmlFor={id} className="text-sm font-medium dark:text-gray-200">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={type === "password" && ispasswordVisible ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          {...props}
          className="
          w-full
          rounded-lg
          border border-gray-600
          dark:bg-black/40
          px-2 py-1
          dark:text-gray-100
          bg-white
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          transition-colors
          outline-none
        "
        />
        {type === "password" && setIspasswordVisible && (
          <button
            type="button"
            onClick={() => setIspasswordVisible(!ispasswordVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            {ispasswordVisible ? <EyeClosed size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
