import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabaseAdmin } from '../../../supabaseClient';

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

function generateSessionToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<CompleteRegistrationResponse>> {
  console.log('1. Complete registration API called');

  try {
    let body: CompleteRegistrationBody;
    try {
      body = await request.json();
      console.log('2. Received request body for:', body.email);

      if (!body.email || !body.password || !body.name || !body.postal_code) {
        console.error('3. Validation Error: Missing required fields');
        return ExpoApiResponse.json(
          { error: 'All fields are required' },
          { status: 400 },
        );
      }
    } catch (parseError: any) {
      console.error('2. JSON Parse Error:', parseError);
      return ExpoApiResponse.json(
        { error: 'Invalid request format' },
        { status: 400 },
      );
    }

    // Check if user exists and is verified
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

    // Hash password
    let passwordHash: string;
    try {
      passwordHash = await bcryptJs.hash(body.password, 10);
      console.log('6. Password hashed successfully');
    } catch (hashError: any) {
      console.error('6. Password hash error:', hashError);
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
        .single()) as { data: DatabaseUser | null; error: any };

      if (userError) throw userError;
      if (!user) throw new Error('Failed to complete registration');

      console.log('8. User registration completed');

      // Create session
      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

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
      console.log('9. Session created successfully');

      return ExpoApiResponse.json(
        {
          token: sessionToken,
          message: 'Registration completed successfully!',
        },
        { status: 201 },
      );
    } catch (dbError: any) {
      console.error('Database Error:', dbError);
      return ExpoApiResponse.json(
        { error: 'Error completing registration' },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    const customError = error as { message: string };
    console.error('Error Details:', customError.message);

    return ExpoApiResponse.json(
      { error: 'Registration failed' },
      { status: 500 },
    );
  }
}
