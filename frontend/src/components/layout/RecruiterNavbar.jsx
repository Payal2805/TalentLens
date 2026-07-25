import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

function RecruiterNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/recruiters/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });


      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-20 bg-white shadow flex items-center justify-between px-8">

      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Recruiter Dashboard
        </h2>

        <p className="text-gray-500 mt-1">
          Welcome,
          <span className="font-semibold text-indigo-600 ml-1">
            {profile?.first_name || profile?.username}
          </span>
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <div className="text-right">
          <h3 className="font-semibold text-gray-800">
            {profile?.company_name}
          </h3>

          <p className="text-sm text-gray-500">
            {profile?.designation}
          </p>
        </div>

        <button
          onClick={() => navigate("/recruiter/profile")}
          className="flex items-center gap-3 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
        >
          {profile?.company_logo ? (
            <img
              src={`http://127.0.0.1:8000${profile.company_logo}`}
              alt="Company Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User size={18} />
          )}

          <span>My Profile</span>
        </button>

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

export default RecruiterNavbar;
