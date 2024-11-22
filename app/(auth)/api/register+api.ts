import { PrismaClient } from '@prisma/client';
import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';

const prisma = new PrismaClient();

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface SuccessResponse {
  user: {
    username: string;
  };
}

interface ErrorResponse {
  error: string;
}

type RegisterResponse = SuccessResponse | ErrorResponse;

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponse>> {
  console.log('API Route hit: /api/register');

  const body: RegisterBody = await request.json();

  // Überprüfen, ob die E-Mail bereits existiert
  console.log('Prisma Client:', prisma);
  console.log('Prisma Owner Model:', prisma.owner);

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

  // Passwort hashen
  const passwordHash = await bcryptJs.hash(body.password, 10);

  // Neuen Benutzer erstellen
  const newUser = await prisma.owner.create({
    data: {
      name: body.name,
      email: body.email.toLowerCase(),
      password: passwordHash,
    },
  });

  return ExpoApiResponse.json(
    { user: { username: newUser.name } },
    { status: 201 },
  );
}
