import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const APP_SCHEME = 'pawmatch';
const APP_DOMAIN = 'pawmatch.xyz';

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
): Promise<void> => {
  const verificationLink = `${APP_SCHEME}://verify?code=${verificationCode}`;
  const webVerificationLink = `https://${APP_DOMAIN}/verify?code=${verificationCode}`;

  try {
    const info = await transporter.sendMail({
      from: `"Paw Match" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Paw Match account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568; text-align: center;">🐾 Welcome to Paw Match!</h1>

          <p>Thank you for registering. To complete your registration, you can either:</p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="font-weight: bold; margin-bottom: 10px;">Option 1: Enter this verification code in the app</p>
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 5px; margin-bottom: 20px;">
              ${verificationCode}
            </div>

            <p style="font-weight: bold; margin: 20px 0 10px;">Option 2: Click one of these verification buttons</p>
            <div style="margin: 10px 0;">
              <a href="${verificationLink}"
                style="background-color: #4CAF50; color: white; padding: 14px 28px;
                       text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px;">
                Verify in App
              </a>
              <a href="${webVerificationLink}"
                style="background-color: #4CAF50; color: white; padding: 14px 28px;
                       text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px;">
                Verify on Web
              </a>
            </div>
          </div>

          <p style="color: #666; font-size: 14px;">
            Note: The app verification button will work once you have Paw Match installed.
            The web verification option is always available.
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Visit us at <a href="https://${APP_DOMAIN}" style="color: #4CAF50;">${APP_DOMAIN}</a>
          </p>

          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with Paw Match, you can safely ignore this email.
          </p>
        </div>
      `,
      text: `
        Welcome to Paw Match!

        Thank you for registering. To complete your registration, you can:

        1. Enter this verification code in the app:
        ${verificationCode}

        2. Or use this link:
     ${verificationLink}



        Visit us at https://${APP_DOMAIN}

        If you didn't create an account with Paw Match, you can safely ignore this email.
      `,
    });

    console.log('Verification email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendVerificationReminderEmail = async (
  email: string,
  verificationCode: string,
): Promise<void> => {
  const verificationLink = `${APP_SCHEME}://verify?code=${verificationCode}`;
  const webVerificationLink = `https://${APP_DOMAIN}/verify?code=${verificationCode}`;

  try {
    await transporter.sendMail({
      from: `"Paw Match" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Paw Match - Email Verification Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568; text-align: center;">🐾 Verify Your Paw Match Account</h1>

          <p>You requested a new verification code. You can either:</p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="font-weight: bold; margin-bottom: 10px;">Option 1: Enter this verification code in the app</p>
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 5px; margin-bottom: 20px;">
              ${verificationCode}
            </div>

            <p style="font-weight: bold; margin: 20px 0 10px;">Option 2: Click one of these verification buttons</p>
            <div style="margin: 10px 0;">
              <a href="${verificationLink}"
                style="background-color: #4CAF50; color: white; padding: 14px 28px;
                       text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px;">
                Verify in App
              </a>
              <a href="${webVerificationLink}"
                style="background-color: #4CAF50; color: white; padding: 14px 28px;
                       text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px;">
                Verify on Web
              </a>
            </div>
          </div>

          <p style="color: #666; font-size: 14px;">
            Note: The app verification button will work once you have Paw Match installed.
            The web verification option is always available.
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Visit us at <a href="https://${APP_DOMAIN}" style="color: #4CAF50;">${APP_DOMAIN}</a>
          </p>

          <p style="color: #666; font-size: 14px;">
            If you didn't request this verification code, you can safely ignore it.
          </p>
        </div>
      `,
      text: `
        Verify Your Paw Match Account

        You requested a new verification code. You can:

        1. Enter this verification code in the app:
        ${verificationCode}

        2. Or use one of these verification links:
        - App: ${verificationLink}
        - Web: ${webVerificationLink}

        Note: The app verification link will work once you have Paw Match installed.
        The web verification option is always available.

        Visit us at https://${APP_DOMAIN}

        If you didn't request this verification code, you can safely ignore it.
      `,
    });
  } catch (error) {
    console.error('Error sending verification reminder email:', error);
    throw error;
  }
};
