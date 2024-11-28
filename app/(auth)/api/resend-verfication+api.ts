import crypto from 'node:crypto';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import prisma from '../../../prismaClient';
import { sendVerificationReminderEmail } from '../../../util/emails';

interface ResendVerificationBody {
  email: string;
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<{ message: string } | { error: string }>> {
  try {
    const body: ResendVerificationBody = await request.json();

    const user = await prisma.owner.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (!user) {
      return ExpoApiResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.verified) {
      return ExpoApiResponse.json(
        { error: 'Email already verified' },
        { status: 400 },
      );
    }

    // Generate new verification code
    const newVerificationCode = crypto.randomBytes(32).toString('hex');

    // Update user with new verification code
    await prisma.owner.update({
      where: { id: user.id },
      data: { verificationCode: newVerificationCode },
    });

    // Send reminder verification email
    await sendVerificationReminderEmail(body.email, newVerificationCode);

    return ExpoApiResponse.json(
      { message: 'Verification email sent' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error resending verification:', error);
    return ExpoApiResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 },
    );
  }
}
