import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get(
            "/jobs/my-applications/",
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            }
            );

            setApplications(response.data.applications);

        } catch (error) {
            console.error(error);

            if (error.response) {
            alert(
                error.response.data.message ||
                JSON.stringify(error.response.data)
            );
            } else {
            alert("Failed to load applications.");
            }

        } finally {
            setLoading(false);
        }
        };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
            Loading applications...
            </div>
        );
        }


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Applications
          </h1>

          <p className="text-gray-500 mt-2">
            View all your job applications.
          </p>

          <div className="mt-8 grid gap-6">

            {applications.length === 0 ? (

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-700">
                    No Applications Yet
                </h2>

                <p className="text-gray-500 mt-2">
                    You haven't applied for any jobs yet.
                </p>
                </div>

            ) : (

                applications.map((application) => (

                <div
                    key={application.id}
                    className="bg-white rounded-xl shadow-lg p-6"
                >

                    {/* Job Title */}

                    <h2 className="text-2xl font-bold text-blue-600">
                    {application.job_title}
                    </h2>

                    {/* Company */}

                    <p className="text-gray-600 mt-2">
                    🏢 {application.company_name}
                    </p>

                    {/* Applied Date */}

                    <p className="text-gray-600 mt-2">
                    📅 Applied:
                    {" "}
                    {new Date(application.applied_at).toLocaleDateString()}
                    </p>

                    {/* Status */}

                    <div className="mt-5">

                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold
                        ${
                            application.status === "APPLIED"
                            ? "bg-blue-100 text-blue-700"
                            : application.status === "UNDER_REVIEW"
                            ? "bg-yellow-100 text-yellow-700"
                            : application.status === "SHORTLISTED"
                            ? "bg-green-100 text-green-700"
                            : application.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        }
                        `}
                    >
                        {application.status.replaceAll("_", " ")}
                    </span>

                    </div>

                </div>

                ))

            )}

            </div>
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
