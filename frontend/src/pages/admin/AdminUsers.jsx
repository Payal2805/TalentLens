import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  UserCheck,
  BriefcaseBusiness,
  UserX,
  MoreVertical,
} from "lucide-react";

import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";

import api from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==================================================
  // Fetch Users
  // ==================================================

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      setUsers(response.data.users || []);

    } catch (error) {
      console.error("Users Error:", error);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================================================
  // Statistics
  // ==================================================

  const statistics = useMemo(() => {
    return {
      total: users.length,

      active: users.filter(
        (user) => user.is_active
      ).length,

      inactive: users.filter(
        (user) => !user.is_active
      ).length,

      candidates: users.filter(
        (user) => user.role === "CANDIDATE"
      ).length,

      recruiters: users.filter(
        (user) => user.role === "RECRUITER"
      ).length,

      admins: users.filter(
        (user) => user.role === "ADMIN"
      ).length,
    };
  }, [users]);

  // ==================================================
  // Filtering
  // ==================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {

      const username =
        user.username?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const matchesSearch =
        username.includes(searchValue) ||
        email.includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.is_active) ||
        (statusFilter === "INACTIVE" && !user.is_active);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });

  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // ==================================================
  // Role Badge Style
  // ==================================================

  const getRoleStyle = (role) => {

    switch (role) {

      case "ADMIN":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "RECRUITER":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "CANDIDATE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ==================================================
  // Avatar Initial
  // ==================================================

  const getInitial = (username) => {
    return (
      username?.charAt(0)?.toUpperCase() ||
      "?"
    );
  };

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 flex">

        <AdminSidebar />

        <div className="flex-1">

          <AdminNavbar />

          <div className="min-h-[80vh] flex items-center justify-center">

            <div className="text-center">

              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-gray-600 font-medium">
                Loading users...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // Main UI
  // ==================================================

  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* ==================================================
          ADMIN SIDEBAR
      ================================================== */}

      <AdminSidebar />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="flex-1 min-w-0">

        {/* ==================================================
            ADMIN NAVBAR
        ================================================== */}

        <AdminNavbar />

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main className="p-4 md:p-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">

                  <Users
                    size={22}
                    className="text-white"
                  />

                </div>

                <div>

                  <h1 className="text-3xl font-bold text-gray-900">
                    Users Management
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Manage and monitor all registered users.
                  </p>

                </div>

              </div>

            </div>

            {/* Refresh */}

            <button
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
            >

              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"
              }

            </button>

          </div>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            {/* Total Users */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Total Users
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.total}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <Users
                    size={23}
                    className="text-indigo-600"
                  />

                </div>

              </div>

            </div>

            {/* Candidates */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Candidates
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.candidates}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">

                  <UserCheck
                    size={23}
                    className="text-emerald-600"
                  />

                </div>

              </div>

            </div>

            {/* Recruiters */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Recruiters
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.recruiters}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                  <BriefcaseBusiness
                    size={23}
                    className="text-blue-600"
                  />

                </div>

              </div>

            </div>

            {/* Active Users */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Active Users
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.active}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                  <ShieldCheck
                    size={23}
                    className="text-green-600"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              FILTER SECTION
          ================================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

            <div className="flex flex-col lg:flex-row gap-4">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />

              </div>

              {/* Role Filter */}

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="lg:w-52 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >

                <option value="ALL">
                  All Roles
                </option>

                <option value="ADMIN">
                  Admin
                </option>

                <option value="RECRUITER">
                  Recruiter
                </option>

                <option value="CANDIDATE">
                  Candidate
                </option>

              </select>

              {/* Status Filter */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="lg:w-52 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >

                <option value="ALL">
                  All Status
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

              </select>

            </div>

          </div>

          {/* ==================================================
              USERS TABLE
          ================================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Table Header */}

            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  All Users
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {filteredUsers.length} users found
                </p>

              </div>

              <div className="text-sm text-gray-500">

                Total:{" "}

                <span className="font-semibold text-gray-800">
                  {users.length}
                </span>

              </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="bg-gray-50 border-b border-gray-100">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Joined
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredUsers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-16 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">

                            <UserX
                              size={25}
                              className="text-gray-400"
                            />

                          </div>

                          <h3 className="font-semibold text-gray-800">
                            No users found
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Try changing your search or filters.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredUsers.map((user) => (

                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* User */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">

                              {getInitial(user.username)}

                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {user.username}
                              </p>

                              <p className="text-xs text-gray-400">
                                ID #{user.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Email */}

                        <td className="px-6 py-4">

                          <p className="text-sm text-gray-600">
                            {user.email}
                          </p>

                        </td>

                        {/* Role */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${getRoleStyle(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            <span
                              className={`w-2 h-2 rounded-full ${
                                user.is_active
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />

                            <span
                              className={`text-sm font-medium ${
                                user.is_active
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {user.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                        </td>

                        {/* Joined */}

                        <td className="px-6 py-4 text-sm text-gray-500">

                          {new Date(
                            user.date_joined
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}

                        </td>

                        {/* Action */}

                        <td className="px-6 py-4 text-right">

                          <button
                            title="More actions"
                            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center ml-auto transition"
                          >

                            <MoreVertical
                              size={18}
                              className="text-gray-500"
                            />

                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

            {/* Footer */}

            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <p className="text-sm text-gray-500">

                Showing{" "}

                <span className="font-semibold text-gray-800">
                  {filteredUsers.length}
                </span>{" "}

                of{" "}

                <span className="font-semibold text-gray-800">
                  {users.length}
                </span>{" "}

                users

              </p>

              <p className="text-xs text-gray-400">

                {statistics.active} active ·{" "}

                {statistics.inactive} inactive

              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default AdminUsers;
