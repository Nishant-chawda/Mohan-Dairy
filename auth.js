// Real Supabase authentication for the Mobile Number + OTP login screen
// in index.html. This does NOT get auto-included — see README.md for the
// exact lines to replace inside index.html's own <script> so this fires
// instead of the placeholder toast messages (not alongside them).

import { createClient } from '@supabase/supabase-js';
// — or, with no build step, use the CDN global instead:
// const { createClient } = window.supabase;

const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Send an OTP to a 10-digit Indian mobile number.
 * Requires a Phone provider (e.g. Twilio) enabled in
 * Supabase → Authentication → Providers.
 */
export async function sendMobileOtp(mobile10Digit) {
  const phone = '+91' + mobile10Digit;
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

/**
 * Verify the OTP code the customer typed.
 * On success, Supabase stores the session automatically — the
 * customer is now logged in.
 */
export async function verifyMobileOtp(mobile10Digit, code) {
  const phone = '+91' + mobile10Digit;
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: 'sms',
  });
  if (error) throw error;
  return data.session; // contains the logged-in user + access token
}

/**
 * Email OTP — same shape, for the email-login option.
 */
export async function sendEmailOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function verifyEmailOtp(email, code) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email',
  });
  if (error) throw error;
  return data.session;
}

/**
 * Google login — redirects the browser to Google, then back to your site.
 * Requires the Google provider set up in Supabase (see README.md).
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) throw error;
}

/**
 * Check whether someone is already logged in (e.g. on page load).
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}
