import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = process.env.RESEND_FROM ?? 'onboarding@resend.dev';
const appBaseUrl = process.env.APP_BASE_URL ?? 'http://localhost:8081';

export const sendVerificationEmail = async (email: string, code: string) => {
  const verificationLink = `${appBaseUrl}/verify?code=${code}`;

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: '🐾 Verify your PawMatch email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to PawMatch! 🐾</h2>
        <p>Please verify your email to complete your registration.</p>
        <p>Your verification code is:</p>
        <h1 style="color: #515a47; letter-spacing: 5px;">${code}</h1>
        <p>Or click the link below:</p>
        <a href="${verificationLink}" style="background-color: #515a47; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p style="color: #666; margin-top: 30px; font-size: 12px;">This code expires in 24 hours.</p>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const sendWelcomeEmail = async (name: string, email: string) => {
  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: '🐾 Welcome to PawMatch',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome, ${name}! 🐾</h2>
        <p>Your email has been verified successfully.</p>
        <p>You can now log in and start finding playmates for your dog!</p>
        <a href="${appBaseUrl}/login" style="background-color: #515a47; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Login</a>
        <p style="color: #666; margin-top: 30px; font-size: 12px;">Happy matching! 🐶</p>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
) => {
  const resetLink = `${appBaseUrl}/resetpassword?token=${resetToken}`;

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: '🐾 Reset your PawMatch password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request 🐾</h2>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        <a href="${resetLink}" style="background-color: #515a47; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p style="color: #666; margin-top: 30px; font-size: 12px;">This link expires in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
};
