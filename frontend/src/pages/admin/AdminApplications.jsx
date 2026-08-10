import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  Search,
  RefreshCw,
  UserX,
  MoreVertical,
  Mail,
  CalendarDays,
} from "lucide-react";

import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";

import api from "../../services/api";

function AdminApplications() {
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [actionApplication, setActionApplication] =
    useState(null);

  // ==================================================
  // Fetch Applications
  // ==================================================

  const fetchApplications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(
        "/admin/applications/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "access"
            )}`,
          },
        }
      );

      setApplications(
        response.data.applications || []
      );
    } catch (error) {
      console.error(
        "Applications Error:",
        error
      );

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
    fetchApplications();
  }, []);

  // ==================================================
  // Filter Applications
  // ==================================================

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        application.candidate_name
          ?.toLowerCase()
          .includes(searchValue) ||

        application.candidate_email
          ?.toLowerCase()
          .includes(searchValue) ||

        application.job_title
          ?.toLowerCase()
          .includes(searchValue) ||

        application.recruiter
          ?.toLowerCase()
          .includes(searchValue) ||

        application.company
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        application.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    applications,
    search,
    statusFilter,
  ]);

  // ==================================================
  // Status Helper
  // ==================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-700";

      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-700";

      case "SHORTLISTED":
        return "bg-purple-100 text-purple-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "HIRED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600 font-medium">
            Loading applications...
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

      {/* Sidebar */}

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
                    Applications Management
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Manage and monitor all job applications.
                  </p>

                </div>

              </div>

            </div>

            {/* Refresh */}

            <button
              onClick={() =>
                fetchApplications(true)
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

            {/* Total */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Total Applications
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {applications.length}
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

            {/* Applied */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Applied
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {
                      applications.filter(
                        (application) =>
                          application.status ===
                          "APPLIED"
                      ).length
                    }
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

            {/* Shortlisted */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Shortlisted
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {
                      applications.filter(
                        (application) =>
                          application.status ===
                          "SHORTLISTED"
                      ).length
                    }
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

                  <Users
                    size={23}
                    className="text-purple-600"
                  />

                </div>

              </div>

            </div>

            {/* Hired */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 font-medium">
                    Hired
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {
                      applications.filter(
                        (application) =>
                          application.status ===
                          "HIRED"
                      ).length
                    }
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                  <Users
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
                  placeholder="Search candidate, job, recruiter or company..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />

              </div>

              {/* Status */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="lg:w-56 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >

                <option value="ALL">
                  All Applications
                </option>

                <option value="APPLIED">
                  Applied
                </option>

                <option value="UNDER_REVIEW">
                  Under Review
                </option>

                <option value="SHORTLISTED">
                  Shortlisted
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="HIRED">
                  Hired
                </option>

              </select>

            </div>

          </div>

          {/* ==================================================
              APPLICATIONS TABLE
          ================================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}

            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  All Applications
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {filteredApplications.length} applications found
                </p>

              </div>

              <div className="text-sm text-gray-500">

                Total:{" "}

                <span className="font-semibold text-gray-800">
                  {applications.length}
                </span>

              </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-gray-50 border-b border-gray-100">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Candidate
                    </th>

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
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Applied
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredApplications.length === 0 ? (

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
                            No applications found
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Try changing your search or filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredApplications.map(
                      (application) => (

                        <tr
                          key={application.id}
                          className="hover:bg-gray-50 transition"
                        >

                          {/* Candidate */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                {application.candidate_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </div>

                              <div>

                                <p className="font-semibold text-gray-900">
                                  {application.candidate_name}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {application.candidate_email}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Job */}

                          <td className="px-6 py-4">

                            <p className="text-sm font-semibold text-gray-800">
                              {application.job_title}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Application #{application.id}
                            </p>

                          </td>

                          {/* Recruiter */}

                          <td className="px-6 py-4">

                            <p className="text-sm font-medium text-gray-700">
                              {application.recruiter || "—"}
                            </p>

                          </td>

                          {/* Company */}

                          <td className="px-6 py-4">

                            <p className="text-sm text-gray-600">
                              {application.company || "—"}
                            </p>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                                application.status
                              )}`}
                            >
                              {application.status?.replace(
                                "_",
                                " "
                              )}
                            </span>

                          </td>

                          {/* Applied */}

                          <td className="px-6 py-4 text-sm text-gray-500">

                            {application.applied_at
                              ? new Date(
                                  application.applied_at
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
                                  setActionApplication(
                                    actionApplication?.id ===
                                      application.id
                                      ? null
                                      : application
                                  )
                                }
                                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center ml-auto transition"
                              >

                                <MoreVertical
                                  size={18}
                                  className="text-gray-500"
                                />

                              </button>

                              {actionApplication?.id ===
                                application.id && (

                                <div className="absolute right-0 top-11 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1">

                                  <button
                                    onClick={() => {
                                      setSelectedApplication(
                                        application
                                      );

                                      setActionApplication(
                                        null
                                      );
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    View Details
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
                  {filteredApplications.length}
                </span>{" "}

                of{" "}

                <span className="font-semibold text-gray-800">
                  {applications.length}
                </span>{" "}
                applications

              </p>

            </div>

            {/* ==================================================
                APPLICATION DETAILS MODAL
            ================================================== */}

            {selectedApplication && (

              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">

                  {/* Header */}

                  <div className="flex items-center justify-between px-6 py-5 border-b">

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        Application Details
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Application #{selectedApplication.id}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        setSelectedApplication(
                          null
                        )
                      }
                      className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 text-xl"
                    >
                      ×
                    </button>

                  </div>

                  {/* Details */}

                  <div className="p-6 space-y-5">

                    {/* Candidate */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Candidate
                      </p>

                      <p className="font-semibold text-gray-900 mt-1">
                        {selectedApplication.candidate_name}
                      </p>

                    </div>

                    {/* Email */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Email
                      </p>

                      <div className="flex items-center gap-2 mt-1">

                        <Mail
                          size={16}
                          className="text-gray-400"
                        />

                        <p className="font-medium text-gray-800">
                          {selectedApplication.candidate_email}
                        </p>

                      </div>

                    </div>

                    {/* Job */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Job
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {selectedApplication.job_title}
                      </p>

                    </div>

                    {/* Recruiter */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Recruiter
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {selectedApplication.recruiter || "—"}
                      </p>

                    </div>

                    {/* Company */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Company
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {selectedApplication.company || "—"}
                      </p>

                    </div>

                    {/* Status */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <span
                        className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                          selectedApplication.status
                        )}`}
                      >
                        {selectedApplication.status?.replace(
                          "_",
                          " "
                        )}
                      </span>

                    </div>

                    {/* Applied Date */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Applied Date
                      </p>

                      <div className="flex items-center gap-2 mt-1">

                        <CalendarDays
                          size={16}
                          className="text-gray-400"
                        />

                        <p className="font-semibold text-gray-800">
                          {selectedApplication.applied_at
                            ? new Date(
                                selectedApplication.applied_at
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Footer */}

                  <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">

                    <button
                      onClick={() =>
                        setSelectedApplication(
                          null
                        )
                      }
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

export default AdminApplications;
