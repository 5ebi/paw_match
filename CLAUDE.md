# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- **Start dev server:** `pnpm start` (runs Expo — interactive, don't run in background)
- **Platform-specific:** `pnpm android`, `pnpm ios`, `pnpm web`
- **Type check:** `pnpm typecheck`
- **Lint:** `pnpm lint`
- **Test email sending:** `pnpm test:email`
- **Package manager:** pnpm (v10.7.0) — do not use npm or yarn

There is no test suite configured. CI runs type checking and linting only.

## Architecture

**Expo/React Native app** (SDK 55, React 19.2, RN 0.83) using **Expo Router** for file-based routing and colocated API routes. No separate backend server.

### Routing & API Pattern

- Routes live under `app/` in groups: `(auth)` for login/register flow, `(tabs)` for main app, `(files)` for settings
- API routes are colocated as `*+api.ts` files (e.g., `app/(auth)/api/login+api.ts`) and export async `GET`/`POST` functions
- API responses use the custom `ExpoApiResponse` helper for consistent JSON responses
- Entry point is `app/_layout.tsx` which handles session checks and route redirects

### Backend (Supabase)

- `supabaseClient.ts` exports two clients: `supabase` (anon key, RLS enforced) and `supabaseAdmin` (service role key, bypasses RLS)
- Key tables: `owners`, `dogs`, `dog_preferences`, `sessions`
- Database migrations are managed in Supabase directly, not locally
- Environment variables use `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — dev server must be restarted after changes

### Authentication

Session-based with tokens stored in Supabase `sessions` table + local AsyncStorage (`util/sessionStorage.ts`). API routes verify the `Authorization: Bearer <token>` header. Passwords hashed with bcryptjs. Shared auth utilities (token generation, hashing) in `util/auth.ts`.

### Matching Algorithm

In `app/(tabs)/api/matches+api.ts` — scores dogs by size match (2pts), activity level (4pts), and age group (4pts). Filters by Vienna postal code proximity. Minimum score threshold: 5.

### External Services

- **Resend** — email sending (verification, welcome, password reset). Templates in `util/emails.ts`
- **Cloudinary** — image uploads. Config in `cloudinaryConfig.ts`

## UI Conventions

- Components use **React Native Paper** (Material Design)
- 4-color palette defined in `constants/colors.tsx`: primary green `#515a47`, accent yellow `#d7be82`, dark brown `#400406`, light cream `#fdecde`
- Theme customization in `constants/theme.ts`
- Fonts: Modak (logo), Montserrat + system fonts (UI)
- `Textt` component supports `variant` prop (`'bold'` | `'semibold'`)

## Deployment

- **Mobile OTA:** `pnpm dlx eas-cli@latest update --branch production --message "description"`
- **Native builds:** `pnpm dlx eas-cli@latest build --platform ios|android|all`
- **Web export:** `npx expo export --platform web` then `pnpm dlx eas-cli@latest deploy --prod`

## Important Notes

- Never run `pnpm start` in background — it's interactive and requires terminal access
- Verify code with `pnpm typecheck` and `pnpm lint` only; let the user handle interactive testing
- No global state management — uses React hooks + AsyncStorage for sessions
- All navigation is declarative via Expo Router; don't use imperative navigation outside router hooks
- ESLint warns on `console.log` (use `console.error`/`console.warn` instead) and `any` types
