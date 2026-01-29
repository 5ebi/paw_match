import 'dotenv/config';
import { sendVerificationEmail, sendWelcomeEmail } from '../util/emails';

function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function testEmails() {
  try {
    console.log('Starting email tests...\n');

    const verificationCode = generateSixDigitCode();
    const testEmail = 'sebi.speiser@gmx.net'; // Change to your email
    const testName = 'Sebastian';

    console.log(`📧 Sending emails to: ${testEmail}`);
    console.log(`🔐 Using verification code: ${verificationCode}\n`);

    console.log('1️⃣  Testing verification email...');
    await sendVerificationEmail(testEmail, verificationCode);
    console.log('   ✓ Verification email sent successfully\n');

    console.log('⏳ Waiting 3 seconds before sending welcome email...\n');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('2️⃣  Testing welcome email...');
    await sendWelcomeEmail(testName, testEmail);
    console.log('   ✓ Welcome email sent successfully\n');

    console.log('✨ Test completed successfully!\n');
    console.log('💡 Check your inbox at:', testEmail);
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testEmails().catch(console.error);
