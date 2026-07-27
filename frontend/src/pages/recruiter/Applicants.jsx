import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Applicants() {
    const { jobId } = useParams();

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const applicantsPerPage = 5;

    const [applicants, setApplicants] = useState([]);
    const navigate = useNavigate();

    const [jobTitle, setJobTitle] = useState("");
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchApplicants();
        fetchMatches();
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

            console.log("Applicants:", response.data.applications);

            setApplicants(response.data.applications);
            setJobTitle(response.data.job);

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    const fetchMatches = async () => {
        try {

            console.log("Job ID:", jobId);
            console.log("Token:", localStorage.getItem("access"));

            const response = await api.get(
                `/ai/job/${jobId}/matches/`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            console.log("Matches:", response.data.results);

            setMatches(response.data.results);

        } catch (error) {
            console.log(error.response);

            console.log(error.response?.status);

            console.log(error.response?.data);

            console.log(error.config.url);
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

    const filteredApplicants = applicants.filter((applicant) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            applicant.candidate_name.toLowerCase().includes(keyword) ||
            applicant.candidate_email.toLowerCase().includes(keyword);

        const matchesStatus =
            statusFilter === "" ||
            applicant.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const indexOfLastApplicant = currentPage * applicantsPerPage;
    const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;

    const currentApplicants = filteredApplicants.slice(
        indexOfFirstApplicant,
        indexOfLastApplicant
    );

    const totalPages = Math.ceil(
        filteredApplicants.length / applicantsPerPage
    );

    const getMatchData = (candidateId) => {
        return matches.find(
            (match) => match.candidate_id === candidateId
        );
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

            <div className="mt-6 mb-4 flex justify-between items-center">

                <input
                    type="text"
                    placeholder="Search by candidate name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="HIRED">Hired</option>
                </select>

            </div>

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
                        AI Score
                    </th>

                    <th className="text-center px-6 py-4">
                        Rank
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

                    {filteredApplicants.length === 0 ? (

                    <tr>

                        <td
                        colSpan="5"
                        className="text-center py-8 text-gray-500"
                        >
                        No Applicants Found
                        </td>

                    </tr>

                    ) : (

                    currentApplicants.map((applicant) => {
                        const match = getMatchData(applicant.candidate_id);
                        console.log("Applicant Candidate ID:", applicant.candidate_id);
                        console.log("Matched AI:", match);

                        console.log("Applicant:", applicant);
                        console.log("Match:", match);
                        return (

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
                            {match ? `${match.overall_score}%` : "-"}
                        </td>

                        <td className="px-6 py-4 text-center">
                            {match ? `#${match.rank}` : "-"}
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
                                onClick={() =>
                                    navigate(`/recruiter/application/${applicant.id}`)
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                            >
                                Details
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

                    );
                })

                    )}

                </tbody>

                </table>

                <div className="flex justify-between items-center px-6 py-4 border-t">

                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="font-medium">
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>

            </div>

            </div>

      </div>

    </div>
  );
}

export default Applicants;
