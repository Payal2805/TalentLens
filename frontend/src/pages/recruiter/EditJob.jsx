import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import api from "../../services/api";

function EditJob() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {

      const response = await api.get(`/jobs/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      console.log(response.data);

      setFormData(response.data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
    };

   const handleUpdateJob = async (e) => {
    e.preventDefault();

    try {
        const response = await api.put(
        `/jobs/${id}/`,
        formData,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
        }
        );

        alert(response.data.message);
        navigate("/recruiter/my-jobs");

    } catch (error) {
        console.error(error);

        if (error.response) {
        alert(error.response.data.message);
        }
    }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Job...
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
            Edit Job
          </h1>

          <p className="text-gray-500 mt-2">
            Update your job details.
          </p>

          <div className="mt-8 bg-white rounded-xl shadow p-6">

            <form onSubmit={handleUpdateJob} className="mt-6">
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
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
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                        </label>

                        <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Salary
                        </label>

                        <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Experience
                        </label>

                        <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                        >
                        <option value="FRESHER">Fresher</option>
                        <option value="1-2">1-2 Years</option>
                        <option value="3-5">3-5 Years</option>
                        <option value="5+">5+ Years</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Type
                        </label>

                        <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                        >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Deadline
                        </label>

                        <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                        />
                    </div>

                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold"
                        >
                            Update Job
                        </button>
                    </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EditJob;
