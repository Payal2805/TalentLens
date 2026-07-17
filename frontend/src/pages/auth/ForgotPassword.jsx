import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/accounts/forgot-password/",
        {
          email: email,
        }
      );

      alert(response.data.message);

      setEmail("");

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          TalentLens
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Forgot your password?
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <p className="text-center mt-6 text-sm">

          Remember your password?{" "}

          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;

