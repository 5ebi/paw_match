import crypto from 'node:crypto';
import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';

interface LoginBody {
  email: string;
  password: string;
}

interface LoginSuccess {
  user: {
    id: number;
    username: string;
  };
  token: string;
}

interface LoginError {
  error: string;
  needsVerification?: boolean;
}

type LoginResponse = LoginSuccess | LoginError;

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<LoginResponse>> {
  try {
    const body: LoginBody = await request.json();

    const user = await prisma.owner.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (!user) {
      return ExpoApiResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Check if user is verified
    if (!user.verified) {
      return ExpoApiResponse.json(
        {
          error: 'Please verify your email address before logging in',
          needsVerification: true,
        },
        { status: 403 },
      );
    }

    // Check password
    const validPassword = await bcryptJs.compare(body.password, user.password);
    if (!validPassword) {
      return ExpoApiResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString('hex');

    // Create session
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return ExpoApiResponse.json(
      {
        user: {
          id: user.id,
          username: user.name,
        },
        token,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Login error:', error);
    return ExpoApiResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
