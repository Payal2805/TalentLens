import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function CandidateDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(
            "/candidates/dashboard/",
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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white mb-8">

              <h2 className="text-4xl font-bold">
                  👋 Welcome Back,
                  {" "}
                  {dashboardData?.username}
              </h2>

              <p className="mt-3 text-indigo-100 text-lg">
                  Ready to land your next opportunity?
              </p>

              <div className="flex gap-4 mt-8">

                  <button
                      onClick={() => navigate("/candidate/jobs")}
                      className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
                  >
                      Browse Jobs
                  </button>

                  <button
                      onClick={() => navigate("/candidate/resume")}
                      className="bg-indigo-800 hover:bg-indigo-900 px-6 py-3 rounded-xl transition"
                  >
                      Upload Resume
                  </button>

              </div>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Resume */}

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">

                <p className="text-blue-100">
                    Total Resume
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {dashboardData?.total_resumes ?? 0}
                </h2>

            </div>

            {/* Applications */}

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">

                <p className="text-green-100">
                    Applications
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {dashboardData?.total_applications ?? 0}
                </h2>

            </div>

            {/* Shortlisted */}

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">

                <p className="text-yellow-100">
                    Shortlisted
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {dashboardData?.shortlisted ?? 0}
                </h2>

            </div>

            {/* Rejected */}

            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">

                <p className="text-red-100">
                    Rejected
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {dashboardData?.rejected ?? 0}
                </h2>

            </div>

          </div>

          {dashboardData?.next_interview && (

            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

                <h2 className="text-2xl font-bold mb-5">
                    🎯 Next Interview
                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                    <div>
                        <p className="text-gray-500">Job</p>
                        <h3 className="font-bold">
                            {dashboardData.next_interview.job_title}
                        </h3>
                    </div>

                    <div>
                        <p className="text-gray-500">Date</p>
                        <h3>
                            {dashboardData.next_interview.interview_date}
                        </h3>
                    </div>

                    <div>
                        <p className="text-gray-500">Time</p>
                        <h3>
                            {dashboardData.next_interview.interview_time}
                        </h3>
                    </div>

                    <div>
                        <p className="text-gray-500">Mode</p>
                        <h3>
                            {dashboardData.next_interview.interview_mode}
                        </h3>
                    </div>

                </div>

                {dashboardData.next_interview.interview_mode === "ONLINE" &&
                    dashboardData.next_interview.meeting_link && (

                    <a
                        href={dashboardData.next_interview.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Join Meeting
                    </a>

                )}

            </div>

        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-2xl font-bold mb-5">
                📄 Recent Applications
            </h2>

            {dashboardData?.recent_applications?.length === 0 ? (

                <p className="text-gray-500">
                    No applications yet.
                </p>

            ) : (

                <div className="space-y-4">

                    {dashboardData?.recent_applications?.map((item) => (

                        <div
                            key={item.id}
                            className="flex justify-between items-center border-b pb-4"
                        >

                            <div>

                                <h3 className="font-semibold">
                                    {item.job_title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Applied :
                                    {" "}
                                    {new Date(item.applied_at).toLocaleDateString()}
                                </p>

                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold
                                ${
                                    item.status === "APPLIED"
                                        ? "bg-blue-100 text-blue-700"
                                        : item.status === "SHORTLISTED"
                                        ? "bg-green-100 text-green-700"
                                        : item.status === "HIRED"
                                        ? "bg-purple-100 text-purple-700"
                                        : item.status === "REJECTED"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {item.status}
                            </span>

                        </div>

                    ))}

                </div>

            )}

        </div>

        {/* AI Resume Score */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-2xl font-bold mb-5">
                🤖 AI Resume Score
            </h2>

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-gray-500">
                        Resume Quality
                    </p>

                    <h2 className="text-5xl font-bold text-indigo-600 mt-2">
                        {dashboardData?.resume_score ?? 0}%
                    </h2>

                </div>

                <div className="w-32 h-32 rounded-full border-[10px] border-indigo-500 flex items-center justify-center">

                    <span className="text-2xl font-bold text-indigo-600">
                        {dashboardData?.resume_score ?? 0}%
                    </span>

                </div>

            </div>

            <div className="mt-6">

                <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                        className="bg-indigo-600 h-4 rounded-full"
                        style={{
                            width: `${dashboardData?.resume_score ?? 0}%`,
                        }}
                    />

                </div>

            </div>

        </div>

        {/* Profile Completion */}

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold">
                    Profile Completion
                </h2>

                <span className="text-indigo-600 font-bold text-xl">
                    {dashboardData?.profile_completion}%
                </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                    style={{
                        width: `${dashboardData?.profile_completion}%`,
                    }}
                />

            </div>

            <p className="text-gray-500 mt-4">

                Complete your profile to improve recruiter visibility.

            </p>

        </div>

        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
