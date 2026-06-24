
Optimized tool selectionI'll create a short plan tracking steps to produce the CLAUDE.md.

Created 4 todos

# Project Mission
Define a trustworthy, delightful AI Life Companion that helps users plan, learn, remember, and act—while feeling calm, premium, and private. The product should anticipate needs, reduce cognitive load, and provide clear, compassionate guidance without clutter.

# Project Vision
A subtle, elegant mobile experience that becomes a user's calm digital companion:
- Proactive assistance that respects user autonomy and privacy.
- Frictionless daily routines, context-aware recommendations, and gentle nudges.
- A premium, minimal UI with accessible, inclusive design.
- An architecture built for maintainability, testability, and safe AI integration.

# Development Philosophy
- Minimalism first: remove features that don’t clearly help a user.
- Single responsibility: each screen, component, and module has one purpose.
- Composition over duplication: prefer small composable building blocks to large reusable monoliths.
- Readability over cleverness: prefer explicit, well-named code.
- Clean separation: keep business logic, side effects, and state outside the UI layer.
- Incremental quality: ship safe, testable increments with clear API contracts.
- Accessibility-by-default: design and code with assistive users in mind from day one.
- Avoid unnecessary dependencies; add libraries only with a measurable ROI.

# Tech Stack
- React Native (latest stable)
- Expo (SDK aligned to React Native version)
- TypeScript (strict)
- Expo Router for navigation & deep linking
- Jest + React Native Testing Library for unit & component tests
- ESlint + Prettier for formatting & linting
- Optional: Reanimated / LayoutAnimation for motion (only when necessary)
- Optional lightweight analytics and logging backends (config-driven; must support opt-out)

# Folder Structure
High-level (guided, not prescriptive):
- `app/` — Expo Router entry (screens, layout files)
- `src/`
  - `components/` — small, reusable UI components (presentational only)
  - `screens/` — screen-level components mapped to routes
  - `features/` — feature modules containing UI, hooks, state, tests for a domain
  - `services/` — API clients, persistence, platform integrations
  - `hooks/` — reusable hooks (UI-agnostic where possible)
  - `lib/` — utilities and pure functions
  - `styles/` — design tokens, global styles, theme provider
  - `navigation/` — navigation helpers beyond router files
  - `state/` — global state stores and orchestration
  - `assets/` — images, icons, fonts
  - `types/` — shared TypeScript types and API DTOs
  - `tests/` — test utilities and mocks
- `expo/`, config files, `package.json`, README, docs

Folder responsibilities are further detailed below.

# Naming Conventions
- Files: `kebab-case` for files and directories (e.g., `primary-button.tsx`, `user-profile.ts`).
- Components: `PascalCase` (e.g., `PrimaryButton`, `UserProfileCard`).
- Hooks: `useCamelCase` prefixed with `use` (e.g., `useUserSettings`).
- Services: `camelCase` for instances, `PascalCase` for classes (prefer functions) (e.g., `analyticsClient`, `ApiClient`).
- Types & Interfaces: `PascalCase` with explicit suffixes when helpful (`UserProfile`, `ApiResponse<T>`).
- Constants: `UPPER_SNAKE_CASE` for compile-time constants; theme tokens use `camelCase`.
- Events/Actions: `verb:noun` string form for logging and analytics (e.g., `navigate:home`, `action:completeOnboarding`).
- Boolean props: prefix with `is`/`has` (e.g., `isEnabled`, `hasUnread`).
- Files exporting a single component should default export that component.

# React Native Best Practices
- Keep components pure and small; prefer functional components and hooks.
- Avoid heavy logic in render. Use memoization (`React.memo`, `useMemo`, `useCallback`) sparingly and where beneficial.
- Flatten component trees where it improves clarity; avoid deep prop drilling—use context or local state where appropriate.
- Use platform-specific files only when necessary (`.native.tsx`, `.web.tsx`).
- Prefer controlled components and explicit prop contracts.
- Avoid anonymous inline functions for frequently re-rendered components unless trivial.
- Use `Accessibility` props (`accessibilityLabel`, `accessibilityRole`, etc.) everywhere interactive elements exist.
- Test UI behavior, not implementation details.

# Expo Best Practices
- Keep `app.json` / `app.config.js` minimal and environment-aware.
- Use Expo managed workflow where possible to speed iteration; eject only when required (document reasons).
- Leverage Expo's asset bundling and OTA updates carefully—treat OTA as a fast fix channel but not a replacement for releases.
- Use `expo-constants` and `expo-application` for environment checks; avoid reading native-only values directly.
- Keep native dependencies to a minimum; prefer JS-first solutions if they meet accessibility/perf needs.
- Use `app.json` configs and runtime env variables with clear documentation and fallbacks.

# TypeScript Rules
- Use `strict: true` in `tsconfig`.
- Avoid `any`. Use `unknown` when necessary and narrow it immediately.
- Prefer concrete, explicit types over wide union/discriminated unions where helpful.
- Place common types in `src/types/` and feature-specific types next to feature code.
- Use `ReturnType<>`, `Parameters<>` utilities to avoid duplication when appropriate.
- Prefer composition in types: small focused interfaces combined by intersection/extends.
- Keep type helpers minimal and well-documented.
- Write types for API responses (DTOs) and map to internal domain models immediately in the service layer.

