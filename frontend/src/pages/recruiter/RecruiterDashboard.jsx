import { useEffect, useState } from "react";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import api from "../../services/api";

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

        </div>

        </div>

      </div>
    );
    }

export default RecruiterDashboard;
