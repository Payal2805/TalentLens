import { useEffect, useState } from "react";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs/recruiter/my-jobs/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      setJobs(response.data);
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Failed to fetch jobs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
        await api.delete(`/jobs/${id}/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        });

        alert("Job deleted successfully.");

        fetchJobs();

    } catch (error) {
        console.error(error);

        if (error.response) {
        alert(JSON.stringify(error.response.data));
        } else {
        alert("Delete failed.");
        }
    }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Jobs...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <RecruiterSidebar />

      <div className="flex-1">

        <RecruiterNavbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            My Jobs
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Manage all your posted jobs.
          </p>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left px-6 py-4 font-semibold">
                    Job Title
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Location
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Job Type
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Deadline
                  </th>

                  <th className="text-center px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="text-center px-6 py-4 font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {jobs.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500"
                    >
                      No jobs found.
                    </td>

                  </tr>

                ) : (

                  jobs.map((job) => (

                    <tr
                      key={job.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        {job.title}
                      </td>

                      <td className="px-6 py-4">
                        {job.location}
                      </td>

                      <td className="px-6 py-4">
                        {job.job_type}
                      </td>

                      <td className="px-6 py-4">
                        {job.deadline}
                      </td>

                      <td className="px-6 py-4 text-center">

                        {job.is_active ? (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            Active
                          </span>

                        ) : (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            Inactive
                          </span>

                        )}

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-2">

                            <button
                                onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                                >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    navigate(`/recruiter/jobs/${job.id}/applicants`)
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                                >
                                Applicants
                            </button>

                            <button
                                onClick={() => handleDelete(job.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                                >
                                Delete
                            </button>

                        </div>

                        </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyJobs;
