import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

function CandidateProfile() {
  const [formData, setFormData] = useState({
    phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    highest_education: "",
    college_name: "",
    experience_years: "",
    current_company: "",
    current_job_title: "",
    skills: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] =useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    username: "",
    email: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get("/candidates/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      console.log("Profile Response:", response);
      console.log("Profile Data:", response.data);

      setUserInfo({
        full_name: response.data.full_name || "",
        username: response.data.username || "",
        email: response.data.email || "",
      });

      setFormData({
        phone_number: response.data.phone_number || "",
        date_of_birth: response.data.date_of_birth || "",
        gender: response.data.gender || "",
        address: response.data.address || "",
        city: response.data.city || "",
        state: response.data.state || "",
        country: response.data.country || "",
        highest_education: response.data.highest_education || "",
        college_name: response.data.college_name || "",
        experience_years: response.data.experience_years || "",
        current_company: response.data.current_company || "",
        current_job_title: response.data.current_job_title || "",
        skills: response.data.skills || "",
        linkedin_url: response.data.linkedin_url || "",
        github_url: response.data.github_url || "",
        portfolio_url: response.data.portfolio_url || "",
      });
    const imageUrl = response.data.profile_photo
        ? `http://127.0.0.1:8000${response.data.profile_photo}`
        : "";

    setPhotoPreview(imageUrl);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        setFormData({
          phone_number: "",
          date_of_birth: "",
          gender: "",
          address: "",
          city: "",
          state: "",
          country: "",
          highest_education: "",
          college_name: "",
          experience_years: "",
          current_company: "",
          current_job_title: "",
          skills: "",
          linkedin_url: "",
          github_url: "",
          portfolio_url: "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];

        setProfilePhoto(file);

        setPhotoPreview(URL.createObjectURL(file));
    }
    };

  const handleSave = async () => {
    try {
        setSaving(true);

        const data = new FormData();

        Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
        });

        if (profilePhoto) {
        data.append("profile_photo", profilePhoto);
        }

        const response = await api.put(
        "/candidates/profile/",
        data,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "multipart/form-data",
            },
        }
        );

        setFormData(response.data);
       
        if (response.data.profile_photo) {
            setPhotoPreview(
                `http://127.0.0.1:8000${response.data.profile_photo}`
            );
            }
          
        await fetchProfile();
        setIsEditing(false);

        alert("Profile Updated Successfully!");

    } catch (error) {
        console.error(error);

        if (error.response) {
        alert(JSON.stringify(error.response.data));
        } else {
        alert("Failed to update profile.");
        }

    } finally {
        setSaving(false);
    }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading profile...
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              My Profile
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage your personal and professional information.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                  Candidate Information
              </h2>

              {!isEditing ? (
                  <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl shadow-md transition"
                  >
                      Edit Profile
                  </button>
              ) : (
                  <button
                      type="button"
                      onClick={() => {
                          fetchProfile();
                          setIsEditing(false);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-xl shadow-md transition"
                  >
                      Cancel
                  </button>
              )}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-10 text-white shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-8">

                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
                    No Photo
                  </div>
                )}

                <div className="flex-1 text-center md:text-left">

                  <h2 className="text-3xl font-bold">
                    {userInfo.full_name || userInfo.username}
                  </h2>

                  <p className="text-blue-100 text-lg mt-2">
                    {formData.current_job_title || "Job Title"}
                  </p>

                  <p className="text-blue-100">
                    ✉️ {userInfo.email}
                  </p>

                  <p className="text-blue-100 mt-2">
                    📍 {formData.city}, {formData.state}
                  </p>

                  {isEditing && (
                    <div className="mt-6">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="text-sm"
                      />
                    </div>
                  )}

                </div>

              </div>
            </div>

            <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* ================= Personal Information ================= */}

                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mb-6">
                    👤 Personal Information
                  </h2>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                    </label>

                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                      />
                </div>

                {/* DOB */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                    </label>

                    <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                    </label>

                    <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    </select>
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                    </label>

                    <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* State */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                    </label>

                    <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                    </label>

                    <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                    </label>

                    <textarea
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* ================= Education ================= */}

                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mt-6 mb-6">
                      🎓 Education
                    </h2>
                  </div>

                {/* Education */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Highest Education
                    </label>

                    <input
                    type="text"
                    name="highest_education"
                    value={formData.highest_education}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* College */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College Name
                    </label>

                    <input
                    type="text"
                    name="college_name"
                    value={formData.college_name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* ================= Professional ================= */}

                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mt-6 mb-6">
                      💼 Professional
                    </h2>
                  </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience
                    </label>

                    <input
                    type="number"
                    min="0"
                    step="0.5"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* Company */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Company
                    </label>

                    <input
                    type="text"
                    name="current_company"
                    value={formData.current_company}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* Job Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Job Title
                    </label>

                    <input
                    type="text"
                    name="current_job_title"
                    value={formData.current_job_title}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* ================= Skills ================= */}

                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mt-6 mb-6">
                      ⭐ Skills
                    </h2>
                  </div>

                {/* Skills */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills
                    </label>

                    <textarea
                    rows={3}
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    placeholder="Python, Django, React"
                    />
                </div>

                {/* ================= Social Links ================= */}

                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mt-6 mb-6">
                    🔗 Social Links
                  </h2>
                </div>

                {/* LinkedIn */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn URL
                    </label>

                    <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* Github */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Github URL
                    </label>

                    <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                {/* Portfolio */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio URL
                    </label>

                    <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                          isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>


                {/* Save Button */}
                {isEditing && (
                  <div className="md:col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;
