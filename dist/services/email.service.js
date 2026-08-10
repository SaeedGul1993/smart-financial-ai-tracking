"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
class EmailService {
    async sendEmail(email, subject, html) {
        return resend.emails.send({
            from: process.env.EMAIL_FROM || "noreply@budgetly.com",
            to: email,
            subject,
            html,
        });
    }
}
exports.EmailService = EmailService;
