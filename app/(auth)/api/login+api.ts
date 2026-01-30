import crypto from 'node:crypto';
import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';

interface LoginBody {
  email: string;
  password: string;
}

interface Owner {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
}

interface LoginSuccess {
  user: {
    id: string;
    username: string;
  };
  token: string;
}

interface LoginError {
  error: string;
  needsVerification?: boolean;
}

type LoginResponse = LoginSuccess | LoginError;

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<LoginResponse>> {
  try {
    const body: LoginBody = await request.json();
    console.log('1. Login attempt for email:', body.email.toLowerCase());

    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', body.email.toLowerCase())
      .maybeSingle<Owner>();

    if (error) {
      console.error('2. Supabase query error:', error);
      return ExpoApiResponse.json(
        { error: 'Database error' },
        { status: 500 },
      );
    }

    if (!user) {
      console.log('3. User not found with email:', body.email.toLowerCase());
      return ExpoApiResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    console.log('4. User found:', { id: user.id, email: user.email, verified: user.verified });

    if (!user.verified) {
      console.log('5. User email not verified');
      return ExpoApiResponse.json(
        {
          error: 'Please verify your email address before logging in',
          needsVerification: true,
        },
        { status: 403 },
      );
    }

    console.log('6. Comparing passwords...');
    const validPassword = await bcryptJs.compare(body.password, user.password);
    if (!validPassword) {
      console.log('7. Invalid password for user:', user.email);
      return ExpoApiResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }
    console.log('8. Password valid, creating session...');

    const token = crypto.randomBytes(32).toString('hex');
    console.log('9. Generated session token');

    const { error: sessionError } = await supabase.from('sessions').insert({
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Tage
    });

    if (sessionError) {
      console.error('10. Session creation error:', sessionError);
      throw sessionError;
    }

    console.log('11. Login successful for user:', user.email);
    return ExpoApiResponse.json(
      {
        user: {
          id: user.id,
          username: user.name,
        },
        token,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Login error:', error);
    return ExpoApiResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
