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
- **Test email sending:** `pnpm test:email` (sends test emails via Resend)
- **Type checking:** `pnpm tsc`
- **Linting:** `pnpm eslint . --max-warnings 0` (custom ESLint config, no PostgreSQL tools)
- **Backend scripts:** See `scripts/` for utilities

**Note:** Database migrations are managed by Supabase directly; no local migration tool is used.

## Project Conventions

- **API route files** are named with `+api.ts` (e.g., `login+api.ts`).
- **Session tokens** are stored in Supabase `sessions` table and in local async storage.
- **All navigation is declarative** via Expo Router; do not use imperative navigation outside router hooks.
- **Color and theme**: Use values from `constants/colors.tsx` and `constants/theme.ts` for all UI styling.
- **No separate backend server**: All business logic is colocated with the Expo app in API route files.

## Integration Points

- **Supabase**: All data access (users, dogs, sessions, matches) is via Supabase client (`supabaseClient.ts`). NO local PostgreSQL.
- **Cloudinary**: Used for image uploads (config in `cloudinaryConfig.ts`).
- **Email**: Sending via Resend SDK. Templates in `util/emails.ts` (HTML-based with 4-color design).
- **GitHub Actions**: Simple CI workflow (type checking + linting). No database setup needed. ESLint uses custom flat config (no @ts-safeql or libpg-query).

## Examples

- **Add a new API route:** Place a `*+api.ts` file in the appropriate `app/(feature)/api/` folder and export async `GET`/`POST` functions.
- **Add a new screen:** Place a `.tsx` file in the relevant `app/(feature)/` folder and add a route in the router stack if needed.
- **Use session:** Import from `util/sessionStorage.ts`.

## Design & Colors

The app uses a **clean, simple 4-color palette** for consistency:
- **Primary:** `#515a47` (green) - main brand color, buttons, headers
- **Accent:** `#d7be82` (warm yellow) - highlights, secondary elements
- **Dark:** `#400406` (dark brown) - text, headings
- **Light:** `#fdecde` (warm white) - backgrounds, cards

**Fonts:** 
- Logo uses **Modak** (`@expo-google-fonts/modak`)
- UI uses system fonts and Montserrat

**Email Templates:** Located in `util/emails.ts`, uses HTML tables with inline styles. Logo styling: yellow (`#e9b44c`) on green header, white text on green code background.

## Removed Dependencies & Tech Debt

The following PostgreSQL-specific tools were removed to simplify the codebase:
- `libpg-query`, `@ts-safeql/eslint-plugin` (SQL parsing for local PostgreSQL)
- `@upleveled/ley` (local migration tool)
- `postgres`, `prettier-plugin-sql` (PostgreSQL-specific)
- Custom `eslint-config-upleveled` → replaced with own flat ESLint config

This reduces CI complexity and eliminates native module compilation errors in GitHub Actions.

## Deployment & Hosting

### iOS/Android (EAS Update – OTA Updates)

- **Login:** `pnpm dlx eas-cli@latest whoami` (login if needed: `pnpm dlx eas-cli@latest login`)
- **Check project:** `pnpm dlx eas-cli@latest project:info` (should show ID: `a69e0873-0c47-4d59-a8cd-ed0cc0ac9010`)
- **Push OTA update:** `pnpm dlx eas-cli@latest update --branch production --message "feat: description"`
  - App instances on the `production` channel pull updates automatically
  - Runtime version is pinned to `"1.0.0"` in `app.json` (required for bare workflow)
- **For native builds (Stores):** `pnpm dlx eas-cli@latest build --platform ios|android|all`

### Web (EAS Hosting)

- **Export for web:** `npx expo export --platform web` → creates `dist/` folder
- **Preview deploy:** `pnpm dlx eas-cli@latest deploy` → preview URL (`.expo.app`)
- **Production deploy:** `pnpm dlx eas-cli@latest deploy --prod`
- **Auto-deploy on push:** Create `.eas/workflows/deploy-web.yml` with trigger on `main` branch

## References

- Main entry: `app/_layout.tsx`
- Matching logic: `app/(tabs)/api/matches+api.ts`
- Session: `util/sessionStorage.ts`, Supabase `sessions` table
- UI: `components/`, `constants/colors.tsx`, `constants/theme.ts`
- API conventions: `app/**/api/*+api.ts`, `ExpoApiResponse.ts`

---

For questions or unclear patterns, check `README.md` or ask for clarification.
