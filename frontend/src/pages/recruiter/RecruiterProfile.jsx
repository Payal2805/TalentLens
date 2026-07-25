import { useEffect, useState } from "react";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import api from "../../services/api";

function RecruiterProfile() {
    const [formData, setFormData] = useState({
        company_name: "",
        company_email: "",
        company_phone: "",
        company_website: "",
        company_address: "",
        designation: "",
        company_description: "",
        });

        const [companyLogo, setCompanyLogo] = useState(null);

        const [logoPreview, setLogoPreview] = useState("");

        const [loading, setLoading] = useState(true);

        const [saving, setSaving] = useState(false);

        const [isEditing, setIsEditing] = useState(false);

        const [userInfo, setUserInfo] = useState({
        first_name: "",
        username: "",
        email: "",
        });

    const fetchProfile = async () => {
        try {
            const response = await api.get("/recruiters/profile/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            });

            setUserInfo({
            first_name: response.data.first_name || "",
            username: response.data.username || "",
            email: response.data.email || "",
            });

            setFormData({
            company_name: response.data.company_name || "",
            company_email: response.data.company_email || "",
            company_phone: response.data.company_phone || "",
            company_website: response.data.company_website || "",
            company_address: response.data.company_address || "",
            designation: response.data.designation || "",
            company_description: response.data.company_description || "",
            });

            const logoUrl = response.data.company_logo
            ? `http://127.0.0.1:8000${response.data.company_logo}`
            : "";

            setLogoPreview(logoUrl);

        } catch (error) {
            console.error(error);
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

    const handleLogoChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];

            setCompanyLogo(file);

            setLogoPreview(URL.createObjectURL(file));
        }
        };

    const handleSave = async () => {
        try {
            setSaving(true);

            const data = new FormData();

            Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
            });

            if (companyLogo) {
            data.append("company_logo", companyLogo);
            }

            const response = await api.put(
            "/recruiters/profile/",
            data,
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                "Content-Type": "multipart/form-data",
                },
            }
            );

            setFormData({
            company_name: response.data.company_name || "",
            company_email: response.data.company_email || "",
            company_phone: response.data.company_phone || "",
            company_website: response.data.company_website || "",
            company_address: response.data.company_address || "",
            designation: response.data.designation || "",
            company_description: response.data.company_description || "",
            });

            if (response.data.company_logo) {
            setLogoPreview(
                `http://127.0.0.1:8000${response.data.company_logo}`
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
      <RecruiterSidebar />

      <div className="flex-1">
        <RecruiterNavbar />

        {/* Page */}
        <div className="p-8">

        <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
            My Profile
            </h1>

            <p className="text-gray-500 mt-2">
            View and manage your company information.
            </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold text-gray-700">
                Recruiter Information
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

            {/* Blue Card */}

            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 mb-10 text-white shadow-lg">

            <div className="flex flex-col md:flex-row items-center gap-8">

                {logoPreview ? (
                <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
                ) : (
                <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
                    No Logo
                </div>
                )}

                <div className="flex-1 text-center md:text-left">

                <h2 className="text-3xl font-bold">
                    {formData.company_name}
                </h2>

                <p className="text-blue-100 text-lg mt-2">
                    {formData.designation}
                </p>

                <p className="text-blue-100">
                    👤 {userInfo.first_name || userInfo.username}
                </p>

                <p className="text-blue-100">
                    ✉️ {userInfo.email}
                </p>

                <p className="text-blue-100 mt-2">
                    🌐 {formData.company_website}
                </p>

                {isEditing && (
                    <div className="mt-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="text-sm"
                    />
                    </div>
                )}

                </div>

            </div>

            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mb-6">
                    🏢 Company Information
                    </h2>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                    </label>

                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                        isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Email
                    </label>

                    <input
                        type="email"
                        name="company_email"
                        value={formData.company_email}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                        isEditing
                            ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            : "border border-gray-200 bg-gray-50"
                        }`}
                    />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Phone
                        </label>

                        <input
                            type="text"
                            name="company_phone"
                            value={formData.company_phone}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                            isEditing
                                ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                : "border border-gray-200 bg-gray-50"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Website
                        </label>

                        <input
                            type="url"
                            name="company_website"
                            value={formData.company_website}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                            isEditing
                                ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                : "border border-gray-200 bg-gray-50"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Designation
                        </label>

                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                            isEditing
                                ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                : "border border-gray-200 bg-gray-50"
                            }`}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Address
                        </label>

                        <textarea
                            rows={3}
                            name="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                            isEditing
                                ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                : "border border-gray-200 bg-gray-50"
                            }`}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Description
                        </label>

                        <textarea
                            rows={5}
                            name="company_description"
                            value={formData.company_description}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={`w-full rounded-xl px-4 py-3 transition-all duration-200 ${
                            isEditing
                                ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                : "border border-gray-200 bg-gray-50"
                            }`}
                        />
                    </div>

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

            {/* Form yaha se start hoga */}

        </div>

        </div>

      </div>
    </div>
  );
}

export default RecruiterProfile;
