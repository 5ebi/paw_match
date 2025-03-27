import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';

interface DogWithPreferences {
  id: number;
  name: string;
  size: string;
  birth_date: string;
  activity_level: string;
  image: string | null;
  dog_preferences?: {
    prefersSmallDogs: boolean;
    prefersMediumDogs: boolean;
    prefersLargeDogs: boolean;
    prefersPuppy: boolean;
    prefersYoung: boolean;
    prefersAdult: boolean;
    prefersSenior: boolean;
  } | null;
}

interface SessionWithOwner {
  token: string;
  expires_at: string;
  owners: {
    id: number;
    postal_code: string;
  };
}

function calculateAgeGroup(birthDate: string): string {
  const date = new Date(birthDate);
  const age = new Date().getFullYear() - date.getFullYear();
  if (age <= 1) return 'PUPPY';
  if (age <= 3) return 'YOUNG';
  if (age <= 8) return 'ADULT';
  return 'SENIOR';
}

function calculateMatchScore(
  dog1: DogWithPreferences,
  dog2: DogWithPreferences,
): number {
  let score = 0;
  if (dog1.size === dog2.size) {
    score += 2;
  }
  if (dog1.activity_level === dog2.activity_level) {
    score += 4;
  }
  if (
    calculateAgeGroup(dog1.birth_date) === calculateAgeGroup(dog2.birth_date)
  ) {
    score += 4;
  }
  return score;
}

export async function GET(
  request: Request,
): Promise<ExpoApiResponse<{ matches: any[] } | { error: string }>> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return ExpoApiResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        { error: 'Invalid session' },
        { status: 401 },
      );
    }

    const typedSession = session as SessionWithOwner;

    const { data: myDog, error: myDogError } = await supabase
      .from('dogs')
      .select('*, dog_preferences(*)')
      .eq('owner_id', typedSession.owners.id)
      .limit(1)
      .single();

    if (myDogError || !myDog) {
      return ExpoApiResponse.json({ matches: [] }, { status: 200 });
    }
    const NEARBY_POSTCODES: Record<string, string[]> = {
      '1010': ['1020', '1030', '1040'],
      '1020': ['1010', '1200', '1220'],
      '1030': ['1010', '1040', '1110'],
      '1040': ['1030', '1050', '1010'],
      '1050': ['1040', '1060', '1150'],
      '1060': ['1050', '1070'],
      '1070': ['1060', '1080', '1150'],
      '1080': ['1070', '1090'],
      '1090': ['1080', '1190'],
      '1100': ['1110', '1120', '1050'],
      '1110': ['1100', '1030'],
      '1120': ['1100', '1130'],
      '1130': ['1120', '1140'],
      '1140': ['1130', '1150'],
      '1150': ['1140', '1070', '1050'],
      '1160': ['1170', '1150'],
      '1170': ['1160', '1180'],
      '1180': ['1170', '1190'],
      '1190': ['1180', '1090'],
      '1200': ['1210', '1020'],
      '1210': ['1200', '1220'],
      '1220': ['1210', '1020'],
      '1230': ['1120'],
    };

    const { data: potentialMatches, error: matchError } = await supabase
      .from('dogs')
      .select('*, owners(*), dog_preferences(*)')
      .neq('owner_id', typedSession.owners.id)
      .in('owners.postal_code', [
        typedSession.owners.postal_code,
        ...(NEARBY_POSTCODES[typedSession.owners.postal_code] ?? []),
      ]);
    if (matchError || !Array.isArray(potentialMatches)) {
      return ExpoApiResponse.json(
        { error: 'Failed to load potential matches' },
        { status: 500 },
      );
    }

    const matches = potentialMatches
      .map((dog) => ({
        dog,
        score: calculateMatchScore(myDog, dog),
        matches: {
          size: myDog.size === dog.size,
          age:
            calculateAgeGroup(myDog.birth_date) ===
            calculateAgeGroup(dog.birth_date),
          activityLevel: myDog.activity_level === dog.activity_level,
        },
      }))
      .filter((match) => match.score >= 5)
      .sort((a, b) => b.score - a.score);

    return ExpoApiResponse.json({ matches }, { status: 200 });
  } catch (err) {
    console.error('Match error:', err);
    return ExpoApiResponse.json(
      { error: 'Failed to find matches' },
      { status: 500 },
    );
  }
}
