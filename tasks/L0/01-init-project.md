# L0-01 — Init Next.js project with TypeScript & dependencies

## Goal

Initialize a Next.js 14 project with all required dependencies.

## Input

Empty directory with git initialized.

## Output

- `package.json` with all dependencies
- `tsconfig.json`
- `next.config.js`
- `tailwind.config.ts`
- `.env.local` template

## Dependencies to Install

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "@hookform/resolvers": "^3.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

## Steps

1. Initialize Next.js project with TypeScript: `npm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"`
2. Configure tsconfig.json for strict type checking
3. Create next.config.js
4. Create tailwind.config.ts skeleton
5. Create .env.local with API URL variable
6. Install additional dependencies: @tanstack/react-query, zustand, react-hook-form, zod, @hookform/resolvers, date-fns

## Done When

- `npm run dev` starts successfully on http://localhost:3000
- All dependencies installed in package.json
- Next.js pages render in browser

## Effort

S (1 hour)

## Depends On

None
