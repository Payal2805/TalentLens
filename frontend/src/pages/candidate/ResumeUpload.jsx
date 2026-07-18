import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

function ResumeUpload() {
  const [resumeTitle, setResumeTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle File Selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle Resume Upload
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

      const response = await api.post(
        "/candidates/resume/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "access"
            )}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Resume uploaded successfully!");

      console.log(response.data);

      // Reset Form
      setResumeTitle("");
      setSelectedFile(null);

      // Reset file input
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

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Resume Upload
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Upload your latest resume (PDF only).
          </p>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">

            {/* Resume Title */}

            <div className="mb-5">

              <label className="block text-sm font-medium mb-2">
                Resume Title
              </label>

              <input
                type="text"
                placeholder="Software Engineer Resume"
                value={resumeTitle}
                onChange={(e) =>
                  setResumeTitle(e.target.value)
                }
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Resume File */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Select Resume
              </label>

              <input
                id="resumeFile"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            {/* Selected File */}

            {selectedFile && (

              <div className="mt-5 bg-gray-100 rounded-lg p-4">

                <p className="font-semibold">
                  Selected File
                </p>

                <p className="text-blue-600 mt-1">
                  {selectedFile.name}
                </p>

              </div>

            )}

            {/* Upload Button */}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResumeUpload;
