import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const sendGlobalNotification = async ({
  title,
  message,
  actorId,
  type,        // "question" | "answer"
  questionId,
  answerId = null
}) => {
  const users = await User.find({ _id: { $ne: actorId } });

  const notifications = users.map(u => ({
    user: u._id,
    title,
    message,
    type,
    questionId,
    answerId,
    isRead: false,
  }));

  await Notification.insertMany(notifications);
};

