import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "CANDIDATE",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/accounts/register/",
        formData
      );

      alert(response.data.message);

      navigate("/login");

    } catch (error) {

      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Network Error");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          TalentLens
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* First Name */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              First Name
            </label>

            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Last Name */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Last Name
            </label>

            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Username */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Email */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Role */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >

              <option value="CANDIDATE">
                Candidate
              </option>

              <option value="RECRUITER">
                Recruiter
              </option>

            </select>

          </div>

          {/* Password */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <p className="text-center mt-6 text-sm">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;

