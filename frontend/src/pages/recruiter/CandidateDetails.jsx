import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import api from "../../services/api";

function CandidateDetails() {
    const { applicationId } = useParams();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await api.get(
                `/jobs/applications/${applicationId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            setData(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load candidate details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Candidate not found.
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">

            <RecruiterSidebar />

            <div className="flex-1">

                <RecruiterNavbar />

                <div className="p-8">

                    <h1 className="text-3xl font-bold mb-6">
                        Candidate Details
                    </h1>

                    <div className="bg-white rounded-xl shadow p-8">

                        <div className="grid grid-cols-2 gap-6">

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Name
                                </p>

                                <p>{data.candidate.name}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Email
                                </p>

                                <p>{data.candidate.email}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Phone
                                </p>

                                <p>{data.candidate.phone}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Status
                                </p>

                                <p>{data.status}</p>
                            </div>

                            <div className="col-span-2">
                                <p className="font-semibold text-gray-600">
                                    Address
                                </p>

                                <p>{data.candidate.address}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Education
                                </p>

                                <p>{data.candidate.education}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Experience
                                </p>

                                <p>
                                    {data.candidate.experience} Years
                                </p>
                            </div>

                            <div className="col-span-2">
                                <p className="font-semibold text-gray-600">
                                    Skills
                                </p>

                                <p>{data.candidate.skills}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    LinkedIn
                                </p>

                                {data.candidate.linkedin ? (
                                    <a
                                        href={data.candidate.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Open LinkedIn
                                    </a>
                                ) : (
                                    <p>Not Available</p>
                                )}
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    GitHub
                                </p>

                                {data.candidate.github ? (
                                    <a
                                        href={data.candidate.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Open GitHub
                                    </a>
                                ) : (
                                    <p>Not Available</p>
                                )}
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Portfolio
                                </p>

                                {data.candidate.portfolio ? (
                                    <a
                                        href={data.candidate.portfolio}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Open Portfolio
                                    </a>
                                ) : (
                                    <p>Not Available</p>
                                )}
                            </div>

                            <div>
                                <p className="font-semibold text-gray-600">
                                    Resume
                                </p>

                                <button
                                    onClick={() =>
                                        window.open(
                                            `http://127.0.0.1:8000${data.resume.file}`,
                                            "_blank"
                                        )
                                    }
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                                >
                                    View Resume
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CandidateDetails;
