import nodemailer from 'nodemailer';
import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // Use true for port 465, false for all other ports
    auth: {
        user: "khushaalsareen@gmail.com",
        pass: process.env.PASS,
    },
});

// Alternative configuration for other SMTP providers
// const transporter = nodemailer.createTransporter({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT || '587'),
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            html: htmlContent.replace("{verificationToken}", verificationToken)
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', result.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send email verification");
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const htmlContent = generateWelcomeEmailHtml(name);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to PatelEats',
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', result.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    try {
        const htmlContent = generatePasswordResetEmailHtml(resetURL);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your password',
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', result.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to reset password");
    }
};

export const sendResetSuccessEmail = async (email: string) => {
    try {
        const htmlContent = generateResetSuccessEmailHtml();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Successfully',
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset success email sent:', result.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset success email");
    }
};