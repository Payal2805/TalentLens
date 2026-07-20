import { useNavigate } from "react-router-dom";
import { User, Bell, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md px-8 py-4 border-b">

      {/* Left */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          Candidate Dashboard
        </h2>

        <p className="text-gray-500 mt-1">
          Welcome,
          <span className="font-semibold text-blue-600 ml-1">
            {user?.first_name || user?.username}
          </span>
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        

        {/* Profile */}

        <button
          onClick={() => navigate("/candidate/profile")}
          className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
        >
          <User size={18} />
          <span>My Profile</span>
        </button>

        {/* Notifications */}

        <button
          onClick={() => navigate("/candidate/notifications")}
          className="flex items-center justify-center border border-gray-300 hover:bg-gray-100 w-11 h-11 rounded-lg transition"
        >
          <Bell size={20} />
        </button>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  );
}

export default Navbar;
