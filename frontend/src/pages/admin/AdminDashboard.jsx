import { useEffect, useMemo, useState } from "react";

import {
  RefreshCw,
  Users,
  UserRound,
  BriefcaseBusiness,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock3,
  UserCheck,
  UserX,
  ShieldCheck,
  CalendarDays,
  ArrowUpRight,
  Activity,
  Mail,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";
import api from "../../services/api";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // Fetch Dashboard
  // =========================================================

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/dashboard/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      console.log("Dashboard API Response:", response.data);

      setDashboardData(response.data);
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      if (error.response) {
        console.error("API Response:", error.response.data);
      }

      setError(
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // Initial Load
  // =========================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================================================
  // Application Chart Data
  // =========================================================

  const applicationData = useMemo(() => {
    return [
      {
        name: "Applied",
        value: dashboardData?.applied ?? 0,
      },
      {
        name: "Under Review",
        value: dashboardData?.under_review ?? 0,
      },
      {
        name: "Shortlisted",
        value: dashboardData?.shortlisted ?? 0,
      },
      {
        name: "Rejected",
        value: dashboardData?.rejected ?? 0,
      },
      {
        name: "Hired",
        value: dashboardData?.hired ?? 0,
      },
    ];
  }, [dashboardData]);

  // =========================================================
  // Job Chart Data
  // =========================================================

  const jobData = useMemo(() => {
    return [
      {
        name: "Active Jobs",
        jobs: dashboardData?.active_jobs ?? 0,
      },
      {
        name: "Closed Jobs",
        jobs: dashboardData?.closed_jobs ?? 0,
      },
    ];
  }, [dashboardData]);

  // =========================================================
  // Chart Colors
  // =========================================================

  const APPLICATION_COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
  ];

  // =========================================================
  // Format Date
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // Format Date + Time
  // =========================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // Application Status Style
  // =========================================================

  const getApplicationStatusStyle = (status) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-700";

      case "UNDER_REVIEW":
        return "bg-amber-100 text-amber-700";

      case "SHORTLISTED":
        return "bg-emerald-100 text-emerald-700";

      case "HIRED":
        return "bg-purple-100 text-purple-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // Role Style
  // =========================================================

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700";

      case "RECRUITER":
        return "bg-blue-100 text-blue-700";

      case "CANDIDATE":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // Loading State
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <AdminNavbar />

          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-gray-600 font-medium">
                Loading admin dashboard...
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Please wait while we fetch the latest data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // Error State
  // =========================================================

  if (error && !dashboardData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <AdminNavbar />

          <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white border border-red-100 shadow-sm rounded-2xl p-8 text-center max-w-md w-full">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                <XCircle
                  size={28}
                  className="text-red-600"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-5">
                Unable to load dashboard
              </h2>

              <p className="text-gray-500 mt-2">
                {error}
              </p>

              <button
                type="button"
                onClick={() => fetchDashboard()}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // Main Dashboard
  // =========================================================

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="flex-1 min-w-0">
        <AdminNavbar />

        <main className="p-4 md:p-6 lg:p-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                  <Activity
                    size={22}
                    className="text-white"
                  />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Monitor and manage your TalentLens platform.
                  </p>
                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Dashboard"}
            </button>
          </div>

          {/* =================================================
              REFRESH ERROR
          ================================================= */}

          {error && dashboardData && (
            <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
              <Activity size={18} />

              <p className="text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              WELCOME BANNER
          ================================================= */}

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl mb-8">

            <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-white/5" />

            <div className="absolute right-20 -bottom-24 w-48 h-48 rounded-full bg-white/5" />

            <div className="relative p-6 md:p-8">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-slate-300 mb-4">

                    <ShieldCheck size={15} />

                    Admin Control Center

                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    Welcome back,{" "}
                    {dashboardData?.username || "Admin"} 👋
                  </h2>

                  <p className="mt-2 text-slate-300 max-w-2xl">
                    Here's what's happening across your TalentLens
                    platform today.
                  </p>

                </div>


                <div className="hidden lg:flex w-16 h-16 rounded-2xl bg-white/10 border border-white/10 items-center justify-center">

                  <Activity
                    size={30}
                    className="text-white"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              PLATFORM STATISTICS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {/* Total Users */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Users
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {dashboardData?.total_users ?? 0}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Registered platform users
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Users
                    size={23}
                    className="text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Candidates */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Candidates
                  </p>

                  <h2 className="text-3xl font-bold text-indigo-600 mt-2">
                    {dashboardData?.total_candidates ?? 0}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Registered candidates
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <UserRound
                    size={23}
                    className="text-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Recruiters */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Recruiters
                  </p>

                  <h2 className="text-3xl font-bold text-purple-600 mt-2">
                    {dashboardData?.total_recruiters ?? 0}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Registered recruiters
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <UserCheck
                    size={23}
                    className="text-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Jobs */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Jobs
                  </p>

                  <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                    {dashboardData?.total_jobs ?? 0}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    Jobs created on platform
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <BriefcaseBusiness
                    size={23}
                    className="text-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              JOB STATUS
          ================================================= */}

          <section className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Job Overview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Current job availability across the platform.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Active */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Active Jobs
                    </p>

                    <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                      {dashboardData?.active_jobs ?? 0}
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2
                      size={23}
                      className="text-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Closed */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Closed Jobs
                    </p>

                    <h2 className="text-3xl font-bold text-red-600 mt-2">
                      {dashboardData?.closed_jobs ?? 0}
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <XCircle
                      size={23}
                      className="text-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              APPLICATION STATISTICS
          ================================================= */}

          <section className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Application Overview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Application pipeline across the platform.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Applied */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <ClipboardList
                    size={19}
                    className="text-blue-600"
                  />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Applied
                </p>

                <h3 className="text-2xl font-bold text-blue-600 mt-1">
                  {dashboardData?.applied ?? 0}
                </h3>
              </div>

              {/* Under Review */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock3
                    size={19}
                    className="text-amber-600"
                  />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Under Review
                </p>

                <h3 className="text-2xl font-bold text-amber-600 mt-1">
                  {dashboardData?.under_review ?? 0}
                </h3>
              </div>

              {/* Shortlisted */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <UserCheck
                    size={19}
                    className="text-emerald-600"
                  />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Shortlisted
                </p>

                <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                  {dashboardData?.shortlisted ?? 0}
                </h3>
              </div>

              {/* Rejected */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <UserX
                    size={19}
                    className="text-red-600"
                  />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Rejected
                </p>

                <h3 className="text-2xl font-bold text-red-600 mt-1">
                  {dashboardData?.rejected ?? 0}
                </h3>
              </div>

              {/* Hired */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <CheckCircle2
                    size={19}
                    className="text-purple-600"
                  />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Hired
                </p>

                <h3 className="text-2xl font-bold text-purple-600 mt-1">
                  {dashboardData?.hired ?? 0}
                </h3>
              </div>
            </div>
          </section>

          {/* =================================================
              CHARTS
          ================================================= */}

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Application Pie Chart */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Application Status
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Distribution of all applications.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Activity
                    size={19}
                    className="text-indigo-600"
                  />
                </div>
              </div>

              {dashboardData?.total_applications > 0 ? (
                <div className="h-[340px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={applicationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        outerRadius={105}
                        innerRadius={55}
                        paddingAngle={2}
                        label
                      >
                        {applicationData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                APPLICATION_COLORS[
                                  index
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[340px] flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <ClipboardList
                      size={25}
                      className="text-gray-400"
                    />
                  </div>

                  <p className="font-semibold text-gray-700 mt-4">
                    No applications yet
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Application data will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Job Bar Chart */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Jobs Overview
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Active versus closed jobs.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <BriefcaseBusiness
                    size={19}
                    className="text-emerald-600"
                  />
                </div>
              </div>

              <div className="h-[340px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={jobData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="jobs"
                      name="Jobs"
                      fill="#4F46E5"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      barSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* =================================================
              RECENT APPLICATIONS
          ================================================= */}

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Applications
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest applications received on the platform.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                Latest 5
              </span>
            </div>

            <div className="overflow-x-auto">
              {dashboardData?.recent_applications?.length >
              0 ? (
                <table className="w-full min-w-[750px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Candidate
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Job
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Applied
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {dashboardData.recent_applications.map(
                      (application) => (
                        <tr
                          key={application.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                {application.candidate_name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "?"}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {application.candidate_name ||
                                    "Unknown Candidate"}
                                </p>

                                <p className="text-xs text-gray-400">
                                  Application #
                                  {application.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-700">
                              {application.job_title ||
                                "Unknown Job"}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${getApplicationStatusStyle(
                                application.status
                              )}`}
                            >
                              {application.status?.replace(
                                "_",
                                " "
                              ) || "UNKNOWN"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <CalendarDays
                                size={15}
                                className="text-gray-400"
                              />

                              {formatDateTime(
                                application.applied_at
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                    <ClipboardList
                      size={25}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="font-semibold text-gray-800 mt-4">
                    No applications yet
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Recent applications will appear here.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              RECENT USERS
          ================================================= */}

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Users
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest users registered on TalentLens.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                Latest 5
              </span>
            </div>

            <div className="overflow-x-auto">
              {dashboardData?.recent_users?.length >
              0 ? (
                <table className="w-full min-w-[750px]">
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
                        Joined
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {dashboardData.recent_users.map(
                      (user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                                {user.username
                                  ?.charAt(0)
                                  ?.toUpperCase() || "?"}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {user.username ||
                                    "Unknown User"}
                                </p>

                                <p className="text-xs text-gray-400">
                                  User #{user.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail
                                size={15}
                                className="text-gray-400"
                              />

                              {user.email || "—"}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${getRoleStyle(
                                user.role
                              )}`}
                            >
                              {user.role || "UNKNOWN"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <CalendarDays
                                size={15}
                                className="text-gray-400"
                              />

                              {formatDate(
                                user.date_joined
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                    <Users
                      size={25}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="font-semibold text-gray-800 mt-4">
                    No users found
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Recently registered users will appear here.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

