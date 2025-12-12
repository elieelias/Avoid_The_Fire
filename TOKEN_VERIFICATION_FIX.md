# Token Verification Fix

## Problem
The application was using client-side Supabase with the anon key, but since RLS (Row Level Security) is disabled in Supabase, we need to use the service role key. However, the service role key should **never** be exposed on the client side as it bypasses all security rules.

## Solution
Created API routes to handle all database operations server-side using the service role key:

### New Files Created:

1. **`utils/supabaseServer.ts`** - Server-side Supabase client using service role key
2. **`app/api/validate-token/route.ts`** - API endpoint for validating QR tokens
3. **`app/api/save-score/route.ts`** - API endpoint for saving player scores
4. **`app/api/leaderboard/route.ts`** - API endpoint for fetching leaderboard data

### Modified Files:

1. **`components/QRValidation.tsx`** - Now calls `/api/validate-token` instead of direct Supabase
2. **`components/GameOver.tsx`** - Now calls `/api/save-score` and `/api/leaderboard` instead of direct Supabase

## Environment Variables Required

You need to update your `.env.local` file with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important Notes:**
- Do NOT use `SUPABASE_ANON_KEY` when RLS is disabled
- The service role key bypasses RLS and should only be used server-side
- Never commit the `.env.local` file to version control
- Make sure to update these variables in your deployment environment (Netlify, Vercel, etc.)

## How It Works

1. **Token Validation**: When a user scans a QR code, the frontend sends the token to `/api/validate-token`, which checks if it's valid, not used, and not expired.

2. **Score Saving**: When the game ends, the frontend sends the score to `/api/save-score`, which updates the database and marks the QR code as used.

3. **Leaderboard**: The frontend fetches the leaderboard from `/api/leaderboard`, which queries today's scores and returns them sorted.

All database operations now happen server-side with the service role key, keeping it secure and never exposing it to the client.
