import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyNotifications,
  markNotificationRead,
} from "../api/notificationApi";
import { useAuth } from "../context/AuthContext";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const load = async () => {
    const data = await fetchMyNotifications();
    setNotifications(data.notifications);
  };

  useEffect(() => {
    load();
  }, []);

  const handleClick = async (n) => {
    // 1️⃣ mark as read

    await markNotificationRead(n._id);

    // 2️⃣ redirect based on role
    if (user.role === "student") {
      navigate(`/student/forum/${n.questionId}`);
      console.log(n.questionId);
    } else if (user.role === "teacher") {
      navigate(`/teacher/question/${n.questionId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleClick(n)}
            className={`p-4 mb-2 rounded cursor-pointer shadow ${
              n.isRead ? "bg-white" : "bg-blue-100"
            }`}
          >
            <h4 className="font-semibold">{n.title}</h4>
            <p className="text-sm text-gray-600">{n.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
