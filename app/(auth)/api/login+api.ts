import { PrismaClient } from '@prisma/client';
import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';

const prisma = new PrismaClient();

interface LoginBody {
  email: string;
  password: string;
}

interface SuccessResponse {
  message: string;
  user: {
    id: number;
    name: string;
  };
}

interface ErrorResponse {
  error: string;
}

type LoginResponse = SuccessResponse | ErrorResponse;

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<LoginResponse>> {
  console.log('API Route hit: /api/login');

  const body: LoginBody = await request.json();

  // Überprüfen, ob der Benutzer existiert
  const existingUser = await prisma.owner.findUnique({
    where: {
      email: body.email.toLowerCase(),
    },
  });

  if (!existingUser) {
    return ExpoApiResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    );
  }

  // Passwort überprüfen
  const isPasswordValid = await bcryptJs.compare(
    body.password,
    existingUser.password,
  );

  if (!isPasswordValid) {
    return ExpoApiResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    );
  }

  // Erfolg: Benutzerdaten zurückgeben
  return ExpoApiResponse.json(
    {
      message: 'Login successful',
      user: {
        id: existingUser.id,
        name: existingUser.name,
      },
    },
    { status: 200 },
  );
}
