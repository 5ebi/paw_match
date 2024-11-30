// app/api/hasDog/route.ts
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';

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
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return ExpoApiResponse.json(
        { hasDog: false, error: 'Invalid or expired session' },
        { status: 401 },
      );
    }

    const dog = await prisma.dog.findFirst({
      where: { ownerId: session.user.id },
    });

    return ExpoApiResponse.json({ hasDog: !!dog }, { status: 200 });
  } catch (error) {
    console.error('Check dog error:', error);
    return ExpoApiResponse.json(
      { hasDog: false, error: 'Failed to check dog ownership' },
      { status: 500 },
    );
  }
}
