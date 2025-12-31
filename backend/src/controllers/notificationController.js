import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50); // last 50 notifications only (performance)

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // user security
      { isRead: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};
