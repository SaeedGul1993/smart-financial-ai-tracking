import { messaging } from "../config/firebase-admin";

export class PushNotificationService {
  async sendToToken(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data ?? {},
      webpush: {
        notification: {
          title,
          body,
        },
      },
    };
    console.log("enter--->", message);
    const response = await messaging.send(message);
    console.log("FCM message sent:", response);
    return response;
  }
}
