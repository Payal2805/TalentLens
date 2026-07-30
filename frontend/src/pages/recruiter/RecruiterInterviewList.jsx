import { useEffect, useState } from "react";
import RecruiterNavbar from "../../components/layout/RecruiterNavbar";
import RecruiterSidebar from "../../components/layout/RecruiterSidebar";
import api from "../../services/api";

function RecruiterInterviewList() {

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [modeFilter, setModeFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const response = await api.get(
                "/jobs/recruiter/interviews/",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            setInterviews(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateInterviewStatus = async (id, status) => {

        try {

            await api.patch(
                `/jobs/interviews/${id}/status/`,
                {
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            alert("Interview status updated.");

            fetchInterviews();

        } catch (error) {

            console.error(error);

            alert("Failed to update interview status.");

        }

    };

    const exportCSV = async () => {

        try {

            const response = await api.get(
                "/jobs/recruiter/interviews/export/",
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "interviews.csv");

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch (error) {

            console.error(error);

            alert("Failed to export CSV.");

        }
    };

    const filteredInterviews = interviews.filter((item) => {

        const matchesSearch =
            item.candidate_name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "" ||
            item.status === statusFilter;

        const matchesMode =
            modeFilter === "" ||
            item.interview_mode === modeFilter;

        const matchesDate =
            dateFilter === "" ||
            item.interview_date === dateFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesMode &&
            matchesDate
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">

            <RecruiterSidebar />

            <div className="flex-1">

                <RecruiterNavbar />

                <div className="p-8">

                    <div className="flex justify-between items-center mb-6">

                        <h1 className="text-3xl font-bold">
                            Interview Schedule
                        </h1>

                        <button
                            onClick={exportCSV}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                        >
                            Export CSV
                        </button>

                    </div>

                    <div className="bg-white rounded-xl shadow p-5 mb-6">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                            {/* Search */}

                            <input
                                type="text"
                                placeholder="Search Candidate..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            />

                            {/* Status Filter */}

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="">All Status</option>
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>

                            {/* Mode Filter */}

                            <select
                                value={modeFilter}
                                onChange={(e) => setModeFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="">All Mode</option>
                                <option value="ONLINE">Online</option>
                                <option value="OFFLINE">Offline</option>
                            </select>

                            {/* Date Filter */}

                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            />

                        </div>

                    </div>

                    <div className="bg-white rounded-xl shadow overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-indigo-600 text-white">

                                <tr>

                                    <th className="p-4">Candidate</th>

                                    <th className="p-4">Job</th>

                                    <th className="p-4">Date</th>

                                    <th className="p-4">Time</th>

                                    <th className="p-4">Mode</th>

                                    <th className="p-4">Status</th>

                                    <th className="p-4">Meeting</th>

                                    <th className="p-4">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredInterviews.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center py-10 text-gray-500"
                                        >
                                            No Interviews Scheduled
                                        </td>

                                    </tr>

                                ) : (

                                filteredInterviews.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-4">

                                            <div className="font-semibold">
                                                {item.candidate_name}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                {item.candidate_email}
                                            </div>

                                        </td>

                                        <td className="p-4">
                                            {item.job_title}
                                        </td>

                                        <td className="p-4">
                                            {item.interview_date}
                                        </td>

                                        <td className="p-4">
                                            {item.interview_time}
                                        </td>

                                        <td className="p-4">

                                            <span
                                            className={`px-3 py-1 rounded-full text-sm
                                            ${
                                            item.interview_mode === "ONLINE"
                                            ? "bg-indigo-100 text-indigo-700"
                                            : "bg-orange-100 text-orange-700"
                                            }`}
                                            >

                                            {item.interview_mode}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold
                                            ${
                                            item.status === "SCHEDULED"
                                            ? "bg-blue-100 text-blue-700"
                                            : item.status === "COMPLETED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                            >

                                            {item.status}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            {item.meeting_link ? (

                                                <a
                                                    href={item.meeting_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    Join
                                                </a>

                                            ) : (

                                                <span className="text-gray-400">

                                                    -

                                                </span>

                                            )}

                                        </td>

                                        <td className="p-4">

                                            {item.status === "SCHEDULED" ? (

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            updateInterviewStatus(item.id, "COMPLETED")
                                                        }
                                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Complete
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            updateInterviewStatus(item.id, "CANCELLED")
                                                        }
                                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            ) : (

                                                <span className="text-gray-400">
                                                    No Action
                                                </span>

                                            )}

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

export default RecruiterInterviewList;
