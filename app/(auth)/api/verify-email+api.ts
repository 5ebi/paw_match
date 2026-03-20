import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';
import { sendWelcomeEmail } from '../../../util/emails';

type Owner = {
  id: string;
  name: string;
  email: string;
  verification_code: string | null;
  verified: boolean;
};

export async function GET(
  request: Request,
): Promise<ExpoApiResponse<{ message: string } | { error: string }>> {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return ExpoApiResponse.json(
        { error: 'Verification code is required' },
        { status: 400 },
      );
    }

    const trimmedCode = code.trim();

    const { data: user, error: findError } = await supabaseAdmin
      .from('owners')
      .select<'*', Owner>('*')
      .eq('verification_code', trimmedCode)
      .eq('verified', false)
      .maybeSingle();

    if (findError) {
      console.error('Error finding user:', findError);
      return ExpoApiResponse.json(
        { error: 'Error finding user' },
        { status: 400 },
      );
    }

    if (!user) {
      return ExpoApiResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 404 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from('owners')
      .update({
        verified: true,
        verification_code: null,
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    try {
      await sendWelcomeEmail(user.name, user.email);
    } catch (emailError: unknown) {
      console.error('Welcome email error:', emailError);
      // Don't throw - verification was successful, email is bonus
    }

    return ExpoApiResponse.json(
      { message: 'Email verified successfully! You can now log in.' },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Verification error:', error);
    return ExpoApiResponse.json(
      { error: 'Verification failed' },
      { status: 500 },
    );
  }
}