# Component Architecture
- Components must be small and focused (UI primitives, atoms, molecules).
- Compose from primitives: `View`, `Text`, `Touchable`, `Icon`, `Image`, and small layout helpers.
- Presentational components should be stateless; pass actions as props.
- Container components (in features) orchestrate data fetching and wire services to presentational components.
- Prop lists should be kept short—use object props (config objects) if there are many optional settings.
- Expose a clear, minimal API surface for each component.
- Document common components with usage examples and prop descriptions.

# Screen Architecture
- One screen = one responsibility.
- Screens orchestrate small components and declare side effects via hooks (e.g., `useEffect`, `useSuspendableQuery`).
- Screen lifecycle effects should be explicit and cancellable (clean up subscriptions, abort fetches).
- Each screen folder: `index.tsx` (screen), `styles.ts`, `types.ts`, and `components/` (screen-scoped components).
- Screens should prefer declarative loading and error states using small reusable UI blocks.

# Navigation Guidelines
- Use Expo Router as single source of truth for routes and deep links.
- Prefer nested, named layouts for consistent headers/tab bars.
- Keep navigation params typed and narrow; define route param types in `types/` and reuse.
- Avoid coupling navigation deeply into business logic; provide navigation callbacks as functions.
- Use shallow navigation updates for small state changes and deep navigation for task boundaries.
- Centralize modal and ephemeral navigation flows under dedicated layout files.

# Styling Guidelines
- Use a design token system (see Design System section). Prefer a theme provider for runtime theming.
- Use CSS-in-JS (styled-components, emotion) or React Native StyleSheet — stay consistent across the codebase.
- Keep inline styles minimal and derive styles from tokens.
- Prefer percentage or flexbox layouts over absolute pixels where adaptability is required.
- Test styles on multiple device sizes and with large accessibility font scaling.
- Avoid complex nested style merging at run-time; compute style objects outside render when expensive.

# Design System
Provide a single source of truth for UI tokens and primitives.

Colors (sample tokens)
- `primary` — #0A84FF (interactive elements)
- `primary-600` — #0060C8
- `background` — #FFFFFF
- `surface` — #F7F8FA
- `muted` — #8E8E93
- `success` — #34C759
- `warning` — #FFCC00
- `danger` — #FF3B30
- `overlay` — rgba(0,0,0,0.5)
Notes: Provide light/dark variants; reference tokens by semantic name, not hex.

Typography
- Scale: base 16pt (mobile baseline), scale with device accessibility settings.
- Tokens: `type.h1`, `type.h2`, `type.body`, `type.caption`, `type.button`.
- Weight: Use system fonts when possible (San Francisco / Roboto) for a native feel. Include fallbacks.
- Line-height: 1.2–1.6 depending on role; ensure readable contrast and spacing.

Spacing
- Base spacing unit: 8 (multiples: 4, 8, 12, 16, 24, 32).
- Layouts should use spacing tokens, not hard-coded numbers.

Border Radius
- Small: 6
- Medium: 12
- Large: 20
- Use tokens `radius.sm`, `radius.md`, `radius.lg`.

Shadows
- Soft, subtle shadows; prefer elevation tokens mapped to platform-appropriate shadow definitions.
- Avoid heavy drop shadows—use minimal shadow depth and subtle overlays for depth cues.

Icons
- Use a single icon system and library; prefer vector icons (SVG) for crisp scaling.
- Tokens: `icon.xs` (12), `icon.sm` (16), `icon.md` (24), `icon.lg` (32).
- Provide accessibility labels for icons that convey meaning.

# UI Principles
- Calm, premium: whitespace is as important as content; avoid dense UI.
- Large touch targets: minimum 44x44pt tappable area.
- Soft motion: use subtle, consistent animations to indicate state changes.
- System-native affordances: follow platform conventions where applicable.
- Conservative notifications: limit interruptions and provide clear dismiss actions.

# Accessibility
- Default to accessible components: every interactive element must have `accessibilityLabel`, `accessibilityRole`.
- Support dynamic type: verify UI with 100%, 125%, 150% text sizes.
- High contrast & color-blindness: don't rely on color alone; pair colors with labels/icons.
- Focus management: manage focus order for screen readers and keyboard navigation.
- Provide haptic and audio alternatives where helpful but never required.
- Test with VoiceOver and TalkBack early and often.

# Performance
- Profile before optimizing; don’t pre-optimize.
- Use flat lists with proper `keyExtractor`, `getItemLayout`, and `initialNumToRender`.
- Avoid unbounded re-renders: use immutable updates, memoization when necessary.
- Lazy-load non-critical screens and assets.
- Use image size variants and `Image` caching strategies.
- Keep JS bundles small; prefer code-splitting and route-based lazy loading.
- Avoid heavy synchronous operations on the main thread.

