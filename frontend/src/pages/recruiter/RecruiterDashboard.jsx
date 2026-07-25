import { useEffect, useState } from "react";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import api from "../../services/api";
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
} from "recharts";
import {
  Bell,
  Briefcase,
  Clock,
} from "lucide-react";

function RecruiterDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get(
                "/recruiters/dashboard/",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            setDashboardData(response.data);

        } catch (error) {
            console.error(error);

            if (error.response) {
                console.log(error.response.data);
            }

        } finally {
            setLoading(false);
        }
    };

  const applicationData = [
    { name: "Applied", value: dashboardData?.applied || 0 },
    { name: "Under Review", value: dashboardData?.under_review || 0 },
    { name: "Shortlisted", value: dashboardData?.shortlisted || 0 },
    { name: "Hired", value: dashboardData?.hired || 0 },
    { name: "Rejected", value: dashboardData?.rejected || 0 },
  ];

  const jobData = [
    { name: "Total", jobs: dashboardData?.total_jobs || 0 },
    { name: "Active", jobs: dashboardData?.active_jobs || 0 },
    { name: "Inactive", jobs: dashboardData?.inactive_jobs || 0 },
  ];

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#10B981",
    "#6366F1",
    "#EF4444",
  ];

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
              Loading Dashboard...
          </div>
      );
  }

  return (
      <div className="flex min-h-screen bg-gray-100">

        <RecruiterSidebar />

        <div className="flex-1">

          <RecruiterNavbar />

          <div className="p-8">

            <h1 className="text-4xl font-bold text-gray-800">
              Welcome, {dashboardData?.company_name}
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your jobs and candidates from one place.
            </p>

            {/* Statistics Cards yahin se start honge */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

            {/* Total Jobs */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Total Jobs
              </h3>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {dashboardData?.total_jobs}
              </p>
            </div>

            {/* Active Jobs */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Active Jobs
              </h3>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {dashboardData?.active_jobs}
              </p>
            </div>

            {/* Inactive Jobs */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Inactive Jobs
              </h3>

              <p className="text-3xl font-bold text-red-500 mt-2">
                {dashboardData?.inactive_jobs}
              </p>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Total Applications
              </h3>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {dashboardData?.total_applications}
              </p>
            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">

            {/* Applied */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Applied
              </h3>

              <p className="text-3xl font-bold text-blue-500 mt-2">
                {dashboardData?.applied}
              </p>
            </div>

            {/* Under Review */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Under Review
              </h3>

              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {dashboardData?.under_review}
              </p>
            </div>

            {/* Shortlisted */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Shortlisted
              </h3>

              <p className="text-3xl font-bold text-green-500 mt-2">
                {dashboardData?.shortlisted}
              </p>
            </div>

            {/* Hired */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Hired
              </h3>

              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {dashboardData?.hired}
              </p>
            </div>

            {/* Rejected */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Rejected
              </h3>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {dashboardData?.rejected}
              </p>
            </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

              {/* Pie Chart */}

              <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Application Status
                </h2>

                <ResponsiveContainer width="100%" height={320}>

                  <PieChart>

                    <Pie
                      data={applicationData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >

                      {applicationData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />
                      ))}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

              {/* Bar Chart */}

              <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Jobs Overview
                </h2>

                <ResponsiveContainer width="100%" height={320}>

                  <BarChart data={jobData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="jobs"
                      fill="#4F46E5"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* ================= Recent Jobs ================= */}

            <div className="bg-white rounded-xl shadow mt-10 p-6">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Jobs
                </h2>
              </div>

              <div className="overflow-x-auto">

                <table className="min-w-full">

                  <thead className="border-b">

                    <tr className="text-left text-gray-600">

                      <th className="py-3">Job Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Deadline</th>
                      <th>Status</th>

                    </tr>

                  </thead>

                  <tbody>

                    {dashboardData?.recent_jobs.map((job) => (

                      <tr
                        key={job.id}
                        className="border-b hover:bg-gray-50 transition"
                      >

                        <td className="py-4 font-medium">
                          {job.title}
                        </td>

                        <td>{job.location}</td>

                        <td>{job.job_type.replace("_", " ")}</td>

                        <td>{job.deadline}</td>

                        <td>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {job.is_active ? "Active" : "Inactive"}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            <div className="bg-white rounded-xl shadow mt-8 p-6">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Applications
                </h2>
              </div>

              <div className="overflow-x-auto">

                <table className="min-w-full">

                  <thead className="border-b">

                    <tr className="text-left text-gray-600">
                      <th className="py-3">Candidate</th>
                      <th>Job</th>
                      <th>Status</th>
                      <th>Applied On</th>
                    </tr>

                  </thead>

                  <tbody>

                    {dashboardData?.recent_applications.map((application) => (

                      <tr
                        key={application.id}
                        className="border-b hover:bg-gray-50 transition"
                      >

                        <td className="py-4 font-medium">
                          {application.candidate}
                        </td>

                        <td>
                          {application.job}
                        </td>

                        <td>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium
                              ${
                                application.status === "HIRED"
                                  ? "bg-green-100 text-green-700"
                                : application.status === "SHORTLISTED"
                                  ? "bg-blue-100 text-blue-700"
                                : application.status === "UNDER_REVIEW"
                                  ? "bg-yellow-100 text-yellow-700"
                                : application.status === "REJECTED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            `}
                          >
                            {application.status.replace("_", " ")}
                          </span>

                        </td>

                        <td>
                          {new Date(application.applied_at).toLocaleDateString()}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            <div className="bg-white rounded-xl shadow mt-8 p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Jobs Expiring Soon
              </h2>

              <div className="space-y-4">

                {dashboardData?.expiring_jobs.map((job) => {

                  const today = new Date();

                  const deadline = new Date(job.deadline);

                  const daysLeft = Math.ceil(
                    (deadline - today) / (1000 * 60 * 60 * 24)
                  );

                  return (

                    <div
                      key={job.id}
                      className="flex items-center justify-between border rounded-xl p-4 hover:bg-gray-50 transition"
                    >

                      <div>

                        <h3 className="font-semibold text-gray-800">
                          {job.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {job.location}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-medium">
                          {job.deadline}
                        </p>

                        <span
                          className={`text-sm font-semibold ${
                            daysLeft <= 7
                              ? "text-red-600"
                              : daysLeft <= 15
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {daysLeft} Days Left
                        </span>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

            <div className="bg-white rounded-xl shadow mt-8 p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Top Performing Jobs
              </h2>

              <div className="space-y-5">

                {dashboardData?.top_jobs.map((job) => (

                  <div
                    key={job.id}
                    className="flex items-center justify-between"
                  >

                    <div className="w-full">

                      <div className="flex justify-between mb-2">

                        <h3 className="font-semibold text-gray-700">
                          {job.title}
                        </h3>

                        <span className="text-sm font-bold text-indigo-600">
                          {job.applications} Applications
                        </span>

                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                          className="bg-indigo-600 h-3 rounded-full"
                          style={{
                            width: `${Math.min(job.applications * 20, 100)}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="bg-white rounded-xl shadow mt-8 p-6">

              <div className="flex items-center gap-3 mb-6">

                <Bell className="text-indigo-600" size={24} />

                <h2 className="text-xl font-bold text-gray-800">
                  Recent Notifications
                </h2>

              </div>

              <div className="space-y-4">

                {dashboardData?.notifications.map((notification, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-4 border-b pb-4 last:border-none"
                  >

                    <div
                      className={`p-3 rounded-full ${
                        notification.type === "application"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >

                      {notification.type === "application" ? (
                        <Briefcase
                          size={20}
                          className="text-green-600"
                        />
                      ) : (
                        <Clock
                          size={20}
                          className="text-yellow-600"
                        />
                      )}

                    </div>

                    <div className="flex-1">

                      <p className="text-gray-700">
                        {notification.message}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {notification.time}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    );
    }

export default RecruiterDashboard;
