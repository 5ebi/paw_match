import { Resend } from 'resend';

export const sendVerificationEmail = async (email: string, code: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'verify@pawmatch.xyz',
    to: email,
    subject: 'PawMatch: Verify your email',
    text: `Your verification code is: ${code}`,
  });
};
