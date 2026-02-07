# Test Coverage Analysis — Paw Match

## Current State

**The project has zero automated tests.** There are no test files, no testing framework configured, and no test scripts (aside from a manual `test:email` script). This means every code path — authentication, matching logic, API endpoints, form validation, session management — is entirely untested.

Additionally, **Zod is listed as a dependency but is not used anywhere**, meaning all validation is done with ad-hoc inline checks that are easy to get wrong and impossible to test in isolation.

---

## Recommended Testing Strategy

### Phase 1 — Setup & Pure Logic (High Impact, Low Effort)

#### 1. Install a test framework

Add **Vitest** (fast, ESM-native, works well with TypeScript) along with a minimal set of testing utilities:

```
pnpm add -D vitest @testing-library/react-native @testing-library/jest-dom
```

Add a `test` script to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

#### 2. Dog matching algorithm (`app/(tabs)/api/matches+api.ts`)

This is the **single most important piece of business logic** in the app. The `calculateMatchScore` function scores two dogs on a 0–10 scale using size, activity level, and age group. The `getAgeGroup` helper buckets a birth date into PUPPY / YOUNG / ADULT / SENIOR.

**What to test:**
- Score is 10 when size, activity, and age group all match
- Score is 0 when nothing matches
- Partial matches (e.g., same size but different activity → score 2)
- Boundary conditions for age groups (exactly 1 year, exactly 3 years, exactly 8 years)
- Dogs from non-adjacent postal codes are never returned
- Dogs belonging to the same owner are excluded
- Only matches with score >= 5 are returned

**Why this matters:** A bug here silently gives users bad matches. There is no UI feedback that would make a scoring error obvious.

#### 3. Age group classification

The `getAgeGroup` function uses date arithmetic. Edge cases are especially tricky:

- A dog born exactly 365 days ago — is it PUPPY or YOUNG?
- A dog born on Feb 29 in a leap year — how does the age calculation behave?
- A dog born today (age 0)

#### 4. Postal code adjacency (`POSTCODE_ADJACENCY` map)

The hardcoded adjacency map determines which users can see each other. Tests should verify:

- Symmetry: if 1010 lists 1020 as adjacent, then 1020 lists 1010
- Completeness: every postcode referenced as a neighbor is itself a key in the map
- No self-references

---

### Phase 2 — API Endpoint Testing (High Impact, Medium Effort)

Every API route follows the same pattern: parse request → validate fields → call Supabase → return response. These should be tested with the Supabase client mocked.

#### 5. Registration endpoint (`app/(auth)/api/register+api.ts`)

**What to test:**
- Returns 400 when any required field is missing (email, password, name, postal_code)
- Returns 400 when email is already registered
- Hashes the password (never stores plaintext)
- Generates a 6-digit verification code
- Creates a session token with 7-day expiry
- Sends a verification email
- Returns the session token on success

#### 6. Login endpoint (`app/(auth)/api/login+api.ts`)

**What to test:**
- Returns 400 for missing email or password
- Returns 401 for non-existent email
- Returns 401 for wrong password
- Returns 403 for unverified account
- Returns 200 with session token for valid credentials
- Session token has 30-day expiry

#### 7. Password reset flow (`forgotPassword+api.ts` → `resetPassword+api.ts`)

**What to test:**
- Forgot-password returns 200 even when email doesn't exist (no information leak)
- Reset token is hashed before storage (not stored in plaintext)
- Expired reset tokens are rejected
- Password is re-hashed on reset
- Reset token is cleared after successful reset

#### 8. Email verification (`verify-email+api.ts`, `verifyEmail+api.ts`)

**What to test:**
- Correct code marks the user as verified
- Wrong code returns an error
- Already-verified users are handled gracefully

#### 9. Session-protected endpoints (`user+api.ts`, `hasDog+api.ts`, `matches+api.ts`, `logout+api.ts`)

