import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { prisma } from '../../../prismaClient';
import { sendVerificationEmail } from '../../../util/emails';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
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

// Funktion zur Generierung eines 6-stelligen Codes
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponse>> {
  console.log('API Route hit: /api/register');

  try {
    const body: RegisterBody = await request.json();

    // Überprüfen, ob die E-Mail bereits existiert
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

    // Generate 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Passwort hashen
    const passwordHash = await bcryptJs.hash(body.password, 10);

    // Neuen Benutzer erstellen
    const newUser = await prisma.owner.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        password: passwordHash,
        verificationCode,
        verified: false,
      },
    });

    // Send verification email
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
