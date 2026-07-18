import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

function CandidateDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(
          "/accounts/candidate/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        setDashboardData(response.data);
      } catch (error) {
        console.error("Dashboard Error:", error);

        if (error.response) {
          console.log(error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex-1">
        <Navbar />

        {/* Dashboard Body */}

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome to TalentLens 👋
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            This is your Candidate Dashboard.
          </p>

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Total Resume */}

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Total Resumes
              </h3>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {dashboardData?.statistics?.total_resumes ?? 0}
              </p>
            </div>

            {/* Applications */}

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Applications
              </h3>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {dashboardData?.statistics?.total_applications ?? 0}
              </p>
            </div>

            {/* Shortlisted */}

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Shortlisted
              </h3>

              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {dashboardData?.statistics?.shortlisted ?? 0}
              </p>
            </div>

            {/* Rejected */}

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm">
                Rejected
              </h3>

              <p className="text-3xl font-bold text-red-500 mt-2">
                {dashboardData?.statistics?.rejected ?? 0}
              </p>
            </div>

          </div>

          {/* Profile Information */}

          <div className="mt-10 bg-white rounded-xl shadow p-6">

            <h3 className="text-xl font-semibold mb-4">
              Profile Information
            </h3>

            <div className="space-y-2">

              <p>
                <span className="font-semibold">
                  Username :
                </span>{" "}
                {dashboardData?.profile?.username}
              </p>

              <p>
                <span className="font-semibold">
                  Email :
                </span>{" "}
                {dashboardData?.profile?.email}
              </p>

              <p>
                <span className="font-semibold">
                  Role :
                </span>{" "}
                {dashboardData?.profile?.role}
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
