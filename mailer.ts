import 'dotenv/config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded');

// Transporter für Gmail SMTP einrichten
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
  logger: true,
} as SMTPTransport.Options);

// E-Mail senden Funktion
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Paw Match" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log('Email sent: ', info.response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error sending email:', error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }
    throw error;
  }
};

// Test-Funktion
const testEmail = async (): Promise<void> => {
  try {
    await sendEmail(
      'sebastian.hunkeler@gmx.at', // Ersetze dies mit deiner E-Mail-Adresse
      'Test Email',
      'This is a test email sent via Gmail SMTP!',
    );
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
};

// Führe den Test aus und handle Promise-Fehler korrekt
void testEmail().catch((error) => {
  console.error('Top-level error:', error);
  process.exit(1);
});
