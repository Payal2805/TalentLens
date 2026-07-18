import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchJobs();
        fetchResumes();
        }, []);

        const fetchJobs = async () => {
        try {
            const response = await api.get(
            "/jobs/",
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            }
            );

            // DRF Pagination support
            setJobs(response.data.results || response.data);

        } catch (error) {
            console.error(error);

            if (error.response) {
            alert(JSON.stringify(error.response.data));
            } else {
            alert("Failed to load jobs.");
            }

        } finally {
            setLoading(false);
        }
        };

        const fetchResumes = async () => {
            try {
                const response = await api.get(
                "/candidates/resumes/",
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
                );

                setResumes(response.data);

                if (response.data.length > 0) {
                setSelectedResume(response.data[0].id);
                }

            } catch (error) {
                console.error(error);
            }
            };

        const handleApply = async () => {
            if (!selectedResume) {
                alert("Please select a resume.");
                return;
            }

            try {
                const response = await api.post(
                `/jobs/apply/${selectedJob.id}/`,
                {
                    resume: selectedResume,
                },
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
                );

                alert(response.data.message);

                setShowModal(false);
                setSelectedJob(null);

            } catch (error) {
                console.error(error);

                if (error.response) {
                alert(
                    error.response.data.message ||
                    JSON.stringify(error.response.data)
                );
                } else {
                alert("Application failed.");
                }
            }
            };

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                Loading jobs...
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
            Available Jobs
          </h1>

          <p className="text-gray-500 mt-2">
            Browse and apply for available jobs.
          </p>

          <div className="mt-8 grid gap-6">

                {jobs.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    No jobs available.
                    </div>

                ) : (

                    jobs.map((job) => (

                    <div
                        key={job.id}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >

                        <h2 className="text-2xl font-bold text-blue-600">
                        {job.title}
                        </h2>

                        <p className="text-gray-600 mt-2">
                        📍 {job.location}
                        </p>

                        <p className="text-gray-600">
                        💰 {job.salary}
                        </p>

                        <p className="text-gray-600">
                        💼 {job.job_type}
                        </p>

                        <p className="text-gray-600">
                        ⭐ {job.experience}
                        </p>

                        <p className="text-gray-700 mt-4 line-clamp-3">
                        {job.description}
                        </p>

                        <button
                            disabled={resumes.length === 0}
                            onClick={() => {
                                setSelectedJob(job);
                                setShowModal(true);
                            }}
                            className={`mt-6 px-6 py-3 rounded-lg text-white ${
                                resumes.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            >
                            {resumes.length === 0 ? "No Resume Available" : "Apply Now"}
                        </button>

                    </div>

                    ))

                )}

                </div>

        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-2xl font-bold text-gray-800">
                Apply for Job
            </h2>

            <p className="text-gray-500 mt-2">
                {selectedJob?.title}
            </p>

            <div className="mt-6">

                <label className="block text-sm font-medium mb-2">
                Select Resume
                </label>

                <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(Number(e.target.value))}
                className="w-full border rounded-lg p-3"
                >
                {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                    {resume.resume_title}
                    </option>
                ))}
                </select>

            </div>

            <div className="flex justify-end gap-3 mt-8">

                <button
                onClick={() => {
                setShowModal(false);
                setSelectedJob(null);
                }}
                className="px-5 py-2 rounded-lg border"
                >
                Cancel
                </button>

                <button
                    onClick={handleApply}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                    Apply
                    </button>

            </div>

            </div>

        </div>
        )}

    </div>
  );
}

export default JobList;
