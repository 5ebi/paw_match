import { sendEmail } from './mailer';

(async () => {
  try {
    await sendEmail(
      'test@sebastianspeiser.com',
      'Test Email',
      'This is a test email from iCloud SMTP.',
    );
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Error during email test:', error);
  }
})();
