import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwvayedpcyumbdspkaxl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dmF5ZWRwY3l1bWJkc3BrYXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjcwMDYsImV4cCI6MjA1MjcwMzAwNn0.OOUB6POBe8nZvTWw85FuIuW7BG2uINLVWfzNcRwupIw';

export const supabase = createClient(supabaseUrl, supabaseKey);
