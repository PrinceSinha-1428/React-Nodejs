import { type FC, useState } from "react";

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const CustomSelect: FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full min-w-0">
      <label className="block text-sm font-medium dark:text-gray-200 mb-1">
        {label}
      </label>
      <div
        className="cursor-pointer rounded-lg dark:bg-black/40 dark:text-gray-100 text-gray-400 px-4 py-2 flex justify-between items-center border border-gray-600 hover:border-blue-500 transition-colors overflow-hidden"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate min-w-0 flex-1 w-0 dark:text-white text-black">
          {value || placeholder || "Select..."}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transform transition-transform ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-lg dark:bg-black border border-gray-600 shadow-lg">
          {options.map((opt) => (
            <li
              key={opt}
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
