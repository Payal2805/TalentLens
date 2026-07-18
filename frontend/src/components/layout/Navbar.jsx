import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-4">

      {/* Left */}

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Candidate Dashboard
        </h2>

        <p className="text-gray-500 text-sm">
          Welcome, {user?.first_name || user?.username}
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        <div className="text-right">
          <p className="font-semibold">
            {user?.username}
          </p>

          <p className="text-sm text-gray-500">
            {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;
