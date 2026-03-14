import { useEffect } from "react";
import CreateUser from "../../components/create-user";
import { useAuth } from "../../context/Authcontext";
import Navbar from "../../components/layout/navbar";

const AdminPage = () => {
  
  const { fetchUsers, users } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar/>
      <CreateUser />
      {users?.length > 0 && (
        <table className="text-white w-full h-full mt-6 border-collapse">
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
            </tr>
          </thead>
          <tbody>
            {users?.map((user, idx) => (
              <tr key={user.user_id}>
                <td className="px-4 py-2 border-b border-white/10">
                  {idx+1}
                </td>
                <td className="px-4 py-2 border-b border-white/10">
                  {user.name}
                </td>
                <td className="px-4 py-2 border-b border-white/10">
                  {user.email}
                </td>
                <td className="px-4 py-2 border-b border-white/10">
                  {user.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
