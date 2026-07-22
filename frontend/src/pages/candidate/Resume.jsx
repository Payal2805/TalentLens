import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import api from "../../services/api";
import axios from "axios";
import {
  Eye,
  Download,
  Star,
  Trash2,
} from "lucide-react";

function Resume() {
    const [resumeTitle, setResumeTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);

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

    const filteredResumes = resumes.filter((resume) =>
        resume.resume_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

    const handleUpload = async () => {
        if (!resumeTitle.trim()) {
            alert("Please enter resume title.");
            return;
        }

        if (!selectedFile) {
            alert("Please select a PDF file.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("resume_title", resumeTitle);
            formData.append("resume_file", selectedFile);

            await api.post("/candidates/resume/upload/", formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                "Content-Type": "multipart/form-data",
            },
            });

            alert("Resume uploaded successfully!");

            setResumeTitle("");
            setSelectedFile(null);

            await fetchResumes();

            document.getElementById("resumeFile").value = "";

        } catch (error) {
            console.error(error);

            if (error.response) {
            alert(JSON.stringify(error.response.data));
            } else {
            alert("Upload failed.");
            }

        } finally {
            setLoading(false);
        }
        };

        const handleDelete = async (id) => {
        if (!window.confirm("Delete this resume?")) return;

        try {
            await api.delete(`/candidates/resume/${id}/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            });

            alert("Resume deleted.");

            await fetchResumes();

        } catch (error) {
            console.error(error);
            alert("Delete failed.");
        }
        };

    const handleDownload = async (resume) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000${resume.resume_file}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
            new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
            "download",
            resume.resume_title + ".pdf"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            alert("Download failed.");
        }
        };

    const handleSetDefault = async (id) => {
        try {
            await api.patch(
            `/candidates/resume/${id}/default/`,
            {},
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            }
            );

            alert("Default resume updated successfully.");

            fetchResumes();
        } catch (error) {
            console.error(error);

            if (error.response) {
            alert(JSON.stringify(error.response.data));
            } else {
            alert("Failed to set default resume.");
            }
        }
        };

    if (loading && resumes.length === 0) {
        return (
            <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <div className="flex items-center justify-center h-[80vh]">
                <div className="text-center">

                    <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-5 text-gray-600 text-lg">
                    Loading resumes...
                    </p>

                </div>
                </div>
            </div>
            </div>
        );
        }
                
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Uploaded Resumes
            </h2>

            <p className="text-gray-500 mt-2">
                Upload your latest resume in PDF format.
            </p>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Title
                </label>

                <input
                    type="text"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    placeholder="Software Engineer Resume"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume File
                </label>

                <input
                    id="resumeFile"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="block w-full"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl disabled:opacity-60"
                >
                {loading ? "Uploading..." : "Upload Resume"}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm text-gray-500">
                    Total Resumes
                    </h3>

                    <p className="text-3xl font-bold text-blue-700 mt-2">
                    {resumes.length}
                    </p>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm text-gray-500">
                    Default Resume
                    </h3>

                    <p className="text-lg font-semibold text-green-700 mt-2">
                    {resumes.find(r => r.is_default)?.resume_title || "Not Selected"}
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm text-gray-500">
                    Last Uploaded
                    </h3>

                    <p className="text-lg font-semibold text-purple-700 mt-2">
                    {resumes.length
                        ? new Date(
                            resumes[resumes.length - 1].uploaded_at
                        ).toLocaleDateString()
                        : "--"}
                    </p>
                </div>

                </div>

            <div className="flex justify-between items-center mt-8 mb-4">

                <h2 className="text-2xl font-semibold">
                    Resume List
                </h2>

                <input
                    type="text"
                    placeholder="Search resume..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-xl px-4 py-2 w-72 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-6">

                <table className="w-full">

                    <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left px-6 py-4">
                        Resume Title
                        </th>

                        <th className="text-left px-6 py-4">
                        Uploaded On
                        </th>

                        <th className="text-center px-6 py-4">
                        Action
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {resumes.length === 0 ? (

                        <tr>

                            <td colSpan="3" className="py-12">

                            <div className="flex flex-col items-center justify-center">

                                <div className="text-6xl">
                                📄
                                </div>

                                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                                No Resume Uploaded
                                </h3>

                                <p className="mt-2 text-gray-500">
                                Upload your first resume to start applying for jobs.
                                </p>

                            </div>

                            </td>

                        </tr>

                        ) : (

                        filteredResumes.map((resume) => (

                        <tr
                            key={resume.id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="px-6 py-4">
                            {resume.resume_title}
                            </td>

                            <td className="px-6 py-4">
                            {new Date(resume.uploaded_at).toLocaleDateString()}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2 flex-wrap">

                                    <a
                                    href={`http://127.0.0.1:8000${resume.resume_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
                                    >
                                    <Eye size={18} />
                                    <span>View</span>
                                    </a>

                                    <button
                                    onClick={() => handleDownload(resume)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                                    >
                                    <Download size={18} />
                                    <span>Download</span>
                                    </button>

                                    {resume.is_default ? (
                                    <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                                        <Star size={18} fill="currentColor" />
                                        Default
                                    </span>
                                    ) : (
                                    <button
                                        onClick={() => handleSetDefault(resume.id)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                                    >
                                        <Star size={18} />
                                        <span>Set Default</span>
                                    </button>
                                    )}

                                    <button
                                    onClick={() => handleDelete(resume.id)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                                    >
                                    <Trash2 size={18} />
                                    <span>Delete</span>
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

export default Resume;
