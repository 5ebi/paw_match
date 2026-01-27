import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqqxbbqsdlnxgfmphryh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcXhiYnFzZGxueGdmbXBocnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1Mjc3OTcsImV4cCI6MjA4NTEwMzc5N30.9p1-Z2dwZG8VsE0ZUtoc0tP_0o9D-SVjCPHaTVE4hVY';

export const supabase = createClient(supabaseUrl, supabaseKey);