# Error Handling
- Fail gracefully: show clear, helpful UI for recoverable errors and a concise message for fatal errors.
- Use result/option types for predictable error flows in services.
- Surface retry affordances where appropriate.
- For async work, always support cancellation/cleanup.
- Keep error strings localizable; do not leak internal error messages to users.

# Logging
- Structured logging with levels: `debug`, `info`, `warn`, `error`.
- No PII in logs. Mask or exclude sensitive data before logging.
- Centralize logging interface in `services/logging`.
- Local log verbosity configurable by environment.
- Provide a privacy-safe option for user support logs (explicit opt-in).

# API Layer
- Centralized API client in `services/api`.
- Use typed request/response DTOs and map to domain models at client boundary.
- Retry with exponential backoff for idempotent operations; surface circuit-breaker for persistent failures.
- Respect network conditions and allow offline-first behavior where practical (caching, optimistic updates).
- Use an adapter pattern to support mocked backends for testing.

# State Management
- Prefer local state and React Query / SWR style patterns for server-synced data.
- Use a minimal global state store for truly global concerns (e.g., auth, app theme, navigation-modal state).
- Encapsulate shared state access in feature modules, not in random components.
- Avoid "god stores": keep slices focused and composable.
- Persist minimal essential data using secure storage; expiration and migration strategies are required.

# Folder Responsibilities
- `components/`: generic, dependency-free UI atoms/molecules.
- `screens/`: top-level route screens; import `components` and `features`.
- `features/`: domain features with their own `ui`, `hooks`, `api`, and `state`.
- `services/`: external interaction layers (APIs, analytics, storage).
- `hooks/`: composable utilities that are UI-agnostic where possible.
- `lib/`: pure utilities and helpers.
- `styles/`: theme, tokens, and global style helpers.
- `tests/`: shared test utilities and setup.

# Reusable Components
Examples of components to centralize:
- `Button` / `PrimaryButton` / `IconButton`
- `TextField` / `SearchField` / `MaskedInput`
- `Card`, `Sheet`, `Dialog`, `ListItem`
- `Spinner`, `EmptyState`, `ErrorState`
- `Avatar`, `Badge`, `Tooltip`
Rules:
- Each reusable component exports documentation and usage examples.
- Keep props minimal; favor composition (`leftIcon`, `rightAccessory`, `children`).
- Visual variants should be provided via tokens, not hard-coded styles.

# Animations
- Use motion to guide attention, not to decorate.
- Create small utility hooks for common patterns: `useFade`, `useSlide`, `useScale`.
- Prefer native-backed animation APIs for performance (Reanimated, LayoutAnimation).
- Respect `prefers-reduced-motion` and provide motion-reduced alternatives.
- Keep durations short and easing gentle (e.g., 180–300ms with ease-out).

# Git Commit Style
- Use Conventional Commits-like naming:
  - `feat:` new features
  - `fix:` bug fixes
  - `chore:` tooling/config
  - `docs:` documentation
  - `refactor:` code changes without functional changes
  - `test:` tests
- Keep subject lines under 72 characters.
- Body: one-paragraph explanation of why the change was made.
- Link relevant issue/ticket IDs if applicable.

# Documentation Rules
- Document public APIs, components, and feature boundaries.
- README.md at repo root with setup and run steps.
- Each feature folder should have a short README.md describing responsibilities.
- Keep docs versioned alongside code. Prefer examples over prose where useful.
- Include migration notes when changing tokens, themes, or public interfaces.

# Code Review Checklist
- Does the PR adhere to folder / naming conventions?
- Is the change scoped and minimal?
- Are components small and single-purpose?
- Is business logic separated from UI?
- Are types complete and `strict` friendly?
- Are all new behaviors tested? (unit + component)
- Are accessibility attributes present for interactive UI?
- Are performance implications considered?
- Any new dependencies justified and approved?
- Are docs, changelogs, and README updated if necessary?
- Are secrets and PII excluded from diffs and logs?

# Future Expansion Rules
- Add features incrementally with small public interfaces.
- Introduce new dependencies only when a 2x productivity or capability improvement can be shown.
- For large platform-specific features, add an integration plan and tests.
- Maintain backwards compatibility for public APIs unless a migration path is provided.
- When adding heavy capabilities (e.g., local LLMs), provide opt-in and privacy controls.

# Operational & Security Notes
- Store secrets in secure storage/config; do not commit to source.
- Follow principle of least privilege for backend services.
- Provide clear data retention and deletion flows for user data.
- Build telemetry with privacy-preserving defaults and opt-out/in choices.

# Final Principles (Quick Reference)
- Never over-engineer.
- Keep components small.
- Prefer composition over duplication.
- Every screen should have a single responsibility.
- Use reusable UI components whenever possible.
- Prefer readability over clever code.
- Follow clean architecture.
- Keep business logic separate from UI.
- Avoid unnecessary libraries.
- Optimize for maintainability over speed of development.
- Build production-quality software.

Appendix: Where to start
- Read `src/styles/` tokens and `app/` routes.
- Implement one small screen with a composed set of components and tests to establish patterns.
- Add a lightweight CI job that runs lint, typecheck, and tests on PRs.

End of CLAUDE.md.