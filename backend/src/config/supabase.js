import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables');
    process.exit(1);
}

if (!supabaseServiceKey) {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY is missing — user creation will fail');
}

// Standard client — respects RLS. Use for reads that go through policies.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — bypasses RLS. Use ONLY server-side for:
//   - Creating user profile rows after Supabase Auth signup
//   - Admin-only operations not covered by RLS
// NEVER expose this client or key to the frontend.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

console.log('✅ Supabase clients initialized');

export default supabase;

