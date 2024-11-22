import 'dotenv/config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded');

// Transporter für Gmail SMTP einrichten
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail-Service verwenden
  auth: {
    user: process.env.EMAIL_USER, // Deine Gmail-Adresse
    pass: process.env.EMAIL_PASS, // Dein Gmail-App-Passwort
  },
  debug: true, // Debug-Logs aktivieren
  logger: true, // SMTP-Kommunikation protokollieren
} as SMTPTransport.Options);

// E-Mail senden Funktion
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Paw Match" <${process.env.EMAIL_USER}>`, // Absendername und -adresse
      to, // Empfängeradresse
      subject, // Betreff
      text, // Nachrichtentext
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

(async () => {
  try {
    await sendEmail(
      'test@example.com', // Ersetze durch deine eigene E-Mail-Adresse
      'Test Email',
      'This is a test email sent via Gmail SMTP!',
    );
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
})();
