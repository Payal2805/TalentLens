import { useNavigate } from "react-router-dom";

import {
  Bell,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

function AdminNavbar() {

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  // =========================================================
  // Display Name
  // =========================================================

  const displayName =
    user?.first_name ||
    user?.username ||
    "Admin";

  // =========================================================
  // Logout
  // =========================================================

  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  return (

    <div className="flex items-center justify-between bg-white shadow-md px-8 py-4 border-b">

      {/* =====================================================
          Left
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h2>

        <p className="text-gray-500 mt-1">

          Welcome,

          <span className="font-semibold text-slate-700 ml-1">

            {displayName}

          </span>

        </p>

      </div>

      {/* =====================================================
          Right
      ===================================================== */}

      <div className="flex items-center gap-4">

        {/* Admin Role */}

        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">

          <ShieldCheck
            size={18}
            className="text-slate-700"
          />

          <span className="font-semibold text-slate-700">
            Admin
          </span>

        </div>

        {/* Notifications */}

        <button
          type="button"
          className="flex items-center justify-center border border-gray-300 hover:bg-gray-100 w-11 h-11 rounded-lg transition"
        >

          <Bell size={20} />

        </button>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >

          <LogOut size={18} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </div>
  );
}

export default AdminNavbar;
