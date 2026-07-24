import { useState } from "react";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import api from "../../services/api";

function CreateJob() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skills_required: "",
        location: "",
        salary: "",
        experience: "",
        job_type: "",
        deadline: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
      };

    const handleSubmit = async () => {
        try {
          setLoading(true);

          const response = await api.post(
            "/jobs/",
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
              },
            }
          );

          alert(response.data.message);

          setFormData({
            title: "",
            description: "",
            skills_required: "",
            location: "",
            salary: "",
            experience: "",
            job_type: "",
            deadline: "",
          });

        } catch (error) {
          console.error(error);

          if (error.response) {
            alert(JSON.stringify(error.response.data));
          } else {
            alert("Failed to create job.");
          }
        } finally {
          setLoading(false);
        }
      };
  return (
    <div className="flex min-h-screen bg-gray-100">

      <RecruiterSidebar />

      <div className="flex-1">

        <RecruiterNavbar />

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mt-8">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the job responsibilities..."
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills Required
              </label>

              <input
                type="text"
                name="skills_required"
                value={formData.skills_required}
                onChange={handleChange}
                placeholder="React, Django, PostgreSQL"
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Pune"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary
                </label>

                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="8 LPA"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Experience</option>
                    <option value="FRESHER">Fresher</option>
                    <option value="1-2">1-2 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="5+">5+ Years</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type
                  </label>

                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Job Type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Deadline
                  </label>

                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

              </div>

                <div className="mt-8">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition disabled:opacity-60"
                  >
                    {loading ? "Creating..." : "Create Job"}
                  </button>
                </div>  
        </div>

      </div>

    </div>
  );
}

export default CreateJob;
