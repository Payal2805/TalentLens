import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/accounts/login/",
        formData
      );

      // Save user & tokens using AuthContext
      login(
        response.data.user,
        response.data.access,
        response.data.refresh
      );

      alert(response.data.message);

      const role = response.data.user.role;

      if (role === "CANDIDATE") {
        navigate("/candidate/dashboard");
      } else if (role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {

      console.error(error);

      if (error.response) {

        alert(
          error.response.data.detail ||
          error.response.data.message ||
          JSON.stringify(error.response.data)
        );

      } else {

        alert("Network Error");

      }

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          TalentLens
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Forgot Password */}

          <div className="flex justify-end">

            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}

        <p className="text-center text-sm mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
