import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';

interface UserResponse {
  name: string;
  email: string;
  dogs: any[];
}

export async function GET(
  Request: Request,
): Promise<ExpoApiResponse<UserResponse | { error: string }>> {
  try {
    const authHeader = Request.headers.get('authorization');
    if (!authHeader) {
      return ExpoApiResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          include: {
            dogs: {
              select: {
                id: true,
                name: true,
                image: true,
                size: true,
                activityLevel: true,
                birthDate: true,
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return ExpoApiResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 },
      );
    }

    const { name, email, dogs } = session.user;
    return ExpoApiResponse.json({ name, email, dogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return ExpoApiResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 },
    );
  }
}
