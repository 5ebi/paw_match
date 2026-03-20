import crypto from 'node:crypto';

export const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const RESET_TOKEN_EXPIRY_MS = 1 * 60 * 60 * 1000; // 1 hour

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
