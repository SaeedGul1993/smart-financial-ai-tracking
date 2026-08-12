import prisma from "../../config/database";
import { createNotificationInputs } from "./notification.types";

export class NotificationRepository {
  async create(data: createNotificationInputs) {
    return await prisma.notification.create({
      data,
    });
  }
  async findByUserId(userId: string, skip: number, limit: number) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });
  }

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
  async markedAsRead(userId: string, notificationId: string) {
    return await prisma.notification.update({
      where: { userId, id: notificationId },
      data: {
        isRead: true,
      },
    });
  }
  async markedAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
      },
    });
  }
}
