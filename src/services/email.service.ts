// import { Resend } from "resend";
import nodemailer from "nodemailer";

// const resend = new Resend(process.env.RESEND_API_KEY);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});
export class EmailService {
  async sendEmail(email: string, subject: string, html: string) {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html,
    });
  }
}

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export class EmailService {
//   async sendEmail(email: string, subject: string, html: string) {
//     return resend.emails.send({
//       from: process.env.EMAIL_FROM || "noreply@budgetly.com",
//       to: email,
//       subject,
//       html,
//     });
//   }
// }
