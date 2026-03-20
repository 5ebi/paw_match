import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';
import { generateSessionToken, SESSION_EXPIRY_MS } from '../../../util/auth';

interface CompleteRegistrationBody {
  email: string;
  name: string;
  postal_code: string;
  password: string;
}

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  postal_code: string;
  verified: boolean;
}

interface SuccessResponse {
  token: string;
  message: string;
}

interface ErrorResponse {
  error: string;
}

type CompleteRegistrationResponse = SuccessResponse | ErrorResponse;

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<CompleteRegistrationResponse>> {
  try {
    let body: CompleteRegistrationBody;
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
      .eq('verified', true)
      .maybeSingle();

    if (existingUser) {
      return ExpoApiResponse.json(
        { error: 'Account already exists' },
        { status: 400 },
      );
    }

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
      const { data: user, error: userError } = (await supabaseAdmin
        .from('owners')
        .upsert([
          {
            email: body.email.toLowerCase(),
            name: body.name,
            password: passwordHash,
            postal_code: formattedPostalCode,
            verified: true,
            verification_code: null,
          },
        ])
        .select()
        .single()) as { data: DatabaseUser | null; error: unknown };

      if (userError) throw userError;
      if (!user) throw new Error('Failed to complete registration');

      const sessionToken = generateSessionToken();
      const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

      const { error: sessionError } = await supabaseAdmin.from('sessions').insert(
        [
          {
            token: sessionToken,
            user_id: user.id,
            expires_at: expiresAt.toISOString(),
          },
        ],
      );

      if (sessionError) throw sessionError;

      return ExpoApiResponse.json(
        {
          token: sessionToken,
          message: 'Registration completed successfully!',
        },
        { status: 201 },
      );
    } catch (dbError: unknown) {
      console.error('Database Error:', dbError);
      return ExpoApiResponse.json(
        { error: 'Error completing registration' },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    console.error('Complete registration error:', error);
    return ExpoApiResponse.json(
      { error: 'Registration failed' },
      { status: 500 },
    );
  }
}
