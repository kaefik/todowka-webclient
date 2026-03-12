# AGENTS.md

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
