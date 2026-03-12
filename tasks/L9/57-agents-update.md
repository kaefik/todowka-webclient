# L9-57 — Update AGENTS.md with build/test commands

## Goal

Document commands for linting, building, testing.

## Input

Completed project.

## Output

Updated `AGENTS.md` with all commands.

## Content to Add

Append to `AGENTS.md`:

```markdown
## Available Commands

### Development

```bash
npm run dev
```

Starts Next.js development server on http://localhost:3000.

### Build

```bash
npm run build
```

Creates an optimized production build.

### Lint

```bash
npm run lint
```

Runs ESLint to check code quality.

### Type Check

```bash
npm run typecheck
```
```

Runs TypeScript compiler to check types.

### Start Production

```bash
npm start
```

Starts production server (requires build first).

### Clean

```bash
npm run clean
```

Removes build artifacts and cache.

## When to Run

- **Before committing:** Run `npm run lint` and `npm run typecheck`
- **Before deployment:** Run `npm run build`
- **During development:** Use `npm run dev`

## Troubleshooting

### Build Fails

1. Run typecheck: `npm run typecheck`
2. Fix any type errors
3. Clear cache: `rm -rf .next`
4. Try build again

### Lint Errors

1. Run `npm run lint` to see all errors
2. Fix errors or add `// eslint-disable-next-line` if necessary
```

## Done When

AGENTS.md updated with all commands.

## Effort

XS (30 minutes)

## Depends On

L9-55
