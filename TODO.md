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
- [ ] **Adopt Expo environment variable system**
  - Move secrets/config to `.env` or `app.config.ts`
- [ ] **Extract API logic to `lib/` or `services/`**
  - Improve testability and separation of concerns
- [ ] **Upgrade Expo SDK and dependencies**
  - Use latest Expo, React Native, and Paper versions
- [ ] **Optimize images with `expo-image`**
  - Replace legacy image components for better caching/performance
- [ ] **Preload fonts in splash screen**
  - Use latest `expo-font` hooks and preload for smoother UX
- [ ] **Add E2E and unit tests**
  - Use Detox/Playwright for E2E, and add unit tests for API logic
- [ ] **Review and update DB migration tooling**
  - Ensure `ley` is maintained or migrate to Supabase/Prisma migrations
- [ ] **Remove unused dependencies**
  - Audit and clean up `package.json`
- [ ] **Document all scripts and workflows**
  - Ensure README is up to date and scripts are cross-platform
- [ ] **Improve accessibility**
  - Add accessibility props to all interactive components
- [ ] **Secure Cloudinary uploads**
  - Use signed upload URLs from backend, not unsigned direct uploads

---

Update this file as tasks are completed or new modernization needs arise.
