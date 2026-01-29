import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = process.env.RESEND_FROM ?? 'onboarding@resend.dev';

// PawMatch Brand Colors (4 colors - clean & simple)
const c = {
  primary: '#515a47', // green
  accent: '#d7be82', // warm yellow
  dark: '#400406', // dark brown
  light: '#fdecde', // warm white
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background-color: white;">
          <!-- Header -->
          <tr>
            <td style="background-color: #515a47; padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #e9b44c; font-size: 48px; font-weight: 700; font-family: 'Modak', serif;">
                🐾 PawMatch
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; color: ${c.dark}; line-height: 1.6;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: white; border-top: 1px solid #e0e0e0; padding: 24px 30px; text-align: center;">
              <p style="margin: 0; color: ${c.dark}; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} PawMatch
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
    <h2 style="margin: 0 0 16px; color: #333333; font-size: 24px; font-weight: 600;">
      Verify your email
    </h2>
    <p style="margin: 0 0 24px; color: #333333; font-size: 16px;">
      Thanks for joining PawMatch! Enter this code to verify your email:
    </p>

    <div style="background-color: ${c.primary}; border-radius: 8px; padding: 16px 12px; text-align: center; margin: 24px 0; display: block; word-spacing: normal;">
      <span style="font-size: 40px; font-weight: 700; letter-spacing: 4px; color: white; display: inline-block;">
        ${code}
      </span>
    </div>

    <p style="margin: 0; color: #333333; font-size: 13px;">
      Code expires in 24 hours. If you didn't create this account, please ignore this email.
    </p>
  `;

  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: '🐾 Verify your PawMatch email',
    html: emailTemplate(content),
  });
};

export const sendWelcomeEmail = async (name: string, email: string) => {
  const content = `
    <h2 style="margin: 0 0 16px; color: #333333; font-size: 24px; font-weight: 600;">
      Welcome, ${name}! 🎉
    </h2>
    <p style="margin: 0 0 24px; color: #333333; font-size: 16px;">
      Your email is verified. You're all set to find the perfect playmates for your furry friend.
    </p>

    <div style="background-color: #f5f5f5; border-left: 4px solid ${c.accent}; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px; color: ${c.primary}; font-size: 16px; font-weight: 600;">
        Next steps:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px;">
        <li style="margin-bottom: 8px;">Add your dog's profile</li>
        <li style="margin-bottom: 8px;">Browse other dogs in your area</li>
        <li>Schedule playdates</li>
      </ul>
    </div>

    <p style="margin: 0; color: #333333; font-size: 13px;">
      Happy matching! 🐕
    </p>
  `;

  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: '🐾 Welcome to PawMatch',
    html: emailTemplate(content),
  });
};
