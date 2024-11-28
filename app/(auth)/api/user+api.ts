import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';

export async function GET(
  request: Request,
): Promise<
  ExpoApiResponse<{ name: string; email: string } | { error: string }>
> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return ExpoApiResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return ExpoApiResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 },
      );
    }

    const { name, email } = session.user;
    return ExpoApiResponse.json({ name, email }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return ExpoApiResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 },
    );
  }
}
