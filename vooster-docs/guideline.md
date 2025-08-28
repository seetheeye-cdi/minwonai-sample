
  
  ## Library
  - **Packages**: `@myapp/api`, `@myapp/ui`, `@myapp/prisma`, `@myapp/utils`
  - **Boundaries**: `apps/* -> packages/*` only; no cross-app imports; no cycles
  - **Imports**: Package entrypoints only (no deep internal paths)
  - **Env**: Server-only secrets on server; never expose in client
  
  ## Directory Structure
  - **Monorepo**: `apps/app`, `apps/www`, `packages/*`, `tooling/*`
  - **App (dashboard)**: `apps/app/src/{app,components,features,hooks,i18n,utils}`
  - **Landing**: `apps/www/app`, `apps/www/src/{components,i18n}`
  - **API**: `packages/api/src/{trpc.ts,root.ts,routers/*}`
  - **DB**: `packages/prisma/prisma/*`, `packages/prisma/generated/prisma`
  - **UI**: `packages/ui/src/{components,lib/utils.ts,index.ts}`
  
  ## Code Guidelines
  - **Feature-first**: `apps/app/src/features/[feature]/*` (UI + logic)
  - **Validation**: `zod` at API boundaries; reuse on client
  - **tRPC**: Router per domain; export via `root.ts`; typed client in app
  - **i18n**: `apps/app/messages`, `apps/www/src/i18n/locales`
  - **Side-effects**: Server-only in API/tRPC; wrap external calls
  
  ## Code-Style Guidelines
  - **TypeScript**: strict; prefer `type`; use `unknown` over `any`
  - **Naming**: PascalCase components; camelCase vars; kebab-case dirs
  - **Files**: One component per file; colocate tests/stories if any
  - **Imports**: node/3p -> packages -> relative; no deep UI imports
  - **React**: Server Components by default; `use client` only when needed; avoid default exports
  - **Styling**: Tailwind; compose with `cn` from `@myapp/ui/lib/utils`
  - **Format/Lint**: Prettier + ESLint from `tooling/eslint-config`
  
  ## Error Handling
  - **Validate early**: `zod` parse → typed inputs
  - **tRPC**: `TRPCError({ code, message, cause })`; map domain errors
  - **HTTP**: `NextResponse.json({ error: { code, message } }, { status })`
  - **UI feedback**: toasts/dialogs from `@myapp/ui`
  - **Logging**: include context; never leak secrets
  - **Never**: swallow errors or throw plain strings
  
  ## Prisma
  - **Single source**: `packages/prisma/prisma/schema.prisma`
  - **Flow**: edit → `pnpm db:migrate:create` → `pnpm db:generate`
  - **Do NOT**: run `pnpm db:migrate:deploy` locally
  - **Access**: use generated client (`@myapp/prisma`); no raw SQL
  - **Transactions**: `prisma.$transaction`; handle unique/constraint errors
  - **Types**: share DTOs via `zod` and `@myapp/utils`
  
  ## Shadcn (UI)
  - **Source**: `packages/ui` only; import via package entrypoints
  - **Add**: in `packages/ui` → `pnpm dlx shadcn@canary add <component>`
  - **Export**: re-export from `packages/ui/src/index.ts`
  - **Utilities**: `cn` from `@myapp/ui/lib/utils`
  - **Styling**: follow tokens; avoid inline styles; no deep imports
    