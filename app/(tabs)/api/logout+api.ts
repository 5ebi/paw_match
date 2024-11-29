import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<{ message: string } | { error: string }>> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return ExpoApiResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '');

    await prisma.session.delete({
      where: {
        token: sessionToken,
      },
    });

    return ExpoApiResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Logout error:', error);
    return ExpoApiResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
