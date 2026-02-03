# CLAUDE.md - AI Assistant Guide for Paw Match

This document provides comprehensive guidance for AI assistants working on the Paw Match codebase.

## Project Overview

**Paw Match** is a mobile app built with Expo/React Native that helps dog owners find playdate matches for their dogs. The app uses a custom matching algorithm based on dog attributes (size, age, activity level) and location proximity.

- **Live App**: https://pawmatch.xyz/
- **Tech Stack**: Expo SDK 54, React Native 0.81, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL) - no separate backend service
- **Package Manager**: pnpm (v10.7.0)

## Quick Commands

```bash
# Development
pnpm start              # Start Expo dev server
pnpm android            # Run on Android
pnpm ios                # Run on iOS
pnpm web                # Run on web

# Code Quality
pnpm tsc                # Type checking
pnpm eslint . --max-warnings 0  # Linting

# Utilities
pnpm test:email         # Test email sending via Resend
```

## Project Structure

```
paw_match/
├── app/                      # Expo Router pages and API routes
│   ├── _layout.tsx           # Root layout (session management)
│   ├── (auth)/               # Authentication screens
│   │   ├── api/              # Auth API routes (+api.ts files)
│   │   ├── login.tsx
│   │   ├── register*.tsx     # Multi-step registration flow
│   │   ├── forgotPassword.tsx
│   │   └── welcome.tsx
│   ├── (tabs)/               # Main app screens (authenticated)
│   │   ├── api/              # App API routes
│   │   ├── index.tsx         # Home/match screen
│   │   ├── profile.tsx
│   │   └── match.tsx
│   └── (files)/              # Settings and other screens
├── components/               # Reusable UI components
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx
│   ├── FullPageContainer.tsx
│   └── ...
├── constants/                # Theme and colors
│   ├── colors.tsx            # Color palette
│   └── theme.ts              # React Native Paper themes
├── util/                     # Utility functions
│   ├── sessionStorage.ts     # AsyncStorage session wrapper
│   └── emails.ts             # Resend email templates
├── scripts/                  # Development scripts
├── android/                  # Native Android project
├── supabaseClient.ts         # Supabase client configuration
├── ExpoApiResponse.ts        # API response helper class
└── cloudinaryConfig.ts       # Image upload config
```

## Key Architectural Patterns

### Expo Router Navigation

- File-based routing in `app/` directory
- Route groups: `(auth)`, `(tabs)`, `(files)`
- Root layout (`app/_layout.tsx`) handles session checks and redirects
- Typed routes enabled via `experiments.typedRoutes` in app.json

### API Routes (Server Functions)

API endpoints are colocated with their features using the `+api.ts` convention:

```typescript
// app/(auth)/api/login+api.ts
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { supabase } from '../../../supabaseClient';

export async function POST(request: Request): Promise<ExpoApiResponse<LoginResponse>> {
  const body = await request.json();
  // ... business logic
  return ExpoApiResponse.json({ user, token }, { status: 200 });
}
```

**Key conventions:**
- Always use `ExpoApiResponse.json()` for consistent responses
- Validate session tokens via `Authorization: Bearer <token>` header
- Use `supabase` client for RLS-respecting queries
- Use `supabaseAdmin` only for operations requiring elevated privileges

### Session Management

Sessions are stored in two places:
1. **Supabase `sessions` table** - server-side validation
2. **AsyncStorage** - client-side persistence via `util/sessionStorage.ts`

```typescript
import { sessionStorage } from '../util/sessionStorage';

// Store session after login
await sessionStorage.setSession(token);

// Check session on app start
const token = await sessionStorage.getSession();

// Clear on logout
await sessionStorage.clearSession();
```

### Database Access (Supabase)

Two clients available in `supabaseClient.ts`:
- `supabase` - Uses anon key, respects Row Level Security (RLS)
- `supabaseAdmin` - Uses service role key, bypasses RLS (for registration, admin tasks)

**Tables:**
- `owners` - User accounts
- `dogs` - Dog profiles
- `dog_preferences` - Dog matching preferences
- `sessions` - Active user sessions
- `verification_codes` - Email verification codes

### Matching Algorithm

Located in `app/(tabs)/api/matches+api.ts`:
- Matches dogs based on size, age group, and activity level
- Filters by postal code proximity (Vienna district mapping)
- Score threshold: minimum 5 points for a match
- Scoring: size match = 2 pts, activity match = 4 pts, age match = 4 pts

