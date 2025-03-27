import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';

interface HasDogResponse {
  hasDog: boolean;
  error?: string;
}

export async function GET(
  request: Request,
): Promise<ExpoApiResponse<HasDogResponse>> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return ExpoApiResponse.json(
        { hasDog: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Session holen
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, owners(*)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session || !session.owners) {
      return ExpoApiResponse.json(
        { hasDog: false, error: 'Invalid or expired session' },
        { status: 401 },
      );
    }

    // Hund für diesen Owner suchen
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('id')
      .eq('owner_id', session.owners.id)
      .limit(1)
      .single();

    if (dogError && dogError.code !== 'PGRST116') {
      // PGRST116 = no rows found
      return ExpoApiResponse.json(
        { hasDog: false, error: 'Failed to query dog' },
        { status: 500 },
      );
    }

    return ExpoApiResponse.json({ hasDog: !!dog }, { status: 200 });
  } catch (error) {
    console.error('Check dog error:', error);
    return ExpoApiResponse.json(
      { hasDog: false, error: 'Failed to check dog ownership' },
      { status: 500 },
    );
  }
}
