import crypto from 'node:crypto';
import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';

interface ResetPasswordBody {
  token: string;
  password: string;
}

interface ResetPasswordResponse {
  message?: string;
  error?: string;
}

function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<ResetPasswordResponse>> {
  try {
    const body: ResetPasswordBody = await request.json();

    if (!body.token || !body.password) {
      return ExpoApiResponse.json(
        { error: 'Token and password are required' },
        { status: 400 },
      );
    }

    const tokenHash = hashResetToken(body.token);

    const { data: user, error: findError } = await supabaseAdmin
      .from('owners')
      .select('id, reset_token_expires')
      .eq('reset_token_hash', tokenHash)
      .gte('reset_token_expires', new Date().toISOString())
      .maybeSingle();

    if (findError) {
      console.error('Reset password lookup error:', findError);
      return ExpoApiResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 },
      );
    }

    if (!user || !user.reset_token_expires) {
      return ExpoApiResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 },
      );
    }

    const passwordHash = await bcryptJs.hash(body.password, 10);

    const { error: updateError } = await supabaseAdmin
      .from('owners')
      .update({
        password: passwordHash,
        reset_token_hash: null,
        reset_token_expires: null,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Reset password update error:', updateError);
      return ExpoApiResponse.json(
        { error: 'Failed to reset password' },
        { status: 500 },
      );
    }

    return ExpoApiResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return ExpoApiResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 },
    );
  }
}
