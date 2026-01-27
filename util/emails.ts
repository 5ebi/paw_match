import { Resend } from 'resend';

export const sendVerificationEmail = async (email: string, code: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress = process.env.RESEND_FROM ?? 'onboarding@resend.dev';
  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: 'PawMatch: Verify your email',
    text: `Your verification code is: ${code}`,
  });
};
