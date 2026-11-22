// Reference code for a site hosted somewhere that can reach the internet
// (Claude Code, Vercel, Netlify, your own server, etc.).
// This will NOT work inside a Claude Artifact preview — those pages are
// not allowed to call outside domains, Supabase included.
//
// Only ever put the PUBLISHABLE (anon) key here. Never the secret key —
// the secret key must only ever live in a server-side environment
// variable, never in code a browser loads.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// ── No build step? Use the CDN version instead ──────────────
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
// <script>
//   const supabase = window.supabase.createClient(
//     'https://YOUR-PROJECT-REF.supabase.co',
//     'sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx'
//   );
// </script>
