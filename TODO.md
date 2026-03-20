# Paw Match Modernization & Improvement TODO

This file tracks key improvements for updating and securing the app, based on current Expo/React Native best practices (2025+). AI agents and developers should reference and update this list as tasks are completed.

## TODOs

- [ ] **Upgrade Expo Router to v3+**
  - Refactor routes/layouts to use new conventions (e.g., `(group)` folders)
- [ ] **Move Supabase service key out of client**
  - Use only anon/public keys in the app
  - Move admin/service keys to a secure backend or serverless function
- [ ] **Switch session storage to SecureStore**
  - Store sensitive tokens in Expo SecureStore instead of AsyncStorage
- [x] **Adopt Expo environment variable system**
  - Renamed NEXT_PUBLIC_ prefix to EXPO_PUBLIC_ convention
- [ ] **Extract API logic to `lib/` or `services/`**
  - Improve testability and separation of concerns
- [x] **Upgrade Expo SDK and dependencies**
  - Upgraded to Expo SDK 55, React 19.2, RN 0.83
- [ ] **Optimize images with `expo-image`**
  - Replace legacy image components for better caching/performance
- [ ] **Preload fonts in splash screen**
  - Use latest `expo-font` hooks and preload for smoother UX
- [ ] **Add E2E and unit tests**
  - Use Detox/Playwright for E2E, and add unit tests for API logic
- [ ] **Review and update DB migration tooling**
  - Ensure `ley` is maintained or migrate to Supabase/Prisma migrations
- [x] **Remove unused dependencies**
  - Removed 18 unused packages from package.json
- [ ] **Document all scripts and workflows**
  - Ensure README is up to date and scripts are cross-platform
- [ ] **Improve accessibility**
  - Add accessibility props to all interactive components
- [ ] **Secure Cloudinary uploads**
  - Use signed upload URLs from backend, not unsigned direct uploads

---

Update this file as tasks are completed or new modernization needs arise.
