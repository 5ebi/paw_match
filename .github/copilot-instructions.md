# Copilot Instructions for Paw Match

## Project Overview

- **Paw Match** is a mobile app (Expo/React Native) for dog owners to find playdate matches for their dogs, using a custom matching algorithm and Supabase as the backend.
- The app is organized by feature folders under `app/`, with API routes colocated (e.g., `app/(auth)/api/`, `app/(tabs)/api/`).
- Backend logic (authentication, matching, etc.) is implemented in these API route files, not in a separate backend service.

## Key Architectural Patterns

- **Expo Router** is used for navigation and routing. The main entry is `app/_layout.tsx`, which handles session checks and redirects.
- **Session management** uses a custom wrapper over `@react-native-async-storage/async-storage` (`util/sessionStorage.ts`).
- **Supabase** is the primary backend for data (users, dogs, sessions, matches). See `supabaseClient.ts` for config.
- **API endpoints** are implemented as async functions (e.g., `POST`, `GET`) in `app/**/api/*.ts` files, returning `ExpoApiResponse` objects for consistent JSON responses.
- **Matching logic** is in `app/(tabs)/api/matches+api.ts`.
- **UI components** are in `components/` and use custom color and theme definitions from `constants/colors.tsx` and `constants/theme.ts`.

## Developer Workflows

- **Start app:** `pnpm start` or `npm run start` (runs Expo)
- **Platform builds:** `pnpm android`, `pnpm ios`, `pnpm web`
- **Migrations:** `pnpm migrate` (uses `ley`)
- **Test email sending:** `pnpm test:email`
- **Backend scripts:** See `scripts/` for utilities

## Project Conventions

- **API route files** are named with `+api.ts` (e.g., `login+api.ts`).
- **Session tokens** are stored in Supabase `sessions` table and in local async storage.
- **All navigation is declarative** via Expo Router; do not use imperative navigation outside router hooks.
- **Color and theme**: Use values from `constants/colors.tsx` and `constants/theme.ts` for all UI styling.
- **No separate backend server**: All business logic is colocated with the Expo app in API route files.

## Integration Points

- **Supabase**: All data access (users, dogs, sessions, matches) is via Supabase client (`supabaseClient.ts`).
- **Cloudinary**: Used for image uploads (see dependencies, config in `cloudinaryConfig.ts`).
- **Email**: Sending via `nodemailer` (see `util/emails.ts` and `scripts/test-email.ts`).

## Examples

- **Add a new API route:** Place a `*+api.ts` file in the appropriate `app/(feature)/api/` folder and export async `GET`/`POST` functions.
- **Add a new screen:** Place a `.tsx` file in the relevant `app/(feature)/` folder and add a route in the router stack if needed.
- **Use session:** Import from `util/sessionStorage.ts`.

## References

- Main entry: `app/_layout.tsx`
- Matching logic: `app/(tabs)/api/matches+api.ts`
- Session: `util/sessionStorage.ts`, Supabase `sessions` table
- UI: `components/`, `constants/colors.tsx`, `constants/theme.ts`
- API conventions: `app/**/api/*+api.ts`, `ExpoApiResponse.ts`

---

For questions or unclear patterns, check `README.md` or ask for clarification.
