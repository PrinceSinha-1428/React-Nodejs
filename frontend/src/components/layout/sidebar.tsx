import { X } from "lucide-react";
import { useSidebar } from "../../context/Sidebarcontext";
import Button from "../common/button";
import { useAuth } from "../../context/Authcontext";

const Sidebar = () => {
  const { isSideBarOpen, setSidebar } = useSidebar();
  const { logout } = useAuth();
  return (
    <div
      className={`fixed top-0 left-0 w-60 h-screen p-5 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 z-50 transition-transform duration-300 ease-in-out ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div
        onClick={() => setSidebar()}
        className="cursor-pointer flex items-center gap-6"
      >
        <X size={20} />
        <h1 className="ml-6">Admin Panel</h1>
      </div>
      <div className="flex flex-col justify-end h-full">
        <Button
          onClick={() => {
            logout()
            setSidebar()
          }}
          className="text-white! dark:text-black! bg-black! dark:bg-white! mb-6 cursor-pointer"
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