**What to test:**
- Returns 401 when no Authorization header is present
- Returns 401 when the session token is expired or invalid
- Returns correct data for valid sessions

#### 10. Add dog endpoint (`addAnotherDog+api.ts`)

**What to test:**
- Returns 400 for missing required fields
- Creates default preferences (all true) alongside the dog record
- Rejects invalid size/activity_level values

---

### Phase 3 — Input Validation (Medium Impact, Medium Effort)

#### 11. Replace inline validation with Zod schemas

Zod is already a dependency — it should actually be used. Define schemas for every API request body and every form:

```typescript
// Example: schemas/registration.ts
import { z } from 'zod';

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  postal_code: z.string().regex(/^1\d{2}0$/),
});
```

**What to test:**
- Valid inputs pass
- Each invalid field produces the correct error
- Edge cases: empty strings, very long strings, special characters, SQL injection attempts

#### 12. Email validation

The current regex (`/\S+@\S+\.\S+/`) accepts many invalid emails (e.g., `a@b.c`, `@@..`). Tests should document the current behavior and then tighten it.

#### 13. Postal code validation

Postal codes are Vienna-specific (1010–1230). Test that:
- Valid codes are accepted
- Codes outside Vienna are rejected
- Non-numeric input is rejected

---

### Phase 4 — Component / Screen Testing (Medium Impact, Higher Effort)

#### 14. Form components

Test the registration and login forms with React Testing Library:

- Fields display validation errors on submit with empty inputs
- Password field masks input
- Submit button is disabled during loading
- Error messages from the API are displayed

#### 15. Match display (`app/(tabs)/match.tsx`)

- Renders "no matches" state correctly
- Renders match cards with dog name, image, score
- Handles API error gracefully

#### 16. Auth guard (`app/_layout.tsx`)

The root layout checks for a stored session and redirects accordingly:

- With no session → redirects to welcome screen
- With valid session → shows main tabs
- Session check failure → handles gracefully

---

### Phase 5 — Security & Edge Cases (High Impact, Lower Volume)

#### 17. Password hashing

- Verify bcrypt is called with cost factor 10
- Verify plaintext password is never logged or stored
- Verify password comparison uses constant-time bcrypt.compare

#### 18. Session token generation

- Tokens are cryptographically random (32 bytes hex)
- Expired sessions are rejected
- Logging out actually deletes the session from the database

#### 19. Rate limiting & abuse (currently absent)

Not testable yet since no rate limiting exists, but tests should be added when it is implemented:

- Brute-force login attempts
- Rapid registration attempts
- Verification code guessing

---

## Priority Matrix

| Area | Impact | Effort | Priority |
|---|---|---|---|
| Matching algorithm | Very High | Low | **P0** |
| Age group boundaries | High | Low | **P0** |
| Postal code adjacency | Medium | Low | **P0** |
| Login API | High | Medium | **P1** |
| Registration API | High | Medium | **P1** |
| Password reset flow | High | Medium | **P1** |
| Session validation | High | Medium | **P1** |
| Zod schema validation | Medium | Medium | **P2** |
| Email verification API | Medium | Medium | **P2** |
| Add dog API | Medium | Medium | **P2** |
| Form components | Medium | High | **P3** |
| Auth guard / routing | Medium | High | **P3** |
| Match display screen | Low | High | **P3** |

---

## Summary

The most urgent gap is the **complete absence of tests for the matching algorithm** — the core feature of the app. A bug in `calculateMatchScore` or `getAgeGroup` would silently degrade the user experience with no safety net.

The second priority is **API endpoint tests**, particularly for authentication. These flows handle passwords, sessions, and email verification — all security-sensitive operations where bugs can lead to data exposure or account lockout.

The third priority is **adopting Zod for validation**. The library is already installed but unused, and the current inline validation is inconsistent and untestable in isolation.

Starting with the matching algorithm alone would give meaningful coverage of the app's most critical logic in under a day of work.
