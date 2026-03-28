# Supabase Setup

## Project
- Supabase project id: `migxevookiubncmcsgvy`
- Runtime typing file: `app/lib/supabase/types.ts`
- SQL migrations folder: `supabase/migrations`

## Required Environment Variables
```env
NUXT_PUBLIC_SUPABASE_URL=https://migxevookiubncmcsgvy.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

The app also accepts `SUPABASE_URL` and `SUPABASE_ANON_KEY` as fallback values via `nuxt.config.ts`, but `NUXT_PUBLIC_*` should be preferred.

## Applied Migrations
1. `202603290001_crm_schema.sql`
2. `202603290002_crm_security_and_seeds.sql`

## What The Setup Creates
- Extensions: `pgcrypto`, `citext`
- CRM tables and foreign keys
- enums for business states
- RLS helper functions
- auth trigger to populate `profiles`
- seed data for roles, permissions, brands, categories, cash accounts, and app settings

## Regenerating Database Types
Use the Supabase MCP tool when available. If you need CLI fallback:

```bash
npx supabase gen types typescript --project-id migxevookiubncmcsgvy > app/lib/supabase/types.ts
```

After regeneration, keep the helper aliases at the bottom of `app/lib/supabase/types.ts`.

## Nuxt Integration Files
- `app/lib/supabase/client.ts`
- `app/lib/supabase/server.ts`
- `app/lib/supabase/types.ts`
- `app/composables/useSupabase.ts`
- `app/composables/useAuth.ts`
- `app/composables/usePermissions.ts`
- `app/middleware/auth.ts`
- `app/middleware/admin.ts`

## Auth Flow Summary
1. User signs in through Supabase Auth.
2. `useAuth()` syncs the session and loads `profiles`, `user_roles`, and resolved permissions.
3. Middleware protects private/admin routes.
4. RLS applies final enforcement at the database layer.

## Validation
- Client-side and service-side validation use Zod schemas per domain.
- Domain validations live under `domains/*/validation`.

## Current Validation Status
- Schema and seed setup were applied to Supabase successfully.
- The project still has pending TypeScript issues outside the newly documented backend flow and does not yet complete a clean `nuxt typecheck`.
