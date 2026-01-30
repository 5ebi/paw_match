import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';

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
    console.log('Received verification code:', code);

    if (!code) {
      return ExpoApiResponse.json(
        { error: 'Verification code is required' },
        { status: 400 },
      );
    }

    const trimmedCode = code.trim();
    console.log('Trimmed verification code:', trimmedCode);

    const { data: user, error: findError } = await supabaseAdmin
      .from('owners')
      .select<'*', Owner>('*')
      .eq('verification_code', trimmedCode)
      .eq('verified', false)
      .maybeSingle();

    console.log('Found user:', user ? 'Yes' : 'No');

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

    console.log('Email verified successfully');

    return ExpoApiResponse.json(
      { message: 'Email verified successfully!' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Verification error:', error);
    return ExpoApiResponse.json(
      { error: 'Verification failed' },
      { status: 500 },
    );
  }
}
