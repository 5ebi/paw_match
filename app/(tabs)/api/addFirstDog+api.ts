import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';

const defaultPreferences = {
  prefersSmallDogs: true,
  prefersMediumDogs: true,
  prefersLargeDogs: true,
  prefersPuppy: true,
  prefersYoung: true,
  prefersAdult: true,
  prefersSenior: true,
} as const;

interface AddDogBody {
  name?: string;
  size?: string;
  birthDate?: string;
  activityLevel?: string;
  image: string | null;
}

interface SuccessResponse {
  dog: {
    name: string;
    size: string;
    activityLevel: string;
    image: string | null;
  };
  message: string;
}

interface ErrorResponse {
  error: string;
}

type AddDogResponse = SuccessResponse | ErrorResponse;

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<AddDogResponse>> {
  console.log('API Route hit: /api/addFirstDog');

  try {
    let body: AddDogBody;
    try {
      body = await request.json();
    } catch {
      return ExpoApiResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    if (!body.name || !body.size || !body.birthDate || !body.activityLevel) {
      return ExpoApiResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return ExpoApiResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '');

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, owners(*)')
      .eq('token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return ExpoApiResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 },
      );
    }

    const { data: newDog, error: dogError } = await supabase
      .from('dogs')
      .insert([
        {
          name: body.name,
          size: body.size,
          birth_date: body.birthDate,
          activity_level: body.activityLevel,
          image: body.image,
          owner_id: session.owners.id,
        },
      ])
      .select()
      .single();

    if (dogError || !newDog) {
      return ExpoApiResponse.json(
        { error: 'Failed to add dog' },
        { status: 500 },
      );
    }

    const { error: prefError } = await supabase
      .from('dog_preferences')
      .insert([{ dog_id: newDog.id, ...defaultPreferences }]);

    if (prefError) {
      return ExpoApiResponse.json(
        { error: 'Failed to set preferences' },
        { status: 500 },
      );
    }

    return ExpoApiResponse.json(
      {
        dog: {
          name: newDog.name,
          size: newDog.size,
          activityLevel: newDog.activity_level,
          image: newDog.image,
        },
        message: 'Dog added successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Add dog error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to add dog';
    return ExpoApiResponse.json({ error: errorMessage }, { status: 500 });
  }
}
