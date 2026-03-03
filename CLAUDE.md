# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Flotaris**, a Next.js web application built with modern tooling

**Tech Stack:**
- Next.js 15.3.4 with App Router
- React 19
- TypeScript (strict mode enabled)
- Tailwind CSS 4
- shadcn/ui components (New York style)
- pnpm package manager

## Development Commands

```bash
# Development
pnpm dev                 # Start dev server with Turbopack
pnpm build              # Build for production
pnpm start              # Start production server

# Quality checks
pnpm lint               # Run ESLint
pnpm typecheck          # TypeScript type checking (tsc --noEmit)
pnpm validate           # Run both lint and typecheck

# Git hooks (automated via Husky)
# - pre-commit: runs `pnpm validate`
# - commit-msg: validates conventional commit format
```

## Running Tests

Tests are not currently configured in this project. When tests are added, update this section.

## Architecture Guide

### Routing & Authentication

**Public Routes** (in `src/app/`):
- `page.tsx` - Login

**Authenticated Routes** (in `src/app/(authenticated)/`):
- All routes requiring authentication go here
- Uses Next.js route groups syntax: `(authenticated)`
- Has its own `layout.tsx` for shared authenticated layouts

### Feature Structure (Scream Architecture)

**IMPORTANT:** All UI components, hooks, types, and business logic live in `src/features/`. The `src/app/` directory contains ONLY Next.js pages that import and render components from features.

Each feature follows this structure:

```
src/features/[feature-name]/
  components/               # UI components specific to this feature
  hooks/                   # Business logic, state management (TanStack Query)
  types/                   # TypeScript types for this feature
  [feature]-api.ts        # API client methods (calls lib/api/apiClient)
  shared/                 # Optional: shared between sub-features only
    components/
    types/
```

**Sub-features** (optional, e.g., `clients/list`, `clients/detail`):
- Have same structure: `components/`, `hooks/`, `types/`
- Inherit API methods from parent feature's `[feature]-api.ts`
- Pages in `app/` import components from these sub-features

**Example - Clients Feature Structure**:
```
src/app/(authenticated)/clients/
  layout.tsx                # Route layout
  page.tsx                  # Imports component from features/clients
  list/
    page.tsx                # Imports component from features/clients/list
  detail/
    [id]/
      page.tsx              # Imports component from features/clients/detail

src/features/clients/
  list/
    components/
      ClientList.tsx        # Actual UI component
    hooks/
      useClientList.ts      # Business logic
    types/
      index.ts
  detail/
    components/
      ClientDetail.tsx
    hooks/
      useClientDetail.ts
    types/
      index.ts
  clients-api.ts            # All client-related API methods
  shared/                   # Shared only within clients feature
    components/
    types/
```

### Hooks Pattern

Hooks (in features `hooks/` directories) handle:
- **Data fetching**: Using TanStack Query (React Query)
- **Business logic**: Calculations, validations, state management
- **API calls**: Importing from `[feature]-api.ts`

Example hook pattern:
```typescript
// src/features/clients/list/hooks/useClientList.ts
import { useQuery } from '@tanstack/react-query';
import { getClients } from '../../clients-api';

export function useClientList() {
  return useQuery({
    queryKey: ['clients', 'list'],
    queryFn: () => getClients(),
  });
}
```

### API Layer

**lib/api/apiClient.ts**:
- Central API client configuration
- Handles authentication headers, error handling, base URLs
- Used by all feature API files

**Feature API files** (e.g., `clients-api.ts`):
- Contains ONLY methods for that feature
- Each method calls `apiClient` with appropriate endpoint
- Exported for use in hooks

Example API file pattern:
```typescript
// src/features/clients/clients-api.ts
import { apiClient } from '@/lib/api/apiClient';
import type { Client } from './shared/types';

export async function getClients(): Promise<Client[]> {
  return apiClient.get('/clients');
}

export async function getClient(id: string): Promise<Client> {
  return apiClient.get(`/clients/${id}`);
}
```

### Shared Components & Types

