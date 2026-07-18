import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  // Fetch Resume List
  const fetchResumes = async () => {
    try {
      const response = await api.get("/candidates/resumes/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      setResumes(response.data);
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Failed to fetch resumes.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete Resume
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/candidates/resume/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      alert("Resume deleted successfully.");

      fetchResumes();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading resumes...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Page */}
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            My Resumes
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            View and manage your uploaded resumes.
          </p>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left px-6 py-4 font-semibold">
                    Resume Title
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Uploaded On
                  </th>

                  <th className="text-center px-6 py-4 font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {resumes.length === 0 ? (

                  <tr>

                    <td
                      colSpan="3"
                      className="text-center py-10 text-gray-500"
                    >
                      No resumes uploaded yet.
                    </td>

                  </tr>

                ) : (

                  resumes.map((resume) => (

                    <tr
                      key={resume.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        {resume.resume_title}
                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          resume.uploaded_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-center">

                        <button
                          onClick={() =>
                            handleDelete(resume.id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                          Delete
                        </button>

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

export default ResumeList;
