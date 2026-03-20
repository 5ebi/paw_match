import bcryptJs from 'bcryptjs';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';
import { generateSessionToken, SESSION_EXPIRY_MS } from '../../../util/auth';

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

    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', body.email.toLowerCase())
      .maybeSingle<Owner>();

    if (error) {
      return ExpoApiResponse.json(
        { error: 'Database error' },
        { status: 500 },
      );
    }

    if (!user) {
      return ExpoApiResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    if (!user.verified) {
      return ExpoApiResponse.json(
        {
          error: 'Please verify your email address before logging in',
          needsVerification: true,
        },
        { status: 403 },
      );
    }

    const validPassword = await bcryptJs.compare(body.password, user.password);
    if (!validPassword) {
      return ExpoApiResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const token = generateSessionToken();

    const { error: sessionError } = await supabase.from('sessions').insert({
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + SESSION_EXPIRY_MS),
    });

    if (sessionError) {
      throw sessionError;
    }

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
  } catch (error: unknown) {
    console.error('Login error:', error);
    return ExpoApiResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
