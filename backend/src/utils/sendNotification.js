import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const sendGlobalNotification = async ({
  title,
  message,
  link,
  actorId,
  questionId,
}) => {
  const users = await User.find({ _id: { $ne: actorId } });

  const notifications = users.map((u) => ({
    user: u._id,
    title,
    message,
    link,
    questionId: questionId,
    isRead: false,
  }));

  await Notification.insertMany(notifications);
};
