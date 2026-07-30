import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import api from "../../services/api";

function CandidateInterviewDashboard() {

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("NEWEST");

    useEffect(() => {
        fetchInterviews();
    }, []);

    const upcomingCount = interviews.filter(
        (i) => i.status === "SCHEDULED"
    ).length;

    const completedCount = interviews.filter(
        (i) => i.status === "COMPLETED"
    ).length;

    const cancelledCount = interviews.filter(
        (i) => i.status === "CANCELLED"
    ).length;

    const nextInterview = interviews.find(
        (i) => i.status === "SCHEDULED"
    );

    const filteredInterviews = interviews.filter((item) => {

        const matchesFilter =
            filter === "ALL" || item.status === filter;

        const matchesSearch =
            item.job_title.toLowerCase().includes(search.toLowerCase()) ||
            item.recruiter.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesSearch;

    });

    const sortedInterviews = [...filteredInterviews].sort((a, b) => {

        const dateA = new Date(`${a.interview_date} ${a.interview_time}`);
        const dateB = new Date(`${b.interview_date} ${b.interview_time}`);

        return sortOrder === "NEWEST"
            ? dateB - dateA
            : dateA - dateB;

    });

    const fetchInterviews = async () => {

        try {

            const response = await api.get(
                "/jobs/my-interviews/",
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

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };

    const formatTime = (time) => {

        const today = new Date();

        const date = new Date(`${today.toDateString()} ${time}`);

        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    };

    if (loading) {

        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading...
            </div>
        );

    }

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <div className="p-8">

                    <h1 className="text-3xl font-bold mb-6">
                        My Interviews
                    </h1>

                    <div className="grid md:grid-cols-3 gap-5 mb-8">

                        <div className="bg-blue-100 rounded-xl p-6 shadow">

                            <p className="text-gray-600">
                                Upcoming
                            </p>

                            <h2 className="text-3xl font-bold text-blue-700">
                                {upcomingCount}
                            </h2>

                        </div>

                        <div className="bg-green-100 rounded-xl p-6 shadow">

                            <p className="text-gray-600">
                                Completed
                            </p>

                            <h2 className="text-3xl font-bold text-green-700">
                                {completedCount}
                            </h2>

                        </div>

                        <div className="bg-red-100 rounded-xl p-6 shadow">

                            <p className="text-gray-600">
                                Cancelled
                            </p>

                            <h2 className="text-3xl font-bold text-red-700">
                                {cancelledCount}
                            </h2>

                        </div>

                    </div>

                    {nextInterview && (

                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6 mb-8">

                            <h2 className="text-2xl font-bold mb-5">
                                🎯 Your Next Interview
                            </h2>

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>

                                    <p className="text-indigo-200">
                                        Job Title
                                    </p>

                                    <h3 className="text-xl font-bold">
                                        {nextInterview.job_title}
                                    </h3>

                                </div>

                                <div>

                                    <p className="text-indigo-200">
                                        Recruiter
                                    </p>

                                    <h3 className="text-xl font-bold">
                                        {nextInterview.recruiter}
                                    </h3>

                                </div>

                                <div>

                                    <p className="text-indigo-200">
                                        Date
                                    </p>

                                    <h3>
                                        {formatDate(nextInterview.interview_date)}
                                    </h3>

                                </div>

                                <div>

                                    <p className="text-indigo-200">
                                        Time
                                    </p>

                                    <h3>
                                        {formatTime(nextInterview.interview_time)}
                                    </h3>

                                </div>

                                <div>

                                    <p className="text-indigo-200">
                                        Mode
                                    </p>

                                    <h3>
                                        {nextInterview.interview_mode}
                                    </h3>

                                </div>

                            </div>

                            {nextInterview.interview_mode === "ONLINE" &&
                                nextInterview.meeting_link && (

                                <a
                                    href={nextInterview.meeting_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-6 bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
                                >
                                    Join Meeting
                                </a>

                            )}

                        </div>

                    )}

                    

                    {/* Search Box */}

                    <div className="mb-6">

                        <input
                            type="text"
                            placeholder="Search by Job Title or Recruiter..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end mb-6">

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border rounded-lg p-3 shadow-sm"
                        >

                            <option value="NEWEST">
                                Newest First
                            </option>

                            <option value="OLDEST">
                                Oldest First
                            </option>

                        </select>

                    </div>

                    <div className="flex gap-3 mb-6 flex-wrap">

                        {/* Filter Buttons */}

                        <button
                            onClick={() => setFilter("ALL")}
                            className={`px-5 py-2 rounded-lg ${
                                filter === "ALL"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white border"
                            }`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setFilter("SCHEDULED")}
                            className={`px-5 py-2 rounded-lg ${
                                filter === "SCHEDULED"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border"
                            }`}
                        >
                            Upcoming
                        </button>

                        <button
                            onClick={() => setFilter("COMPLETED")}
                            className={`px-5 py-2 rounded-lg ${
                                filter === "COMPLETED"
                                    ? "bg-green-600 text-white"
                                    : "bg-white border"
                            }`}
                        >
                            Completed
                        </button>

                        <button
                            onClick={() => setFilter("CANCELLED")}
                            className={`px-5 py-2 rounded-lg ${
                                filter === "CANCELLED"
                                    ? "bg-red-600 text-white"
                                    : "bg-white border"
                            }`}
                        >
                            Cancelled
                        </button>

                    </div>

                    {filteredInterviews.length === 0 ? (

                        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
                            No Interviews Scheduled Yet.
                        </div>

                    ) : (

                        <div className="grid gap-6">

                            {sortedInterviews.map((item) => (

                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow p-6"
                                >

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <h2 className="text-xl font-bold">
                                                {item.job_title}
                                            </h2>

                                            <p className="text-gray-500">
                                                Recruiter: {item.recruiter}
                                            </p>

                                        </div>

                                        <span
                                            className={`px-4 py-2 rounded-full text-sm font-semibold
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

                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6">

                                        <div>

                                            <p className="text-gray-500">
                                                Interview Date
                                            </p>

                                            <p className="font-semibold">
                                                {formatDate(item.interview_date)}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-gray-500">
                                                Interview Time
                                            </p>

                                            <p className="font-semibold">
                                                {formatTime(item.interview_time)}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-gray-500">
                                                Mode
                                            </p>

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

                                        </div>

                                    </div>

                                    {item.notes && (

                                        <div className="mt-6">

                                            <p className="text-gray-500">
                                                Notes
                                            </p>

                                            <p>
                                                {item.notes}
                                            </p>

                                        </div>

                                    )}

                                    {item.interview_mode === "ONLINE" &&
                                        item.meeting_link && (

                                        <div className="mt-6">

                                            <a
                                                href={item.meeting_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg inline-block"
                                            >
                                                Join Meeting
                                            </a>

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}

export default CandidateInterviewDashboard;
