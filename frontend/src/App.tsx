import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin/admin-page";
import SignIn from "./pages/auth/sign-in";
import ProtectedRoutes, { AdminRoute } from "./pages";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="dark:bg-black bg-white min-h-screen text-zinc-900 dark:text-white">
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home/>} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/super-admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