## Code Style & Conventions

### TypeScript

- Strict mode enabled
- ESLint with TypeScript plugin (flat config in `eslint.config.js`)
- Unused vars error (except `_` prefixed args)
- No explicit `any` warning disabled for flexibility

### Component Patterns

- Functional components with hooks
- React Native Paper for Material Design components
- Custom styled components in `components/`
- Colors from `constants/colors.tsx`, themes from `constants/theme.ts`

### Color Palette

```typescript
// Primary colors
green: '#515a47'     // Main brand color, backgrounds
yellow: '#d7be82'    // Accents, highlights
brown: '#400406'     // Text, headings (dark)
white: '#fdecde'     // Light backgrounds, cards
```

### Fonts

- **Logo**: Modak (`@expo-google-fonts/modak`)
- **UI**: System fonts, Montserrat

## Environment Variables

Required variables in `.env.development` / `.env.production`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
RESEND_FROM=verify@pawmatch.at

# Image uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=pawmatch
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Performance
EXPO_USE_FAST_RESOLVER=1
```

**Important**: Restart dev server (`pnpm start`) after changing environment variables.

## CI/CD & Deployment

### GitHub Actions CI

Runs on every push (`.github/workflows/ci.yml`):
1. Install dependencies with pnpm
2. Generate typed routes
3. Type check with `pnpm tsc`
4. Lint with `pnpm eslint . --max-warnings 0`

### EAS Deployment

```bash
# OTA Updates (iOS/Android)
pnpm dlx eas-cli@latest update --branch production --message "description"

# Native builds for app stores
pnpm dlx eas-cli@latest build --platform ios|android|all

# Web deployment
npx expo export --platform web
pnpm dlx eas-cli@latest deploy --prod
```

## AI Assistant Best Practices

### DO

1. **Read files before modifying** - Always understand existing code first
2. **Use type checking** - Run `pnpm tsc` to validate changes
3. **Run linting** - Run `pnpm eslint . --max-warnings 0` before finishing
4. **Follow existing patterns** - Match the codebase style for API routes, components, etc.
5. **Use environment variables** - Never hardcode secrets or API keys
6. **Test incrementally** - Verify each significant change

### DON'T

1. **Don't run interactive processes in background** - `pnpm start` requires user interaction
2. **Don't hardcode Supabase credentials** - Always use environment variables
3. **Don't bypass RLS unnecessarily** - Use `supabase` over `supabaseAdmin` when possible
4. **Don't create unnecessary files** - Edit existing files when possible
5. **Don't over-engineer** - Keep solutions simple and focused on the task

### Debugging Authentication Issues

When investigating login/auth failures:
1. Verify `supabaseClient.ts` uses environment variables (not hardcoded values)
2. Confirm `.env.development` values match the target Supabase project
3. Check if dev server needs restart after env changes
4. Use console.log in API routes (output appears in `pnpm start` terminal)
5. Create debug scripts in `scripts/` folder to test queries directly

### Verification Workflow

```bash
# 1. Make code changes

# 2. Type check
pnpm tsc

# 3. Lint
pnpm eslint . --max-warnings 0

# 4. Stop - let user run `pnpm start` for interactive testing
```

## Known Issues & Tech Debt

See `TODO.md` for modernization tasks including:
- Upgrading Expo Router to v3+
- Moving service keys to secure backend
- Switching to SecureStore for tokens
- Adding E2E tests

## File Reference Quick Links

| Purpose | File |
|---------|------|
| Root layout & auth redirect | `app/_layout.tsx` |
| Login API | `app/(auth)/api/login+api.ts` |
| Matching algorithm | `app/(tabs)/api/matches+api.ts` |
| Session storage | `util/sessionStorage.ts` |
| Supabase client | `supabaseClient.ts` |
| API response helper | `ExpoApiResponse.ts` |
| Color definitions | `constants/colors.tsx` |
| Theme definitions | `constants/theme.ts` |
| Email templates | `util/emails.ts` |
| ESLint config | `eslint.config.js` |
| CI workflow | `.github/workflows/ci.yml` |

## Questions?

- Check `README.md` for user-facing documentation
- Check `.github/copilot-instructions.md` for additional context
- Check `TODO.md` for planned improvements
