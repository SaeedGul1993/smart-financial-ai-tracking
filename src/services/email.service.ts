import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendEmail(email: string, subject: string, html: string) {
    return resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@budgetly.com",
      to: email,
      subject,
      html,
    });
  }
}
