import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import api from "../../services/api";

function CandidateDetails() {
    const { applicationId } = useParams();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [interviewData, setInterviewData] = useState({
        interview_date: "",
        interview_time: "",
        interview_mode: "ONLINE",
        meeting_link: "",
        notes: "",
    });

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

            console.log(JSON.stringify(response.data, null, 2));

            setData(response.data);
            fetchAIResult(
                response.data.job_id,
                response.data.candidate.id
            );

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAIResult = async (jobId, candidateId) => {
        try {
            const response = await api.get(
                `/ai/job/${jobId}/matches/`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            const candidateAI = response.data.results.find(
                (item) => item.candidate_id === candidateId
            );

            console.log(JSON.stringify(candidateAI, null, 2));

            setAiResult(candidateAI);

        } catch (error) {
            console.error(error);
        }
    };

    const updateStatus = async (status) => {

        try {

            await api.patch(
                `/jobs/applications/${applicationId}/status/`,
                {
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            alert("Status Updated Successfully");

            fetchDetails();

        } catch (error) {

            console.error(error);

            alert("Failed to update status.");

        }
    };

    const scheduleInterview = async () => {
        try {

            await api.post(
                "/jobs/interviews/schedule/",
                {
                    application: applicationId,
                    ...interviewData,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            alert("Interview Scheduled Successfully");

            setShowInterviewModal(false);

            setInterviewData({
                interview_date: "",
                interview_time: "",
                interview_mode: "ONLINE",
                meeting_link: "",
                notes: "",
            });

        } catch (error) {
            console.log(error.response);
            console.log(error.response?.data);
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


                            {aiResult && (                             
                                <div className="col-span-2 mt-8 border-t pt-6">

                                    <h2 className="text-2xl font-bold mb-4 text-blue-700">
                                        AI Resume Analysis
                                    </h2>

                                    {/* Match Badge */}
                                    <div className="col-span-2 mb-6">

                                        <div
                                            className={`rounded-xl p-5 text-center font-bold text-xl
                                            ${
                                                aiResult.overall_score >= 90
                                                    ? "bg-green-100 text-green-700"
                                                    : aiResult.overall_score >= 70
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >

                                            {aiResult.overall_score >= 90
                                                ? "🟢 Excellent Match"
                                                : aiResult.overall_score >= 70
                                                ? "🟡 Good Match"
                                                : "🔴 Weak Match"}

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4">

                                        <div className="bg-blue-50 p-4 rounded-lg shadow">
                                            <p className="text-gray-500">Overall Score</p>

                                            <h2 className="text-3xl font-bold text-blue-700">
                                                {aiResult.overall_score}%
                                            </h2>

                                            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                                                <div
                                                    className="bg-blue-600 h-3 rounded-full"
                                                    style={{ width: `${aiResult.overall_score}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg shadow">
                                            <p className="text-gray-500">Skill Score</p>

                                            <h2 className="text-3xl font-bold text-green-700">
                                                {aiResult.skill_score}%
                                            </h2>

                                            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                                                <div
                                                    className="bg-green-600 h-3 rounded-full"
                                                    style={{ width: `${aiResult.skill_score}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-4 rounded-lg shadow">
                                            <p className="text-gray-500">Experience Score</p>

                                            <h2 className="text-3xl font-bold text-yellow-700">
                                                {aiResult.experience_score}%
                                            </h2>

                                            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                                                <div
                                                    className="bg-yellow-500 h-3 rounded-full"
                                                    style={{ width: `${aiResult.experience_score}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg shadow">
                                            <p className="text-gray-500">Rank</p>
                                            <h2 className="text-3xl font-bold text-purple-700">
                                                #{aiResult.rank}
                                            </h2>
                                        </div>

                                        <div className="col-span-2 bg-gray-50 rounded-lg shadow p-5">
                                            <p className="text-gray-500 mb-3">
                                                Application Status
                                            </p>

                                            <span
                                                className={`inline-block px-5 py-2 rounded-full font-bold text-sm
                                                ${
                                                    aiResult.application_status === "HIRED"
                                                        ? "bg-green-100 text-green-700"
                                                        : aiResult.application_status === "SHORTLISTED"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : aiResult.application_status === "REJECTED"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {aiResult.application_status}
                                            </span>
                                        </div>


                                    </div>

                                    <div className="col-span-2 bg-indigo-50 rounded-lg shadow p-5">

                                        <p className="text-lg font-bold text-indigo-700 mb-3">
                                            AI Recommendation
                                        </p>

                                        <p className="text-gray-700">
                                            {aiResult?.overall_score >= 90
                                                ? "Highly Recommended for Interview and Hiring."
                                                : aiResult?.overall_score >= 70
                                                ? "Good Candidate. Recommended for Technical Interview."
                                                : "Candidate needs improvement. Not recommended at this stage."}
                                        </p>

                                    </div>

                                </div>
                            )}


                            <div className="col-span-2 flex gap-4 mt-8">

                                <button
                                    onClick={() => updateStatus("SHORTLISTED")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Shortlist
                                </button>

                                <button
                                    onClick={() => updateStatus("REJECTED")}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() => updateStatus("HIRED")}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Hire
                                </button>

                                <button
                                    onClick={() => {
                                        console.log("Button clicked");
                                        setShowInterviewModal(true);
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Schedule Interview
                                </button>

                            </div>

                            {showInterviewModal && (

                                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

                                    <div className="bg-white p-8 rounded-xl w-[500px]">

                                        <h2 className="text-2xl font-bold mb-6">
                                            Schedule Interview
                                        </h2>

                                        <input
                                            type="date"
                                            className="w-full border p-3 rounded mb-4"
                                            value={interviewData.interview_date}
                                            onChange={(e)=>
                                                setInterviewData({
                                                    ...interviewData,
                                                    interview_date:e.target.value
                                                })
                                            }
                                        />

                                        <input
                                            type="time"
                                            className="w-full border p-3 rounded mb-4"
                                            value={interviewData.interview_time}
                                            onChange={(e)=>
                                                setInterviewData({
                                                    ...interviewData,
                                                    interview_time:e.target.value
                                                })
                                            }
                                        />

                                        <select
                                            className="w-full border p-3 rounded mb-4"
                                            value={interviewData.interview_mode}
                                            onChange={(e) =>
                                                setInterviewData({
                                                    ...interviewData,
                                                    interview_mode: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="ONLINE">Online</option>
                                            <option value="OFFLINE">Offline</option>
                                        </select>

                                        {interviewData.interview_mode === "ONLINE" && (
                                            <input
                                                type="text"
                                                placeholder="Meeting Link"
                                                className="w-full border p-3 rounded mb-4"
                                                value={interviewData.meeting_link}
                                                onChange={(e) =>
                                                    setInterviewData({
                                                        ...interviewData,
                                                        meeting_link: e.target.value,
                                                    })
                                                }
                                            />
                                        )}

                                        <textarea
                                            placeholder="Notes"
                                            className="w-full border p-3 rounded mb-6"
                                            value={interviewData.notes}
                                            onChange={(e)=>
                                                setInterviewData({
                                                    ...interviewData,
                                                    notes:e.target.value
                                                })
                                            }
                                        />

                                        <div className="flex justify-end gap-3">

                                            <button
                                                onClick={() => setShowInterviewModal(false)}
                                                className="bg-gray-500 text-white px-5 py-2 rounded"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={scheduleInterview}
                                                className="bg-purple-600 text-white px-5 py-2 rounded"
                                            >
                                                Schedule
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CandidateDetails;
