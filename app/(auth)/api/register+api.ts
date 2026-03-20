import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';
import { generateSessionToken, generateVerificationCode, SESSION_EXPIRY_MS } from '../../../util/auth';
import { sendVerificationEmail } from '../../../util/emails';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  postal_code: string;
}

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  postal_code: string;
  verification_code: string;
  verified: boolean;
}

interface SuccessResponse {
  user: {
    username: string;
  };
  message: string;
  token: string;
}

interface ErrorResponse {
  error: string;
  details?: Record<string, unknown>;
  needsVerification?: boolean;
  redirectToLogin?: boolean;
}

type RegisterResponse = SuccessResponse | ErrorResponse;

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponse>> {
  try {
    let body: RegisterBody;
    try {
      body = await request.json();
      if (!body.email || !body.password || !body.name || !body.postal_code) {
        return ExpoApiResponse.json(
          { error: 'All fields are required' },
          { status: 400 },
        );
      }
    } catch (parseError: unknown) {
      console.error('JSON Parse Error:', parseError);
      return ExpoApiResponse.json(
        { error: 'Invalid request format' },
        { status: 400 },
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from('owners')
      .select()
      .eq('email', body.email.toLowerCase())
      .single();

    if (existingUser) {
      if (!existingUser.verified) {
        const newVerificationCode = generateVerificationCode();

        const { error: updateError } = await supabaseAdmin
          .from('owners')
          .update({ verification_code: newVerificationCode })
          .eq('id', existingUser.id)
          .select();

        if (updateError) {
          return ExpoApiResponse.json(
            { error: 'Error updating verification code' },
            { status: 500 },
          );
        }

        try {
          await sendVerificationEmail(body.email, newVerificationCode);
        } catch {
          // Continue even if email fails
        }

        return ExpoApiResponse.json(
          {
            error: 'Account already exists but is not verified. A new verification code has been sent to your email. Please verify your account.',
            needsVerification: true,
          },
          { status: 400 },
        );
      }

      return ExpoApiResponse.json(
        {
          error: 'This email is already registered. Please log in instead.',
          redirectToLogin: true
        },
        { status: 400 },
      );
    }

    const verificationCode = generateVerificationCode();

    let passwordHash: string;
    try {
      passwordHash = await bcryptJs.hash(body.password, 10);
    } catch (hashError: unknown) {
      console.error('Password hash error:', hashError);
      return ExpoApiResponse.json(
        { error: 'Error processing password' },
        { status: 500 },
      );
    }

    const formattedPostalCode = `PLZ_${body.postal_code}`;

    try {
      const { data: newUser, error: userError } = (await supabaseAdmin
        .from('owners')
        .insert([
          {
            name: body.name,
            email: body.email.toLowerCase(),
            password: passwordHash,
            postal_code: formattedPostalCode,
            verification_code: verificationCode,
            verified: false,
          },
        ])
        .select()
        .single()) as { data: DatabaseUser | null; error: unknown };

      if (userError) throw userError;
      if (!newUser) throw new Error('Failed to create user');

      const sessionToken = generateSessionToken();
      const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

      const { error: sessionError } = await supabaseAdmin.from('sessions').insert([
        {
          token: sessionToken,
          user_id: newUser.id,
          expires_at: expiresAt.toISOString(),
        },
      ]);

      if (sessionError) throw sessionError;

      try {
        await sendVerificationEmail(body.email, verificationCode);
      } catch {
        // Continue even if email fails
      }

      return ExpoApiResponse.json(
        {
          user: { username: newUser.name },
          message:
            'Registration successful. Please check your email to verify your account.',
          token: sessionToken,
        },
        { status: 201 },
      );
    } catch (dbError: unknown) {
      console.error('Database Error:', dbError);
      return ExpoApiResponse.json(
        { error: 'Error creating user account' },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return ExpoApiResponse.json(
      { error: 'Registration failed' },
      { status: 500 },
    );
  }
}
