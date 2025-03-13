import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';

type Owner = {
  id: string;
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

    const { data: user, error: findError }: PostgrestSingleResponse<Owner> =
      await supabase
        .from('owners')
        .select('*')
        .eq('verification_code', code)
        .eq('verified', false)
        .single();

    console.log('Found user:', user ? 'Yes' : 'No');
    console.log('User verification code in DB:', user?.verification_code);

    if (findError) {
      return ExpoApiResponse.json(
        { error: 'Error finding user' },
        { status: 400 },
      );
    }

    // Da wenn findError falsy ist, user immer definiert ist, entfällt die Prüfung auf !user

    const { error: updateError } = await supabase
      .from('owners')
      .update({
        verified: true,
        verification_code: null,
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    console.log('User verified successfully');

    return ExpoApiResponse.json(
      { message: 'Email verified successfully! You can now log in.' },
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
