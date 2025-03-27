import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';

interface Dog {
  id: number;
  name: string;
  image: string | null;
  size: string;
  activity_level: string;
  birth_date: string;
}

interface UserResponse {
  name: string;
  email: string;
  dogs: Dog[];
}

export async function GET(
  request: Request,
): Promise<ExpoApiResponse<UserResponse | { error: string }>> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return ExpoApiResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, owners(*)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session || !session.owners) {
      return ExpoApiResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 },
      );
    }

    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select('id, name, image, size, activity_level, birth_date')
      .eq('owner_id', session.owners.id);

    if (dogsError || !dogs) {
      return ExpoApiResponse.json(
        { error: 'Could not load dogs' },
        { status: 500 },
      );
    }

    return ExpoApiResponse.json(
      {
        name: session.owners.name,
        email: session.owners.email,
        dogs,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return ExpoApiResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 },
    );
  }
}
