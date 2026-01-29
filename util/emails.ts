import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = process.env.RESEND_FROM ?? 'onboarding@resend.dev';

// PawMatch Brand Colors
const colors = {
  primary: '#515a47', // green
  accent: '#e9b44c', // yellow/gold
  brown: '#7a4419',
  background: '#fff0e3', // warm white
  text: '#400406', // dark brown/black
  textLight: '#755c1b',
};

// Email Base Template
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PawMatch</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: ${colors.background}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.brown} 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: ${colors.accent}; font-size: 48px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                🐾 PawMatch
              </h1>
              <p style="margin: 8px 0 0; color: ${colors.background}; font-size: 16px; opacity: 0.9;">
                find the <span style="font-style: italic; font-weight: 700;">pawfect</span> match.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${colors.primary}; padding: 30px; text-align: center;">
              <p style="margin: 0; color: ${colors.background}; font-size: 14px; line-height: 1.6;">
                © ${new Date().getFullYear()} PawMatch. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; color: ${colors.accent}; font-size: 12px;">
                Made with ❤️ for dog lovers
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendVerificationEmail = async (email: string, code: string) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${colors.text}; font-size: 28px; font-weight: 600;">
      Welcome to PawMatch! 🐾
    </h2>
    <p style="margin: 0 0 24px; color: ${colors.textLight}; font-size: 16px; line-height: 1.6;">
      Thank you for signing up! We're excited to help you find the perfect playmates for your furry friend.
    </p>
    <p style="margin: 0 0 16px; color: ${colors.text}; font-size: 16px;">
      Your verification code is:
    </p>
    <div style="background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.brown} 100%); border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
      <span style="font-size: 48px; font-weight: 700; letter-spacing: 8px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
        ${code}
      </span>
    </div>
    <p style="margin: 24px 0 0; color: ${colors.textLight}; font-size: 14px; line-height: 1.6;">
      Enter this code in the app to verify your email address.
      <strong style="color: ${colors.brown};">This code expires in 24 hours.</strong>
    </p>
    <div style="margin: 32px 0 0; padding: 16px; background-color: #fef3cd; border-left: 4px solid ${colors.accent}; border-radius: 4px;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Tip:</strong> Make sure to add your dog's profile after verification to start matching!
      </p>
    </div>
  `;

  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: '🐾 PawMatch: Verify your email',
    html: emailTemplate(content),
  });
};

export const sendWelcomeEmail = async (name: string, email: string) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${colors.text}; font-size: 28px; font-weight: 600;">
      Welcome to PawMatch, ${name}! 🎉
    </h2>
    <p style="margin: 0 0 24px; color: ${colors.textLight}; font-size: 16px; line-height: 1.6;">
      Your email has been verified successfully! You're now ready to start your journey to finding the perfect playmates for your dog.
    </p>

    <div style="background-color: white; border-radius: 8px; padding: 24px; margin: 24px 0; border: 2px solid ${colors.accent};">
      <h3 style="margin: 0 0 16px; color: ${colors.primary}; font-size: 20px; font-weight: 600;">
        🚀 Get Started:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: ${colors.textLight}; font-size: 15px; line-height: 1.8;">
        <li style="margin-bottom: 8px;">
          <strong style="color: ${colors.brown};">Add your dogs</strong> to your profile
        </li>
        <li style="margin-bottom: 8px;">
          <strong style="color: ${colors.brown};">Browse matches</strong> in your area
        </li>
        <li style="margin-bottom: 8px;">
          <strong style="color: ${colors.brown};">Schedule playdates</strong> with other owners
        </li>
        <li>
          <strong style="color: ${colors.brown};">Connect</strong> with the dog community
        </li>
      </ul>
    </div>

    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.brown} 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
      <p style="margin: 0; color: white; font-size: 18px; font-weight: 600;">
        🐕 Happy Matching! 🐕
      </p>
    </div>

    <p style="margin: 24px 0 0; color: ${colors.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
      Questions? Just reply to this email – we're here to help!
    </p>
  `;

  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "🐾 Welcome to PawMatch - Let's get started!",
    html: emailTemplate(content),
  });
};
