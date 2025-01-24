import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';
import { sendVerificationEmail } from '../../../util/emails';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  postalCode: string;
}
interface CustomError {
  message: string;
  name: string;
  stack?: string;
}

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  postalCode: string;
  verificationCode: string;
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
}

type RegisterResponse = SuccessResponse | ErrorResponse;

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateSessionToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponse>> {
  console.log('1. API Route Start: api/register');

  try {
    let body: RegisterBody;
    try {
      body = await request.json();
      console.log('2. Received request body:', {
        name: body.name,
        email: body.email,
        postalCode: body.postalCode,
      });

      if (!body.email || !body.password || !body.name || !body.postalCode) {
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

    const { data: existingUser } = await supabase
      .from('Owner')
      .select()
      .eq('email', body.email.toLowerCase())
      .single();

    console.log('4. Existing user check complete');

    if (existingUser) {
      console.log('4a. User already exists');
      return ExpoApiResponse.json(
        { error: 'Email already taken' },
        { status: 400 },
      );
    }

    const verificationCode = generateVerificationCode();
    console.log('5. Generated verification code');

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

    const formattedPostalCode = `PLZ_${body.postalCode}`;

    try {
      const { data: newUser, error: userError } = (await supabase
        .from('Owner')
        .insert([
          {
            name: body.name,
            email: body.email.toLowerCase(),
            password: passwordHash,
            postalCode: formattedPostalCode,
            verificationCode: verificationCode,
            verified: false,
          },
        ])
        .select()
        .single()) as { data: DatabaseUser | null; error: any };

      if (userError) throw userError;
      if (!newUser) throw new Error('Failed to create user');

      console.log('8. User created successfully');

      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: sessionError } = await supabase.from('Session').insert([
        {
          token: sessionToken,
          userId: newUser.id,
          expiresAt: expiresAt.toISOString(),
        },
      ]);

      if (sessionError) throw sessionError;
      console.log('9. Session created successfully');

      try {
        console.log('10. Attempting to send verification email');
        await sendVerificationEmail(body.email, verificationCode);
        console.log('11. Verification email sent successfully');
      } catch (emailError: any) {
        console.error('Email Error:', emailError);
        console.log('11a. Continuing despite email error');
      }

      console.log('12. Preparing success response');
      return ExpoApiResponse.json(
        {
          user: { username: newUser.name },
          message:
            'Registration successful. Please check your email to verify your account.',
          token: sessionToken,
        },
        { status: 201 },
      );
    } catch (dbError: any) {
      console.error('Database Error:', dbError);
      return ExpoApiResponse.json(
        { error: 'Error creating user account' },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    const customError = error as CustomError;
    const errorDetails = {
      message: customError.message || 'Unknown error',
      name: customError.name || 'Error',
      stack:
        process.env.NODE_ENV === 'development' ? customError.stack : undefined,
    };
    console.error('Error Details:', errorDetails);

    return ExpoApiResponse.json(
      {
        error: 'Registration failed',
        details:
          process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 },
    );
  }
}
