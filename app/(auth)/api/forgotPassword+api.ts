import crypto from 'node:crypto';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';
import { sendPasswordResetEmail } from '../../../util/emails';

interface ForgotPasswordBody {
  email: string;
}

interface ForgotPasswordResponse {
  message?: string;
  error?: string;
}

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<ForgotPasswordResponse>> {
  try {
    const body: ForgotPasswordBody = await request.json();
    console.log('1. Forgot password request for email:', body.email.toLowerCase());

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
      console.error('2. Database error:', findError);
      return ExpoApiResponse.json(
        { error: 'Database error' },
        { status: 500 },
      );
    }

    if (!user) {
      console.log('3. User not found with email:', body.email.toLowerCase());
      // Return success message even if user doesn't exist (security best practice)
      return ExpoApiResponse.json(
        {
          message:
            'If an account exists with this email, you will receive a password reset link.',
        },
        { status: 200 },
      );
    }

    console.log('4. User found, generating reset token');

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenHash = hashResetToken(resetToken);
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    const { error: updateError } = await supabaseAdmin
      .from('owners')
      .update({
        reset_token_hash: resetTokenHash,
        reset_token_expires: resetTokenExpires.toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('5. Error updating reset token:', updateError);
      return ExpoApiResponse.json(
        { error: 'Error processing request' },
        { status: 500 },
      );
    }

    console.log('6. Reset token stored, sending email');

    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(user.email, resetToken);
      console.log('7. Password reset email sent successfully', {
        id: emailResult?.id,
      });
    } catch (emailError: any) {
      console.error('7. Email Error:', emailError);
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
    const err = error as { message?: string };
    console.error('8. Forgot password error:', err);
    return ExpoApiResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
