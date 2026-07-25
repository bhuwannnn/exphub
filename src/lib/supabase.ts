import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://swjgzyijwnnmrunkkwll.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3amd6eWlqd25ubXJ1bmtrd2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5OTQ2NTgsImV4cCI6MjEwMDU3MDY1OH0.DJqB8FwfSDlBGQ9cwpFw_aGD-Hsbxu2XyAA4mdGUwFA';

export const ADMIN_EMAIL = 'bhuwanneniwal7@gmail.com';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
