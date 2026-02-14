# Project Guidelines

## Purpose

This is a **shadcn registry** (`@jabworks/ui`) for distributing UI components via CLI installation. Unlike standard npm packages, users receive source files copied directly into their projects via `npx shadcn add @jabworks/[component]`.

## Code Style

### TypeScript

- **Strict mode enabled** ([tsconfig.json](../tsconfig.json#L7)) - no implicit any, strict null checks
- Use `@/*` path alias for imports from project root ([tsconfig.json](../tsconfig.json#L20-L22))
- Target ES2017+ features

### Linting & Formatting

- ESLint: `@jabworks/eslint-plugin` with Next.js preset ([eslint.config.mjs](../eslint.config.mjs))
- Prettier: `@jabworks/prettier-config` ([prettier.config.mjs](../prettier.config.mjs))
- Stylelint: Custom config with `import-notation` disabled ([stylelint.config.mjs](../stylelint.config.mjs))
- Run `pnpm lint` before committing

### Component Patterns

Based on [app/page.tsx](../app/page.tsx) and [app/layout.tsx](../app/layout.tsx):

```tsx
// ✓ Named arrow functions, default export
const ComponentName = () => { /* ... */ };
export default ComponentName;

// ✓ Explicit Readonly typing for props
const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => { /* ... */ };

// ✓ Template literals for className composition
className={`${variable} antialiased`}

// ✓ Accessibility attributes always included
<Image priority alt="Description" src="..." />
<a rel="noopener noreferrer" target="_blank">
```

### Styling

- **Tailwind CSS v4** with inline theme configuration ([app/globals.css](../app/globals.css#L7-L11))
- Use CSS custom properties for theming: `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`
- Dark mode via `dark:` variants ([app/page.tsx](../app/page.tsx#L7))
- Utility-first, responsive design: `flex min-h-screen items-center sm:items-start`

### Typography

- Geist Sans and Geist Mono loaded via `next/font/google` ([app/layout.tsx](../app/layout.tsx#L6-L13))
- Apply font variables to body: `--font-geist-sans`, `--font-geist-mono`

## Architecture

### Registry Structure (To Be Implemented)

```
/registry/
  └── default/          # Single style variant
      └── [component]/  # grid-system/, button/, etc.
/public/
  └── r/                # Built JSON files served to CLI
```

### Registry Workflow

1. **Component Development**: Create components in `registry/default/[name]/`
2. **Metadata Definition**: Each component includes dependencies, registry dependencies, file exports
3. **Build**: `pnpm registry:build` generates `/public/r/[name].json`
4. **Distribution**: Users run `npx shadcn add @jabworks/[name]` to install

### Key Files

- `registry.json` - Entry point listing all available components (create at root)
- `/public/r/*.json` - Built component metadata consumed by CLI
- `components.json` - Namespacing config for `@jabworks` scope

### First Component

- **Grid System** - Starting component in `registry/default/grid-system/`

### Next.js App Structure

- **App Router**: All routes in `app/` directory
- **React 19 + Next.js 16**: Use latest features (Server Actions, Partial Prerendering when needed)
- **Font Optimization**: Always use `next/font` for custom fonts ([app/layout.tsx](../app/layout.tsx#L6))

## Build and Test

### Package Manager

**Always use `pnpm`** (workspace configured in [pnpm-workspace.yaml](../pnpm-workspace.yaml))

```bash
# Development
pnpm dev          # Start Next.js dev server at localhost:3000

# Production
pnpm build        # Build for production
pnpm start        # Run production server

# Code Quality
pnpm lint         # Run ESLint
pnpm test         # Run component tests (when implemented)
pnpm test:a11y    # Run accessibility audits (when implemented)
pnpm test:visual  # Run visual regression tests (when implemented)

# Registry (when implemented)
pnpm registry:build   # Generate /public/r/*.json files
```

### Installation

```bash
pnpm install      # Install dependencies
```

### Testing Strategy

- **Component Tests**: Unit tests for component logic and rendering
- **Accessibility Audits**: Automated a11y testing (WCAG 2.1 AA compliance)
- **Visual Regression**: Screenshot comparison tests for UI consistency
- **Type Checking**: Strict TypeScript validation in CI

### CI/CD Pipeline

- **GitHub Actions** for automated workflows
- Run linting, type checking, and tests on PR
- Build registry on main branch
- Deploy to hosting platform after successful build

## Project Conventions

### Component Registry Requirements

1. **No external runtime dependencies** - Components should be self-contained or depend only on other registry components
2. **Export metadata** - Each component includes:
   - `files`: Source files to copy
   - `dependencies`: npm packages to install
   - `registryDependencies`: Other @jabworks components required
3. **Type safety** - All components fully typed with TypeScript
4. **Accessibility first** - Semantic HTML, ARIA attributes, keyboard navigation

### Naming Conventions

- Component files: lowercase-with-dashes (`button.tsx`, `data-table.tsx`)
- Component names: PascalCase (`Button`, `DataTable`)
- Registry scope: `@jabworks/[component-name]`

### File Organization

- One component per directory in `registry/default/`
- Co-locate styles, tests, and documentation with components
- Export from index file if multi-file component

## Integration Points

### External Services

- **Next.js**: Framework for registry website
- **Tailwind CSS v4**: Styling system
- **shadcn CLI**: Consumes `/public/r/*.json` for installation

### Deployment

- **Automated via GitHub Actions** on main branch push
- Build static site with `pnpm build`
- Serve `/public/r/*.json` at `https://[domain]/r/[component].json`
- Public registry - no authentication required

## Security

### Public Registry

- All components in `/registry` are **publicly accessible**
- No authentication middleware required
- Ensure no sensitive data in component metadata or examples

### Dependencies

- Audit component dependencies before adding to registry
- Avoid transitive dependencies with known vulnerabilities
- Lock versions in registry metadata for reproducibility
- Run `pnpm audit` in CI pipeline
