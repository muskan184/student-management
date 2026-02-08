import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyNotifications,
  markNotificationRead,
} from "../api/notificationApi";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  MessageSquare,
  CheckCircle,
  Star,
  AlertCircle,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const load = async () => {
    try {
      const data = await fetchMyNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClick = async (n) => {
    await markNotificationRead(n._id);

    if (user.role === "student") {
      navigate(`/student/forum/${n.questionId}`);
    } else if (user.role === "teacher") {
      navigate(`/teacher/question/${n.questionId}`);
    } else {
      navigate("/");
    }
  };

  const getNotificationIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("answer")) return MessageSquare;
    if (titleLower.includes("best")) return Star;
    if (titleLower.includes("important")) return AlertCircle;
    return Bell;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 rounded-full mx-auto mb-4">
            <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          </div>
          <p className="text-gray-600">Stay updated with your activities</p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {notifications.filter((n) => !n.isRead).length}
                </div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {notifications.filter((n) => !n.isRead).length > 0
                ? `${
                    notifications.filter((n) => !n.isRead).length
                  } new notifications`
                : "All caught up!"}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You're all caught up! New notifications will appear here when
                you have updates.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = getNotificationIcon(n.title);
              const isUnread = !n.isRead;

              return (
                <div
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
                    isUnread ? "border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          isUnread
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4
                              className={`font-medium text-gray-900 ${
                                isUnread ? "font-semibold" : ""
                              }`}
                            >
                              {n.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {n.message}
                            </p>
                          </div>

                          {isUnread && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(n.createdAt)}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {isUnread ? (
                              <div className="flex items-center space-x-1 text-blue-600 text-sm">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                <span>New</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                                <CheckCircle className="w-3 h-3" />
                                <span>Read</span>
                              </div>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Unread notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Read notifications</span>
                </div>
              </div>

              <div>
                Showing {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
