import { BrevoClient } from "@getbrevo/brevo";
const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });

export class EmailService {
  async sendEmail(email: string, subject: string, html: string) {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: { name: "Smart Finance", email: process.env.BREVO_SENDER_EMAIL! },
      to: [{ email }],
      subject,
      htmlContent: html,
    });
  }
}
