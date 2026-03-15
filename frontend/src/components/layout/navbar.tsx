import { useTheme } from "../../context/Themecontext";
import { Monitor, Moon,  Sun, ChevronDown,  LogOut, ShieldUser, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../common/button";

const themes = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = themes.find((t) => t.value === theme)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="h-15 w-full dark:border-b-white/20 border bg-white dark:bg-zinc-950/80 backdrop-blur-md  border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-between sticky top-0 z-40">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="flex items-center justify-center py-2 px-4 ">
          <p className="flex items-center justify-center bg-white dark:bg-black dark:text-white text-black w-8 rounded-full h-8 border border-black dark:border-white">
            {user?.name[0]}
          </p>
        </div>
        <div className="flex items-start flex-col text-black dark:text-white">
          <strong>{user?.name}</strong>
          <div className="flex items-start">
            <span className="text-xs font-semibold text-gray-600 dark:text-white">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {(user?.role === "Admin" || user?.role === "Super Admin") &&
          location.pathname !== "/admin" &&
          location.pathname !== "/super-admin" && (
            <div className="flex items-center justify-center cursor-pointer">
              <Button
                onClick={() =>
                  navigate(
                    user?.role === "Super Admin" ? "/super-admin" : "/admin",
                  )
                }
                className="bg-black! w-full cursor-pointer dark:bg-white! dark:text-black! mr-2 rounded-md h-8! flex items-center gap-2"
              >
                <ShieldUser size={20} />
                <span className="flex items-center gap-2">
                  Admin <ArrowRight size={18} />{" "}
                </span>
              </Button>
            </div>
          )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg dark:bg-white dark:text-black  bg-black hover:bg-black text-white dark:hover:bg-white transition-colors cursor-pointer"
          >
            <current.icon size={14} />
            <span className="text-sm">{current.label}</span>
            <ChevronDown
              size={12}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-36 rounded-lg shadow-lg dark:bg-zinc-800 bg-white border dark:border-zinc-700 border-zinc-200 overflow-hidden z-50">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer
                    ${theme === value ? "dark:bg-zinc-700 bg-zinc-100 font-medium" : "dark:hover:bg-zinc-700 hover:bg-zinc-50"}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center justify-center cursor-pointer">
            <Button
              onClick={logout}
              className="bg-black! w-full cursor-pointer dark:bg-white! dark:text-black! mr-2 rounded-md h-8! flex items-center gap-2"
            >
              <LogOut size={16} />
              <p>Logout</p>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
