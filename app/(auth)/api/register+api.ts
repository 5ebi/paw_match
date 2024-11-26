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
}

interface ErrorResponse {
  error: string;
}

type RegisterResponse = SuccessResponse | ErrorResponse;

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponse>> {
  console.log('API Route hit: /api/register');

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
    const passwordHash = await bcryptJs.hash(body.password, 10);
    const formattedPostalCode = `PLZ_${body.postalCode}` as PostalCode;

    // User erstellen
    const newUser = await prisma.owner.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        password: passwordHash,
        postalCode: formattedPostalCode, // Enum-Wert übergeben
        verificationCode: generateVerificationCode(),
        verified: false,
      },
    });

    await sendVerificationEmail(body.email, verificationCode);

    return ExpoApiResponse.json(
      {
        user: { username: newUser.name },
        message:
          'Registration successful. Please check your email to verify your account.',
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
