import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Users,
  Search,
  RefreshCw,
  UserX,
  MoreVertical,
} from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";

import api from "../../services/api";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [statistics, setStatistics] = useState({
    total_jobs: 0,
    active_jobs: 0,
    closed_jobs: 0,
    total_applications: 0,
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [actionJob, setActionJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ==================================================
  // Fetch Jobs
  // ==================================================

  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/jobs/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      const jobList = response.data.jobs || [];

      setJobs(jobList);

      setStatistics({
        total_jobs: response.data.total_jobs || 0,

        active_jobs: response.data.active_jobs || 0,

        closed_jobs: response.data.closed_jobs || 0,

        total_applications: jobList.reduce(
          (total, job) =>
            total + (job.applications_count || 0),
          0
        ),
      });
    } catch (error) {
      console.error("Jobs Error:", error);

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

  const handleToggleJobStatus = async (job) => {
    try {
    setActionLoading(true);

    await api.patch(
    `/admin/jobs/${job.id}/status/`,
    {},
    {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
    }
    );

    // Refresh jobs after status change
    await fetchJobs(true);

    setActionJob(null);
    

    } catch (error) {
    console.error("Job Status Error:", error);

    
    if (error.response) {
    console.error(
        "API Response:",
        error.response.data
    );
    }
    

    } finally {
    setActionLoading(false);
    }
    };


  // ==================================================
  // Initial Load
  // ==================================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==================================================
  // Filter Jobs
  // ==================================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        job.title
          ?.toLowerCase()
          .includes(searchValue) ||

        job.recruiter
          ?.toLowerCase()
          .includes(searchValue) ||

        job.company
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||

        (statusFilter === "ACTIVE" &&
          job.is_active) ||

        (statusFilter === "CLOSED" &&
          !job.is_active);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [jobs, search, statusFilter]);

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600 font-medium">
            Loading jobs...
          </p>

        </div>
      </div>
    );
  }

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="flex min-h-screen bg-gray-50">

        {/* Admin Sidebar */}

        <AdminSidebar />

        {/* Main Content */}

        <div className="flex-1">

        <AdminNavbar />

        <div className="p-4 md:p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">

              <BriefcaseBusiness
                size={22}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Jobs Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage and monitor all jobs posted on TalentLens.
              </p>

            </div>

          </div>

        </div>

        {/* Refresh */}

        <button
          onClick={() => fetchJobs(true)}
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

        {/* Total Jobs */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Total Jobs
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {statistics.total_jobs}
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

        {/* Active Jobs */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Active Jobs
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {statistics.active_jobs}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

              <CheckCircle
                size={23}
                className="text-green-600"
              />

            </div>

          </div>

        </div>

        {/* Closed Jobs */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Closed Jobs
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {statistics.closed_jobs}
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

        {/* Applications */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Applications
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {statistics.total_applications}
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
              placeholder="Search by job title, recruiter or company..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />

          </div>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="lg:w-52 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >

            <option value="ALL">
              All Jobs
            </option>

            <option value="ACTIVE">
              Active Jobs
            </option>

            <option value="CLOSED">
              Closed Jobs
            </option>

          </select>

        </div>

      </div>

      {/* ==================================================
          JOBS TABLE
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Table Header */}

        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              All Jobs
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredJobs.length} jobs found
            </p>

          </div>

          <div className="text-sm text-gray-500">

            Total:{" "}

            <span className="font-semibold text-gray-800">
              {jobs.length}
            </span>

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-gray-50 border-b border-gray-100">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Job
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Recruiter
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Company
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Applications
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Created
                </th>

                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredJobs.length === 0 ? (

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
                        No jobs found
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Try changing your search or filter.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredJobs.map((job) => (

                  <tr
                    key={job.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* Job */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">

                          <BriefcaseBusiness
                            size={19}
                          />

                        </div>

                        <div>

                          <p className="font-semibold text-gray-900">
                            {job.title}
                          </p>

                          <p className="text-xs text-gray-400">
                            Job ID #{job.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Recruiter */}

                    <td className="px-6 py-4">

                      <p className="text-sm font-medium text-gray-700">
                        {job.recruiter || "—"}
                      </p>

                    </td>

                    {/* Company */}

                    <td className="px-6 py-4">

                      <p className="text-sm text-gray-600">
                        {job.company || "—"}
                      </p>

                    </td>

                    {/* Applications */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">

                          <Users
                            size={16}
                            className="text-blue-600"
                          />

                        </div>

                        <span className="font-semibold text-gray-800">
                          {job.applications_count || 0}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <span
                          className={`w-2 h-2 rounded-full ${
                            job.is_active
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />

                        <span
                          className={`text-sm font-semibold ${
                            job.is_active
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {job.is_active
                            ? "Active"
                            : "Closed"}
                        </span>

                      </div>

                    </td>

                    {/* Created */}

                    <td className="px-6 py-4 text-sm text-gray-500">

                      {job.created_at
                        ? new Date(
                            job.created_at
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}

                    </td>

                    {/* Action */}

                    <td className="px-6 py-4 text-right">

                    <div className="relative inline-block">

                        <button
                        title="More actions"
                        onClick={() =>
                            setActionJob(
                            actionJob?.id === job.id
                                ? null
                                : job
                            )
                        }
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center ml-auto transition"
                        >
                        <MoreVertical
                            size={18}
                            className="text-gray-500"
                        />
                        </button>

                        {actionJob?.id === job.id && (
                        <div className="absolute right-0 top-11 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1">

                            {/* View Details */}

                            <button
                            onClick={() => {
                                setSelectedJob(job);
                                setActionJob(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                            View Details
                            </button>

                            {/* Activate / Close */}

                            <button
                            onClick={() =>
                                handleToggleJobStatus(job)
                            }
                            disabled={actionLoading}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${
                                job.is_active
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                            >
                            {actionLoading
                                ? "Updating..."
                                : job.is_active
                                ? "Close Job"
                                : "Activate Job"}
                            </button>

                        </div>
                        )}

                    </div>

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
              {filteredJobs.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-gray-800">
              {jobs.length}
            </span>{" "}
            jobs

          </p>

          <p className="text-xs text-gray-400">

            {statistics.active_jobs} active ·{" "}
            {statistics.closed_jobs} closed

          </p>

        </div>

        {/* Job Details Modal */}

        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between px-6 py-5 border-b">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Job Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Job ID #{selectedJob.id}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 text-xl"
                >
                  ×
                </button>

              </div>

              {/* Details */}

              <div className="p-6 space-y-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Job Title
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {selectedJob.title}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Company
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedJob.company || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Recruiter
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedJob.recruiter || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Applications
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedJob.applications_count || 0}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedJob.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedJob.is_active ? "Active" : "Closed"}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Created
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedJob.created_at
                      ? new Date(
                          selectedJob.created_at
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

              </div>

              {/* Footer */}

              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">

                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
    </div>
    </div>
  );
}

export default AdminJobs;
