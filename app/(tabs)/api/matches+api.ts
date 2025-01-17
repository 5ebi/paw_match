import { type Dog } from '@prisma/client';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';

interface DogWithPreferences extends Dog {
  preferences?: {
    prefersSmallDogs: boolean;
    prefersMediumDogs: boolean;
    prefersLargeDogs: boolean;
    prefersPuppy: boolean;
    prefersYoung: boolean;
    prefersAdult: boolean;
    prefersSenior: boolean;
  } | null;
}

function calculateAgeGroup(birthDate: Date): string {
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (age <= 1) {
    return 'PUPPY';
  }
  if (age <= 3) {
    return 'YOUNG';
  }
  if (age <= 8) {
    return 'ADULT';
  }
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
  if (dog1.activityLevel === dog2.activityLevel) {
    score += 4;
  }
  if (calculateAgeGroup(dog1.birthDate) === calculateAgeGroup(dog2.birthDate)) {
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
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return ExpoApiResponse.json(
        { error: 'Invalid session' },
        { status: 401 },
      );
    }

    const myDog = await prisma.dog.findFirst({
      where: { ownerId: session.user.id },
      include: { preferences: true },
    });

    if (!myDog) {
      return ExpoApiResponse.json({ matches: [] }, { status: 200 });
    }

    const potentialMatches = await prisma.dog.findMany({
      where: {
        NOT: { ownerId: session.user.id },
        owner: {
          postalCode: session.user.postalCode,
        },
      },
      include: {
        owner: true,
        preferences: true,
      },
    });

    const matches = potentialMatches
      .map((dog) => ({
        dog,
        score: calculateMatchScore(
          myDog as DogWithPreferences,
          dog as DogWithPreferences,
        ),
        matches: {
          size: myDog.size === dog.size,
          age:
            calculateAgeGroup(myDog.birthDate) ===
            calculateAgeGroup(dog.birthDate),
          activityLevel: myDog.activityLevel === dog.activityLevel,
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
