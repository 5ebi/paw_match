// import 'dotenv/config';
// import {
//   sendVerificationEmail,
//   sendVerificationReminderEmail,
// } from '../util/emails';

// function generateSixDigitCode(): string {
//   // Generiert eine Zufallszahl zwischen 100000 und 999999
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// async function testEmails() {
//   try {
//     console.log('Starting email tests...');

//     // Generate a 6-digit verification code
//     const verificationCode = generateSixDigitCode();
//     const testEmail = 'sebi.speiser@gmx.net';

//     console.log(`Sending emails to: ${testEmail}`);
//     console.log(`Using verification code: ${verificationCode}`);

//     console.log('Testing initial verification email...');
//     await sendVerificationEmail(testEmail, verificationCode);
//     console.log('✓ Initial verification email sent successfully');

//     // Wait 5 seconds before sending the reminder
//     console.log('Waiting 5 seconds before sending reminder...');
//     await new Promise((resolve) => setTimeout(resolve, 5000));

//     console.log('Testing reminder email...');
//     await sendVerificationReminderEmail(testEmail, verificationCode);
//     console.log('✓ Reminder email sent successfully');

//     console.log('\nTest completed successfully! ✨');
//   } catch (error) {
//     console.error('Error during test:', error);
//   }
// }

// // Run the test
// testEmails().catch(console.error);
