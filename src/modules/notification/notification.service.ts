import { NotificationRepository } from "./notification.repository";
import { createNotificationInputs } from "./notification.types";

const notificationRepository = new NotificationRepository();

export const createNotificationService = async (
  data: createNotificationInputs,
) => {
  return await notificationRepository.create(data);
};

export const markedAsReadService = async (
  userId: string,
  notificationId: string,
) => {
  return await notificationRepository.markedAsRead(userId, notificationId);
};

export const markedAllAsReadService = async (userId: string) => {
  return await notificationRepository.markedAllAsRead(userId);
};

export const unReadNotificationCountService = async (userId: string) => {
  return await notificationRepository.countUnread(userId);
};
