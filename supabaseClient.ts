import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://dqqxbbqsdlnxgfmphryh.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcXhiYnFzZGxueGdmbXBocnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1Mjc3OTcsImV4cCI6MjA4NTEwMzc5N30.9p1-Z2dwZG8VsE0ZUtoc0tP_0o9D-SVjCPHaTVE4hVY';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.warn(
    'Warning: SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will fail.',
  );
}

// Client for authenticated requests (subject to RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for operations that bypass RLS (registration, admin tasks)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
