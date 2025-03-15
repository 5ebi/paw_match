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

    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', body.email.toLowerCase())
      .single<Owner>();

    if (error) {
      console.error('Supabase error:', error);
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

    const token = crypto.randomBytes(32).toString('hex');

    const { error: sessionError } = await supabase.from('sessions').insert({
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Tage
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
  } catch (error) {
    console.error('Login error:', error);
    return ExpoApiResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
