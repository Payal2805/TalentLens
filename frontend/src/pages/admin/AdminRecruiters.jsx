import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Users,
  UserRound,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  Building2,
  Mail,
  CalendarDays,
  MoreVertical,
  Eye,
  Power,
  X,
  ShieldCheck,
} from "lucide-react";

import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";

import api from "../../services/api";

function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [actionRecruiter, setActionRecruiter] = useState(null);

  const [statusUpdating, setStatusUpdating] = useState(false);

  // ==================================================
  // Fetch Recruiters
  // ==================================================

  const fetchRecruiters = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/recruiters/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      setRecruiters(response.data.recruiters || []);
    } catch (error) {
      console.error("Recruiters Error:", error);

      if (error.response) {
        console.error(
          "API Response:",
          error.response.data
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==================================================
  // Initial Load
  // ==================================================

  useEffect(() => {
    fetchRecruiters();
  }, []);

  // ==================================================
  // Statistics
  // ==================================================

  const statistics = useMemo(() => {
    return {
      total: recruiters.length,

      active: recruiters.filter(
        (recruiter) => recruiter.is_active
      ).length,

      inactive: recruiters.filter(
        (recruiter) => !recruiter.is_active
      ).length,

      totalJobs: recruiters.reduce(
        (total, recruiter) =>
          total + (recruiter.jobs_count || 0),
        0
      ),

      activeJobs: recruiters.reduce(
        (total, recruiter) =>
          total + (recruiter.active_jobs_count || 0),
        0
      ),
    };
  }, [recruiters]);

  // ==================================================
  // Filtering
  // ==================================================

  const filteredRecruiters = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return recruiters.filter((recruiter) => {
      const fullName =
        recruiter.full_name?.toLowerCase() || "";

      const username =
        recruiter.username?.toLowerCase() || "";

      const email =
        recruiter.email?.toLowerCase() || "";

      const company =
        recruiter.company_name?.toLowerCase() || "";

      const matchesSearch =
        fullName.includes(searchValue) ||
        username.includes(searchValue) ||
        email.includes(searchValue) ||
        company.includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          recruiter.is_active) ||
        (statusFilter === "INACTIVE" &&
          !recruiter.is_active);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    recruiters,
    search,
    statusFilter,
  ]);

  // ==================================================
  // Avatar Initial
  // ==================================================

  const getInitial = (recruiter) => {
    return (
      recruiter.full_name
        ?.charAt(0)
        ?.toUpperCase() ||
      recruiter.username
        ?.charAt(0)
        ?.toUpperCase() ||
      "?"
    );
  };

  // ==================================================
  // Date Formatter
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // Close Action Menu
  // ==================================================

  const closeMenus = () => {
    setActionRecruiter(null);
  };

  // ==================================================
  // Toggle Recruiter Status
  // ==================================================

  const toggleRecruiterStatus = async (recruiter) => {
    try {
      setStatusUpdating(true);

      const response = await api.patch(
        `/admin/recruiters/${recruiter.id}/status/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "access"
            )}`,
          },
        }
      );

      const updatedRecruiter =
        response.data.recruiter;

      setRecruiters((prevRecruiters) =>
        prevRecruiters.map((item) =>
          item.id === updatedRecruiter.id
            ? {
                ...item,
                is_active:
                  updatedRecruiter.is_active,
              }
            : item
        )
      );

      // Update modal also if open
      setSelectedRecruiter((current) => {
        if (
          current &&
          current.id === updatedRecruiter.id
        ) {
          return {
            ...current,
            is_active:
              updatedRecruiter.is_active,
          };
        }

        return current;
      });

      closeMenus();
    } catch (error) {
      console.error(
        "Recruiter Status Error:",
        error
      );

      if (error.response) {
        console.error(
          "API Response:",
          error.response.data
        );
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">

        <AdminSidebar />

        <div className="flex-1 min-w-0">

          <AdminNavbar />

          <div className="min-h-[80vh] flex items-center justify-center">

            <div className="text-center">

              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-gray-600 font-medium">
                Loading recruiters...
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
          SIDEBAR
      ================================================== */}

      <AdminSidebar />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="flex-1 min-w-0">

        <AdminNavbar />

        <main className="p-4 md:p-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">

                  <Users
                    size={22}
                    className="text-white"
                  />

                </div>

                <div>

                  <h1 className="text-3xl font-bold text-gray-900">
                    Recruiters Management
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Manage and monitor all registered recruiters.
                  </p>

                </div>

              </div>

            </div>

            {/* Refresh */}

            <button
              type="button"
              onClick={() =>
                fetchRecruiters(true)
              }
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
                : "Refresh"}

            </button>

          </div>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            {/* Total Recruiters */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Total Recruiters
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.total}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                  <Users
                    size={23}
                    className="text-blue-600"
                  />

                </div>

              </div>

            </div>

            {/* Active Recruiters */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Active Recruiters
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.active}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                  <UserCheck
                    size={23}
                    className="text-green-600"
                  />

                </div>

              </div>

            </div>

            {/* Inactive Recruiters */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Inactive Recruiters
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.inactive}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">

                  <UserX
                    size={23}
                    className="text-red-600"
                  />

                </div>

              </div>

            </div>

            {/* Active Jobs */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Active Jobs
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.activeJobs}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <BriefcaseBusiness
                    size={23}
                    className="text-indigo-600"
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
                  placeholder="Search by name, username, email or company..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

              </div>

              {/* Status Filter */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="lg:w-56 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >

                <option value="ALL">
                  All Recruiters
                </option>

                <option value="ACTIVE">
                  Active Recruiters
                </option>

                <option value="INACTIVE">
                  Inactive Recruiters
                </option>

              </select>

            </div>

          </div>

          {/* ==================================================
              RECRUITERS TABLE
          ================================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Table Header */}

            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  All Recruiters
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {filteredRecruiters.length} recruiters found
                </p>

              </div>

              <div className="text-sm text-gray-500">

                Total:{" "}

                <span className="font-semibold text-gray-800">
                  {recruiters.length}
                </span>

              </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-gray-50 border-b border-gray-100">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Recruiter
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Company
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Jobs
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

                  {filteredRecruiters.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
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
                            No recruiters found
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Try changing your search or filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredRecruiters.map(
                      (recruiter) => (

                        <tr
                          key={recruiter.id}
                          className="hover:bg-gray-50 transition"
                        >

                          {/* Recruiter */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                                {getInitial(
                                  recruiter
                                )}

                              </div>

                              <div>

                                <p className="font-semibold text-gray-900">
                                  {recruiter.full_name ||
                                    "Unnamed Recruiter"}
                                </p>

                                <p className="text-xs text-gray-400">
                                  @{recruiter.username ||
                                    "unknown"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Company */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <Building2
                                size={16}
                                className="text-gray-400"
                              />

                              <span className="text-sm font-medium text-gray-700">
                                {recruiter.company_name ||
                                  "—"}
                              </span>

                            </div>

                          </td>

                          {/* Email */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <Mail
                                size={15}
                                className="text-gray-400"
                              />

                              <span className="text-sm text-gray-600">
                                {recruiter.email ||
                                  "—"}
                              </span>

                            </div>

                          </td>

                          {/* Jobs */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <div className="text-center">

                                <p className="font-bold text-gray-900">
                                  {recruiter.jobs_count ||
                                    0}
                                </p>

                                <p className="text-xs text-gray-400">
                                  total
                                </p>

                              </div>

                              <span className="text-gray-300">
                                /
                              </span>

                              <div className="text-center">

                                <p className="font-bold text-green-600">
                                  {recruiter.active_jobs_count ||
                                    0}
                                </p>

                                <p className="text-xs text-gray-400">
                                  active
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <span
                                className={`w-2 h-2 rounded-full ${
                                  recruiter.is_active
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />

                              <span
                                className={`text-sm font-semibold ${
                                  recruiter.is_active
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {recruiter.is_active
                                  ? "Active"
                                  : "Inactive"}
                              </span>

                            </div>

                          </td>

                          {/* Joined */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <CalendarDays
                                size={15}
                                className="text-gray-400"
                              />

                              <span className="text-sm text-gray-500">
                                {formatDate(
                                  recruiter.date_joined
                                )}
                              </span>

                            </div>

                          </td>

                          {/* Action */}

                          <td className="px-6 py-4 text-right">

                            <div className="relative inline-block">

                              <button
                                type="button"
                                title="More actions"
                                onClick={() =>
                                  setActionRecruiter(
                                    actionRecruiter?.id ===
                                      recruiter.id
                                      ? null
                                      : recruiter
                                  )
                                }
                                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                              >

                                <MoreVertical
                                  size={18}
                                  className="text-gray-500"
                                />

                              </button>

                              {actionRecruiter?.id ===
                                recruiter.id && (

                                <div className="absolute right-0 top-11 z-30 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-1">

                                  {/* View Details */}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedRecruiter(
                                        recruiter
                                      );
                                      closeMenus();
                                    }}
                                    className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                  >

                                    <Eye
                                      size={16}
                                      className="text-gray-500"
                                    />

                                    View Details

                                  </button>

                                  {/* Status */}

                                  <button
                                    type="button"
                                    disabled={
                                      statusUpdating
                                    }
                                    onClick={() =>
                                      toggleRecruiterStatus(
                                        recruiter
                                      )
                                    }
                                    className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50"
                                  >

                                    <Power
                                      size={16}
                                      className={
                                        recruiter.is_active
                                          ? "text-red-500"
                                          : "text-green-500"
                                      }
                                    />

                                    {recruiter.is_active
                                      ? "Deactivate"
                                      : "Activate"}

                                  </button>

                                </div>

                              )}

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* Footer */}

            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <p className="text-sm text-gray-500">

                Showing{" "}

                <span className="font-semibold text-gray-800">
                  {filteredRecruiters.length}
                </span>{" "}

                of{" "}

                <span className="font-semibold text-gray-800">
                  {recruiters.length}
                </span>{" "}

                recruiters

              </p>

              <p className="text-xs text-gray-400">

                {statistics.active} active ·{" "}

                {statistics.inactive} inactive ·{" "}

                {statistics.totalJobs} total jobs

              </p>

            </div>

          </div>

        </main>

      </div>

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {selectedRecruiter && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4"
          onClick={() =>
            setSelectedRecruiter(null)
          }
        >

          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                  {getInitial(
                    selectedRecruiter
                  )}

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Recruiter Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-0.5">
                    Recruiter #
                    {selectedRecruiter.id}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecruiter(null)
                }
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
              >

                <X
                  size={19}
                  className="text-gray-500"
                />

              </button>

            </div>

            {/* Modal Body */}

            <div className="p-6">

              <div className="space-y-5">

                {/* Full Name */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Full Name
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {selectedRecruiter.full_name ||
                      "—"}
                  </p>

                </div>

                {/* Username */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Username
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    @
                    {selectedRecruiter.username ||
                      "—"}
                  </p>

                </div>

                {/* Email */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Email Address
                  </p>

                  <div className="flex items-center gap-2 mt-1">

                    <Mail
                      size={16}
                      className="text-gray-400"
                    />

                    <p className="font-medium text-gray-800">
                      {selectedRecruiter.email ||
                        "—"}
                    </p>

                  </div>

                </div>

                {/* Company */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Company
                  </p>

                  <div className="flex items-center gap-2 mt-1">

                    <Building2
                      size={16}
                      className="text-gray-400"
                    />

                    <p className="font-semibold text-gray-800">
                      {selectedRecruiter.company_name ||
                        "—"}
                    </p>

                  </div>

                </div>

                {/* User ID */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    User ID
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    #
                    {selectedRecruiter.user_id}
                  </p>

                </div>

                {/* Jobs */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Jobs
                  </p>

                  <div className="flex gap-6 mt-2">

                    <div>

                      <p className="text-2xl font-bold text-gray-900">
                        {selectedRecruiter.jobs_count ||
                          0}
                      </p>

                      <p className="text-xs text-gray-400">
                        Total Jobs
                      </p>

                    </div>

                    <div>

                      <p className="text-2xl font-bold text-green-600">
                        {selectedRecruiter.active_jobs_count ||
                          0}
                      </p>

                      <p className="text-xs text-gray-400">
                        Active Jobs
                      </p>

                    </div>

                  </div>

                </div>

                {/* Status */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Account Status
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedRecruiter.is_active
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >

                      <ShieldCheck
                        size={17}
                        className={
                          selectedRecruiter.is_active
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      />

                    </div>

                    <span
                      className={`font-semibold ${
                        selectedRecruiter.is_active
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedRecruiter.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                </div>

                {/* Joined */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Joined Date
                  </p>

                  <div className="flex items-center gap-2 mt-1">

                    <CalendarDays
                      size={16}
                      className="text-gray-400"
                    />

                    <p className="font-semibold text-gray-800">
                      {formatDate(
                        selectedRecruiter.date_joined
                      )}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">

              <button
                type="button"
                disabled={statusUpdating}
                onClick={() =>
                  toggleRecruiterStatus(
                    selectedRecruiter
                  )
                }
                className={`px-4 py-2.5 rounded-xl font-medium transition disabled:opacity-50 ${
                  selectedRecruiter.is_active
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >

                {statusUpdating
                  ? "Updating..."
                  : selectedRecruiter.is_active
                    ? "Deactivate"
                    : "Activate"}

              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecruiter(null)
                }
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-medium"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminRecruiters;
