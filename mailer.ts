import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Transporter für iCloud SMTP einrichten
const transporter = nodemailer.createTransport<SMTPTransport.Options>({
  host: process.env.SMTP_HOST, // iCloud SMTP server
  port: parseInt(process.env.SMTP_PORT || '587', 10), // Ensure the port is a number
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // Enforce IPv4
  debug: true, // Enable debugging
  logger: true, // Log SMTP communication
});

// E-Mail senden Funktion
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Absenderadresse
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
