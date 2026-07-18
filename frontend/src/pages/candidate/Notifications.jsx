import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get(
            "/notifications/",
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            }
            );

            setNotifications(response.data.notifications);

        } catch (error) {
            console.error(error);

            if (error.response) {
            alert(
                error.response.data.message ||
                JSON.stringify(error.response.data)
            );
            } else {
            alert("Failed to load notifications.");
            }

        } finally {
            setLoading(false);
        }
        };

    const markAsRead = async (notificationId) => {
        try {
            await api.patch(
            `/notifications/${notificationId}/read/`,
            {},
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            }
            );

            // UI update without page refresh
            setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === notificationId
                ? { ...notification, is_read: true }
                : notification
            )
            );

        } catch (error) {
            console.error(error);

            if (error.response) {
            alert(
                error.response.data.message ||
                JSON.stringify(error.response.data)
            );
            } else {
            alert("Failed to update notification.");
            }
        }
        };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
            Loading notifications...
            </div>
        );
    }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            View all your notifications.
          </p>

          <div className="mt-8 grid gap-4">

            {notifications.length === 0 ? (

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-700">
                    No Notifications
                </h2>

                <p className="text-gray-500 mt-2">
                    You don't have any notifications yet.
                </p>
                </div>

            ) : (

                notifications.map((notification) => (

                <div
                    key={notification.id}
                    className={`rounded-xl shadow-lg p-6 border-l-4 ${
                    notification.is_read
                        ? "bg-white border-gray-300"
                        : "bg-blue-50 border-blue-600"
                    }`}
                >

                    <div className="flex justify-between items-start">

                    <div>

                        <h2 className="text-lg font-bold text-gray-800">
                        {notification.title}
                        </h2>

                        <p className="text-gray-600 mt-2">
                        {notification.message}
                        </p>

                        <p className="text-sm text-gray-400 mt-3">
                        {new Date(notification.created_at).toLocaleString()}
                        </p>

                    </div>

                    {!notification.is_read && (
                        <button
                            onClick={() => markAsRead(notification.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                        >
                            Mark as Read
                        </button>
                        )}

                    </div>

                </div>

                ))

            )}

            </div>

        </div>

      </div>

    </div>
  );
}

export default Notifications;
