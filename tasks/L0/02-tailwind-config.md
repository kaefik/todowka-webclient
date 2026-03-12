# L0-02 — Configure Tailwind CSS & design tokens

## Goal

Setup Tailwind CSS with custom colors and design tokens.

## Input

Task L0-01 completed.

## Output

- `tailwind.config.ts` with custom colors
- `src/app/globals.css` with base styles

## Custom Colors to Define

```typescript
colors: {
  primary: { DEFAULT: '#2563eb' }, // blue-600
  background: '#f8fafc',          // slate-50
  card: '#ffffff',                 // white
  border: '#e2e8f0',             // slate-200
  foreground: '#0f172a',           // slate-900
  'foreground-secondary': '#475569', // slate-600
  
  // Status colors
  'status-inbox': '#6b7280',      // gray-500
  'status-active': '#3b82f6',     // blue-500
  'status-completed': '#22c55e',   // green-500
  'status-waiting': '#eab308',     // yellow-500
  'status-someday': '#a855f7',    // purple-500
  
  // Priority colors
  'priority-low': '#94a3b8',      // slate-400
  'priority-medium': '#eab308',    // yellow-500
  'priority-high': '#ef4444',     // red-500
}
```

## Steps

1. Configure tailwind.config.ts with custom colors and design tokens
2. Set up globals.css with base styles, font settings, and utility classes
3. Configure content paths to scan src directory
4. Add dark mode support (optional but recommended)

## Tailwind Config Template

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors here
      },
    },
  },
  plugins: [],
}
export default config
```

## Done When

- Tailwind classes work in components
- Custom colors (blue-600, slate-50, etc.) defined and usable
- Base styles applied globally

## Effort

S (1 hour)

## Depends On

L0-01
