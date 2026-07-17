import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../services/api";

function ResetPassword() {
  const navigate = useNavigate();

  const { uid, token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/accounts/reset-password/",
        {
          uid: uid,
          token: token,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }
      );

      alert(response.data.message);

      navigate("/login");

    } catch (error) {

      console.error(error);

      if (error.response) {
        alert(
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
          Reset Your Password
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* New Password */}

          <div>

            <label className="block text-sm font-medium mb-2">
              New Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                placeholder="Enter new password"
                required
                className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Confirm Password */}

          <div>

            <label className="block text-sm font-medium mb-2">
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirm_password: e.target.value,
                  })
                }
                placeholder="Confirm new password"
                required
                className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;

