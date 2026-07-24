import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

function Applicants() {
    const { jobId } = useParams();

    const [loading, setLoading] = useState(true);

    const [applicants, setApplicants] = useState([]);

    const [jobTitle, setJobTitle] = useState("");

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {

            const response = await api.get(
                `/jobs/recruiter/jobs/${jobId}/applicants/`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            setApplicants(response.data.applications);
            setJobTitle(response.data.job);

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, status) => {
        try {
            const response = await api.patch(
            `/jobs/applications/${applicationId}/status/`,
            { status },
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            }
            );

            alert(response.data.message);

            fetchApplicants();

        } catch (error) {
            console.error(error);

            if (error.response) {
            alert(JSON.stringify(error.response.data));
            } else {
            alert("Failed to update status.");
            }
        }
        };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading Applicants...
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
                Applicants
            </h1>

            <p className="text-gray-500 mt-2">
                Job: <span className="font-semibold">{jobTitle}</span>
            </p>

            <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                    <th className="text-left px-6 py-4">
                        Candidate
                    </th>

                    <th className="text-left px-6 py-4">
                        Email
                    </th>

                    <th className="text-center px-6 py-4">
                        Status
                    </th>

                    <th className="text-center px-6 py-4">
                        Applied On
                    </th>

                    <th className="text-center px-6 py-4">
                        Actions
                    </th>

                    </tr>

                </thead>

                <tbody>

                    {applicants.length === 0 ? (

                    <tr>

                        <td
                        colSpan="5"
                        className="text-center py-8 text-gray-500"
                        >
                        No Applicants Found
                        </td>

                    </tr>

                    ) : (

                    applicants.map((applicant) => (

                        <tr
                        key={applicant.id}
                        className="border-t hover:bg-gray-50"
                        >

                        <td className="px-6 py-4">
                            {applicant.candidate_name}
                        </td>

                        <td className="px-6 py-4">
                            {applicant.candidate_email}
                        </td>

                        <td className="px-6 py-4 text-center">

                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                            {applicant.status}

                            </span>

                        </td>

                        <td className="px-6 py-4 text-center">

                            {new Date(
                            applicant.applied_at
                            ).toLocaleDateString()}

                        </td>

                        <td className="px-6 py-4">

                            <div className="flex justify-center gap-2">

                            <button
                                onClick={() =>
                                    window.open(
                                    `http://127.0.0.1:8000${applicant.resume_file}`,
                                    "_blank"
                                    )
                                }
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg"
                                >
                                Resume
                            </button>

                            <button
                                onClick={() => updateStatus(applicant.id, "SHORTLISTED")}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                                >
                                Shortlist
                            </button>

                            <button
                                onClick={() => updateStatus(applicant.id, "REJECTED")}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                            >
                                Reject
                            </button>

                            <button
                                onClick={() => updateStatus(applicant.id, "HIRED")}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg"
                                >
                                Hire
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

export default Applicants;
