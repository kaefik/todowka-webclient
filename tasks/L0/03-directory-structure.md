# L0-03 — Setup directory structure

## Goal

Create all required directories with placeholder files.

## Input

Task L0-01 completed.

## Output

Directory structure with placeholder files:
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── inbox/
│   │   │   └── page.tsx (placeholder)
│   │   ├── tasks/
│   │   │   ├── page.tsx (placeholder)
│   │   │   └── next-actions/
│   │   │       └── page.tsx (placeholder)
│   │   ├── projects/
│   │   │   ├── page.tsx (placeholder)
│   │   │   └── [id]/
│   │   │       └── page.tsx (placeholder)
│   │   ├── areas/
│   │   │   └── page.tsx (placeholder)
│   │   ├── contexts/
│   │   │   └── page.tsx (placeholder)
│   │   ├── tags/
│   │   │   └── page.tsx (placeholder)
│   │   └── review/
│   │       └── page.tsx (placeholder)
│   ├── layout.tsx (placeholder)
│   └── page.tsx (placeholder)
├── components/
│   ├── ui/
│   ├── task/
│   ├── project/
│   └── layout/
├── lib/
│   ├── api/
│   ├── hooks/
│   └── utils/
├── types/
└── stores/
```

## Steps

1. Create all directories using `mkdir -p`
2. Create placeholder files for each page with basic "Coming soon" content
3. Create placeholder files for each directory (index.ts or .gitkeep)

## Placeholder Template

```typescript
export default function Placeholder() {
  return <div className="p-4">Placeholder content</div>;
}
```

## Done When

All directories exist with placeholder files.
Structure matches design doc exactly.

## Effort

XS (30 minutes)

## Depends On

L0-01
