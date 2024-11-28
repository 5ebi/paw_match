// util/auth.ts
import { randomBytes } from 'node:crypto';
import prisma from '../prismaClient';

export function generateSessionToken() {
  return randomBytes(32).toString('hex');
}

export async function createSession(userId: number) {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}