**src/features/shared/**:
- Components used across ALL features
- Types used across ALL features
- Hooks used across ALL features

**src/features/[feature]/shared/** (e.g., `clients/shared/`):
- Components/types shared only between sub-features of the SAME feature
- Example: common client types used by both `list` and `detail`
- NOT accessible by other features

### Component Library

shadcn/ui components configured with aliases:
- `@/components/ui` - shadcn/ui components
- `@/components` - Custom components
- `@/lib` - Utilities
- `@/features` - Feature code

Use `pnpm dlx shadcn-ui@latest add <component>` to add components.

## Styling

- **Tailwind CSS 4** with CSS variables for theming
- `cn()` utility function in `src/lib/utils.ts` merges Tailwind classes
- shadcn/ui components use class-variance-authority for variants

### IMPORTANT Styling Guidelines

**ALWAYS use shadcn/ui components for UI elements:**
- Use the MCP shadcn tool to search and add components
- Never create custom form inputs, buttons, cards, etc. when shadcn/ui equivalents exist
- Command: `pnpm dlx shadcn@latest add <component>`

**NEVER use hardcoded colors:**
- ❌ Bad: `className="bg-blue-500 text-white"`
- ✅ Good: `className="bg-primary text-primary-foreground"`
- Always use Tailwind theme variables: `background`, `foreground`, `primary`, `secondary`, `accent`, `muted`, `border`, `input`, `card`, etc.
- This ensures proper dark mode support when implemented

**Theme colors available** (defined in `src/app/globals.css`):
- `bg-background` / `text-foreground` - Base colors
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-secondary` / `text-secondary-foreground` - Secondary elements
- `bg-accent` / `text-accent-foreground` - Accent elements
- `bg-muted` / `text-muted-foreground` - Muted/subdued elements
- `border-border` - Borders
- `border-input` - Input borders
- `bg-card` / `text-card-foreground` - Card backgrounds

**ALWAYS use tabler icons from @tabler/icons-react**


## Code Quality & Git Hooks

### Husky & Pre-commit Hooks

- **Pre-commit hook** (`.husky/pre-commit`): Runs `pnpm validate` to lint and type-check
- **Commit-msg hook** (`.husky/commit-msg`): Validates conventional commit format

### Conventional Commits

Format: `type(scope): subject`

Examples:
- `feat(clients): add client list page`
- `fix(auth): resolve login redirect issue`
- `refactor(shared): improve button component`

Common types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

### ESLint & TypeScript

- **ESLint**: Next.js core web vitals + TypeScript configs
- **TypeScript**: Strict mode enabled
- Path aliases: `@/*` resolves to `src/*`
- Always run `pnpm validate` before committing

## Development Workflow

1. Create feature branch from main
2. Create feature structure if new feature (see Architecture Guide)
3. Implement with components, hooks, and types separated
4. Use TanStack Query in hooks for data fetching
5. Run `pnpm dev` to test locally
6. Run `pnpm validate` before committing
7. Follow conventional commit format
8. Push and create PR

## When Adding New Features

1. **Create the feature structure** in `src/features/[feature-name]/`:
   - `components/` - UI components
   - `hooks/` - Business logic and TanStack Query
   - `types/` - TypeScript types
   - `[feature]-api.ts` - API methods (calls lib/api/apiClient)

2. **Create the route structure** in `src/app/`:
   - Public routes: `src/app/[feature-name]/page.tsx`
   - Authenticated routes: `src/app/(authenticated)/[feature-name]/page.tsx`
   - Pages should ONLY import and render components from `src/features/`

3. **For sub-features** (e.g., list, detail):
   - Create in `src/features/[feature]/[sub-feature]/`
   - Each has its own `components/`, `hooks/`, `types/`
   - Share code via `src/features/[feature]/shared/`

4. **Always:**
   - Use shadcn/ui components for UI
   - Use Tailwind theme variables for colors (never hardcode)
   - Use TanStack Query in hooks for data fetching
   - Keep UI in `components/`, logic in `hooks/`

## Dependencies

### Key Runtime Dependencies

- `next` (15.3.8) - React framework with App Router
- `react` (19.2.0) - UI library
- `react-dom` (19.2.0) - DOM rendering
- `tailwindcss` (4.1.17) - Utility-first CSS framework
- `@tabler/icons-react` (3.36.0) - Icon library

### Build & Development Tools

- `typescript` (5.9.3) - Type checking
- `eslint` - Code linting
- `husky` - Git hooks
- `commitlint` - Commit message validation
