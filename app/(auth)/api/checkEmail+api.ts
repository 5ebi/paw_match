import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';
import { sendVerificationEmail } from '../../../util/emails';

interface CheckEmailBody {
  email: string;
}

interface CheckEmailResponse {
  message?: string;
  error?: string;
  requiresVerification?: boolean;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<CheckEmailResponse>> {
  try {
    let body: CheckEmailBody;
    try {
      body = await request.json();
      console.log('Check email for:', body.email);

      if (!body.email) {
        return ExpoApiResponse.json(
          { error: 'Email is required' },
          { status: 400 },
        );
      }
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError);
      return ExpoApiResponse.json(
        { error: 'Invalid request format' },
        { status: 400 },
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from('owners')
      .select()
      .eq('email', body.email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      // User exists
      if (!existingUser.verified) {
        // User exists but not verified - resend verification code
        const newVerificationCode = generateVerificationCode();

        await supabaseAdmin
          .from('owners')
          .update({ verification_code: newVerificationCode })
          .eq('id', existingUser.id);

        try {
          await sendVerificationEmail(body.email, newVerificationCode);
        } catch (emailError: any) {
          console.error('Email Error:', emailError);
          // Continue even if email fails
        }

        return ExpoApiResponse.json(
          {
            message: 'Account exists but not verified. New code sent.',
            requiresVerification: true,
          },
          { status: 200 },
        );
      }

      // User exists and is verified - they should log in instead
      return ExpoApiResponse.json(
        { error: 'Email already registered' },
        { status: 200 },
      );
    }

    // Email is available - generate verification code and send email
    const verificationCode = generateVerificationCode();

    try {
      await sendVerificationEmail(body.email, verificationCode);
    } catch (emailError: any) {
      console.error('Email Error:', emailError);
      // Continue anyway - they can use the code from console logs in dev
    }

    return ExpoApiResponse.json(
      {
        message:
          'Verification code sent to your email. Please check your inbox.',
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const customError = error as { message: string };
    console.error('Error:', customError.message);

    return ExpoApiResponse.json(
      { error: 'Server error' },
      { status: 500 },
    );
  }
}
