import { useEffect, useState } from "react";
import CreateUser from "../../components/create-user";
import { useAuth } from "../../context/Authcontext";
import Navbar from "../../components/layout/navbar";
import { Check, Pencil, Trash, X } from "lucide-react";
import Input from "../../components/common/input";
import Select from "../../components/common/select";

const roles = ["Super Admin", "Admin", "User"];

const AdminPage = () => {
  const { fetchUsers, users, deleteUser, updateUser, user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (u: User) => {
    setEditingId(u.user_id);
    setEditData({ name: u.name, email: u.email, role: u.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", email: "", role: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateUser(editingId, editData);
    setEditingId(null);
    setEditData({ name: "", email: "", role: "" });
  };

  return (
    <div>
      <Navbar />
      <CreateUser />
      {users?.length > 0 && (
        <table className="dark:text-white text-black  w-full h-full mt-6 border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 border-b border-white/20">
                Sr no.
              </th>
              <th className="text-left px-4 py-2 border-b border-white/20">
                Name
              </th>
              <th className="text-left px-4 py-2 border-b border-white/20">
                Email
              </th>
              <th className="text-left px-4 py-2 border-b border-white/20">
                Role
              </th>
              {user?.role === "Super Admin" && (
                <th className="text-left px-4 py-2 border-b border-white/20">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users?.map(({ user_id, name, email, role }, idx) => (
              <tr key={user_id}>
                <td className="px-4 py-2 border-b dark:border-white/10">
                  {idx + 1}
                </td>
                <td className="px-4 py-2 border-b dark:border-white/10">
                  {editingId === user_id ? (
                    <Input
                      label=""
                      id={`name-${user_id}`}
                      value={editData.name}
                      onChangeText={(value) =>
                        setEditData((prev) => ({ ...prev, name: value }))
                      }
                      placeholder="Enter name..."
                      className="px-2! py-1! text-sm! rounded! bg-transparent! border-white/30!"
                    />
                  ) : (
                    name
                  )}
                </td>
                <td className="px-4 py-2 border-b dark:border-white/10">
                  {editingId === user_id ? (
                    <Input
                      label=""
                      id={`email-${user_id}`}
                      value={editData.email}
                      onChangeText={(value) =>
                        setEditData((prev) => ({ ...prev, email: value }))
                      }
                      placeholder="Enter email..."
                      className="px-2! py-1! text-sm! rounded! bg-transparent! border-white/30!"
                    />
                  ) : (
                    email
                  )}
                </td>
                <td className="px-4 py-2 border-b dark:border-white/10">
                  {editingId === user_id ? (
                    <Select
                      label=""
                      value={editData.role}
                      onChange={(value) =>
                        setEditData((prev) => ({ ...prev, role: value }))
                      }
                      options={roles}
                      placeholder="Select a role"
                    />
                  ) : (
                    role
                  )}
                </td>
                {user?.role === "Super Admin" && (
                  <td className="px-4 py-2 border-b dark:border-white/10 cursor-pointer">
                    {editingId === user_id ? (
                      <span className="flex items-center justify-center gap-10 w-fit">
                        <Check
                          onClick={saveEdit}
                          size={20}
                          className="dark:text-green-700 text-green-500 hover:text-green-600  dark:hover:text-green-500"
                        />
                        <X
                          onClick={cancelEdit}
                          size={20}
                          className="dark:text-red-700 text-red-500 hover:text-red-600  dark:hover:text-red-500"
                        />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-10 w-fit">
                        <Pencil
                          onClick={() =>
                            startEdit({ user_id, name, email, role })
                          }
                          size={15}
                          className="dark:text-green-700 text-green-500 hover:text-green-600  dark:hover:text-green-500"
                        />
                        <Trash
                          onClick={() => deleteUser(user_id)}
                          size={15}
                          className="dark:text-red-700 text-red-500 hover:text-red-600  dark:hover:text-red-500"
                        />
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
