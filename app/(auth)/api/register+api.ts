import type { PostalCode } from '@prisma/client';
import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';
import { sendVerificationEmail } from '../../../util/emails';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  postalCode: string;
}

interface SuccessResponse {
  user: {
    username: string;
  };
  message: string;
  token: string; // Token hinzugefügt
}

interface ErrorResponse {
  error: string;
}

type RegisterResponse = SuccessResponse | ErrorResponse;

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateSessionToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponse>> {
  console.log('API Route hit: api/register');

  try {
    const body: RegisterBody = await request.json();

    const existingUser = await prisma.owner.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (existingUser) {
      return ExpoApiResponse.json(
        { error: 'Username or email already taken' },
        { status: 400 },
      );
    }

    const verificationCode = generateVerificationCode();
    console.log('Generated verification code:', verificationCode);

    const passwordHash = await bcryptJs.hash(body.password, 10);
    const formattedPostalCode = `PLZ_${body.postalCode}` as PostalCode;

    // User erstellen mit Transaction
    const { user, session } = await prisma.$transaction(async (prisma) => {
      // User erstellen
      const newUser = await prisma.owner.create({
        data: {
          name: body.name,
          email: body.email.toLowerCase(),
          password: passwordHash,
          postalCode: formattedPostalCode,
          verificationCode: verificationCode,
          verified: false,
        },
      });

      // Session erstellen
      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 Tage gültig

      const newSession = await prisma.session.create({
        data: {
          token: sessionToken,
          userId: newUser.id,
          expiresAt,
        },
      });

      return { user: newUser, session: newSession };
    });

    console.log('Sending verification email with code:', verificationCode);
    await sendVerificationEmail(body.email, verificationCode);

    return ExpoApiResponse.json(
      {
        user: { username: user.name },
        message:
          'Registration successful. Please check your email to verify your account.',
        token: session.token,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return ExpoApiResponse.json(
      { error: 'Registration failed' },
      { status: 500 },
    );
  }
}
