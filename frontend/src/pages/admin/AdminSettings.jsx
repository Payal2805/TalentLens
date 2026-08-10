import { useEffect, useState } from "react";

import {
  Save,
  UserRound,
  Mail,
  LockKeyhole,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const EMPTY_PROFILE = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  role: "",
  is_active: false,
  is_staff: false,
  is_superuser: false,
  last_login: null,
  date_joined: null,
};

const EMPTY_PASSWORD = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

function AdminSettings() {
  const { updateUser } = useAuth();

  // =========================================================
  // STATE
  // =========================================================

  const [profile, setProfile] = useState(EMPTY_PROFILE);

  const [passwordData, setPasswordData] =
    useState(EMPTY_PASSWORD);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================================
  // HELPERS
  // =========================================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const getErrorMessage = (
    requestError,
    fallbackMessage
  ) => {
    return (
      requestError?.response?.data?.detail ||
      requestError?.response?.data?.message ||
      fallbackMessage
    );
  };

  const mapProfileResponse = (data) => ({
    username: data?.username || "",
    email: data?.email || "",
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",

    role: data?.role || "ADMIN",

    is_active: data?.is_active ?? false,
    is_staff: data?.is_staff ?? false,
    is_superuser: data?.is_superuser ?? false,

    last_login: data?.last_login || null,
    date_joined: data?.date_joined || null,
  });

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/profile/");

      const profileData =
        mapProfileResponse(response.data);

      setProfile(profileData);
    } catch (requestError) {
      console.error(
        "Admin Profile Error:",
        requestError
      );

      setError(
        getErrorMessage(
          requestError,
          "Unable to load admin profile."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================================
  // PROFILE INPUT
  // =========================================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearMessages();
  };

  // =========================================================
  // PASSWORD INPUT
  // =========================================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearMessages();
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    clearMessages();

    const username = profile.username.trim();
    const email = profile.email.trim();
    const firstName = profile.first_name.trim();
    const lastName = profile.last_name.trim();

    // -------------------------------------------------------
    // Validation
    // -------------------------------------------------------

    if (!username) {
      setError("Username cannot be empty.");
      return;
    }

    if (!email) {
      setError("Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        "/admin/profile/",
        {
          username,
          email,
          first_name: firstName,
          last_name: lastName,
        }
      );

      const updatedProfile =
        mapProfileResponse(response.data);

      setProfile(updatedProfile);

      // -----------------------------------------------------
      // Update AuthContext
      // -----------------------------------------------------

      const storedUser =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      const updatedUser = {
        ...storedUser,

        username: updatedProfile.username,
        email: updatedProfile.email,
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,

        role:
          updatedProfile.role ||
          storedUser.role ||
          "ADMIN",

        is_active:
          updatedProfile.is_active ??
          storedUser.is_active ??
          true,

        is_staff:
          updatedProfile.is_staff ??
          storedUser.is_staff ??
          false,

        is_superuser:
          updatedProfile.is_superuser ??
          storedUser.is_superuser ??
          false,

        last_login:
          updatedProfile.last_login ??
          storedUser.last_login ??
          null,

        date_joined:
          updatedProfile.date_joined ??
          storedUser.date_joined ??
          null,
      };

      updateUser(updatedUser);

      setMessage(
        response.data?.message ||
          "Profile updated successfully."
      );
    } catch (requestError) {
      console.error(
        "Update Profile Error:",
        requestError
      );

      setError(
        getErrorMessage(
          requestError,
          "Unable to update profile."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    clearMessages();

    const currentPassword =
      passwordData.current_password.trim();

    const newPassword =
      passwordData.new_password;

    const confirmPassword =
      passwordData.confirm_password;

    // -------------------------------------------------------
    // Required fields
    // -------------------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );
      return;
    }

    // -------------------------------------------------------
    // Minimum password length
    // -------------------------------------------------------

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    // -------------------------------------------------------
    // Password confirmation
    // -------------------------------------------------------

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    // -------------------------------------------------------
    // API
    // -------------------------------------------------------

    try {
      setChangingPassword(true);

      const response = await api.patch(
        "/admin/change-password/",
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );

      setPasswordData({
        ...EMPTY_PASSWORD,
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setMessage(
        response.data?.message ||
          "Password changed successfully."
      );
    } catch (requestError) {
      console.error(
        "Change Password Error:",
        requestError
      );

      setError(
        getErrorMessage(
          requestError,
          "Unable to change password."
        )
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================================================
  // LOADING UI
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <AdminNavbar />

          <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />

              <p className="mt-4 text-gray-700 font-semibold">
                Loading settings...
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Please wait while we load your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex-1 min-w-0">
        <AdminNavbar />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-sm">
                  <ShieldCheck
                    size={23}
                    className="text-white"
                  />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Admin Settings
                  </h1>

                  <p className="mt-1 text-gray-500">
                    Manage your admin profile and account security.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p className="text-sm font-medium">
                  {message}
                </p>
              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <XCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p className="text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <UserRound
                      size={21}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Admin Profile
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal account information.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                className="p-5 sm:p-6 space-y-5"
              >
                {/* Username */}

                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={profile.username}
                      onChange={handleProfileChange}
                      autoComplete="username"
                      placeholder="Enter username"
                      disabled={saving}
                      className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      autoComplete="email"
                      placeholder="Enter email address"
                      disabled={saving}
                      className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* First Name / Last Name */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block mb-2 text-sm font-semibold text-gray-700"
                    >
                      First Name
                    </label>

                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      autoComplete="given-name"
                      placeholder="Enter first name"
                      disabled={saving}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block mb-2 text-sm font-semibold text-gray-700"
                    >
                      Last Name
                    </label>

                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      autoComplete="family-name"
                      placeholder="Enter last name"
                      disabled={saving}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Save */}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save
                      size={18}
                      className={
                        saving
                          ? "animate-pulse"
                          : ""
                      }
                    />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>

            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <section className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck
                      size={21}
                      className="text-emerald-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Account Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      View your current account and access status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="divide-y divide-gray-100">
                  {/* Status */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Account Status
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Current status of your admin account.
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                        profile.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          profile.is_active
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {profile.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  {/* Role */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Account Role
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Your role on the TalentLens platform.
                      </p>
                    </div>

                    <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                      {profile.role || "ADMIN"}
                    </span>
                  </div>

                  {/* Staff */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Staff Access
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Django staff-level access.
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        profile.is_staff
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {profile.is_staff
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>

                  {/* Superuser */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Superuser Access
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Full Django administrative access.
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        profile.is_superuser
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {profile.is_superuser
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>

                  {/* Last Login */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Last Login
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Most recent successful login.
                      </p>
                    </div>

                    <span className="text-sm font-medium text-gray-700 sm:text-right">
                      {profile.last_login
                        ? new Date(
                            profile.last_login
                          ).toLocaleString()
                        : "No login recorded"}
                    </span>
                  </div>

                  {/* Member Since */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Member Since
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Date this admin account was created.
                      </p>
                    </div>

                    <span className="text-sm font-medium text-gray-700 sm:text-right">
                      {profile.date_joined
                        ? new Date(
                            profile.date_joined
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                CHANGE PASSWORD
            ================================================= */}

            <section className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                    <LockKeyhole
                      size={21}
                      className="text-purple-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Change Password
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="p-5 sm:p-6 space-y-5"
              >
                {/* Current Password */}

                <div>
                  <label
                    htmlFor="current_password"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      id="current_password"
                      name="current_password"
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        passwordData.current_password
                      }
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      placeholder="Enter current password"
                      disabled={changingPassword}
                      className="w-full rounded-xl border border-gray-200 px-4 pr-12 py-3 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}

                <div>
                  <label
                    htmlFor="new_password"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      id="new_password"
                      name="new_password"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        passwordData.new_password
                      }
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      disabled={changingPassword}
                      className="w-full rounded-xl border border-gray-200 px-4 pr-12 py-3 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Password must contain at least 8 characters.
                  </p>
                </div>

                {/* Confirm Password */}

                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        passwordData.confirm_password
                      }
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      disabled={changingPassword}
                      className="w-full rounded-xl border border-gray-200 px-4 pr-12 py-3 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Button */}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LockKeyhole
                      size={18}
                      className={
                        changingPassword
                          ? "animate-pulse"
                          : ""
                      }
                    />

                    {changingPassword
                      ? "Changing Password..."
                      : "Change Password"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminSettings;

