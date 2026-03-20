import crypto from 'node:crypto';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';
import { hashResetToken, RESET_TOKEN_EXPIRY_MS } from '../../../util/auth';
import { sendPasswordResetEmail } from '../../../util/emails';

interface ForgotPasswordBody {
  email: string;
}

interface ForgotPasswordResponse {
  message?: string;
  error?: string;
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<ForgotPasswordResponse>> {
  try {
    const body: ForgotPasswordBody = await request.json();

    if (!body.email) {
      return ExpoApiResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
    }

    const { data: user, error: findError } = await supabaseAdmin
      .from('owners')
      .select('id, email')
      .eq('email', body.email.toLowerCase())
      .maybeSingle();

    if (findError) {
      return ExpoApiResponse.json(
        { error: 'Database error' },
        { status: 500 },
      );
    }

    if (!user) {
      // Return success message even if user doesn't exist (security best practice)
      return ExpoApiResponse.json(
        {
          message:
            'If an account exists with this email, you will receive a password reset link.',
        },
        { status: 200 },
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = hashResetToken(resetToken);
    const resetTokenExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    const { error: updateError } = await supabaseAdmin
      .from('owners')
      .update({
        reset_token_hash: resetTokenHash,
        reset_token_expires: resetTokenExpires.toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return ExpoApiResponse.json(
        { error: 'Error processing request' },
        { status: 500 },
      );
    }

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError: unknown) {
      console.error('Failed to send password reset email:', emailError);
      return ExpoApiResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 },
      );
    }

    return ExpoApiResponse.json(
      {
        message:
          'If an account exists with this email, you will receive a password reset link.',
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return ExpoApiResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
