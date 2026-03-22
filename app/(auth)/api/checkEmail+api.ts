import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';
import { generateVerificationCode } from '../../../util/auth';
import { sendVerificationEmail } from '../../../util/emails';

interface CheckEmailBody {
  email: string;
}

interface CheckEmailResponse {
  message?: string;
  error?: string;
  requiresVerification?: boolean;
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<CheckEmailResponse>> {
  try {
    let body: CheckEmailBody;
    try {
      body = await request.json();

      if (!body.email) {
        return ExpoApiResponse.json(
          { error: 'Email is required' },
          { status: 400 },
        );
      }
    } catch (parseError: unknown) {
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
      if (!existingUser.verified) {
        const newVerificationCode = generateVerificationCode();

        await supabaseAdmin
          .from('owners')
          .update({ verification_code: newVerificationCode })
          .eq('id', existingUser.id);

        try {
          await sendVerificationEmail(body.email, newVerificationCode);
        } catch {
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

      return ExpoApiResponse.json(
        { error: 'Email already registered' },
        { status: 200 },
      );
    }

    const verificationCode = generateVerificationCode();

    // Create the user record so verify-email can find them by code
    const { error: insertError } = await supabaseAdmin
      .from('owners')
      .insert([
        {
          email: body.email.toLowerCase(),
          verification_code: verificationCode,
          verified: false,
        },
      ]);

    if (insertError) {
      console.error('Error creating user:', insertError);
      return ExpoApiResponse.json(
        { error: 'Error creating account' },
        { status: 500 },
      );
    }

    try {
      await sendVerificationEmail(body.email, verificationCode);
    } catch {
      // Continue even if email fails
    }

    return ExpoApiResponse.json(
      {
        message:
          'Verification code sent to your email. Please check your inbox.',
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Check email error:', error);
    return ExpoApiResponse.json(
      { error: 'Server error' },
      { status: 500 },
    );
  }
}
