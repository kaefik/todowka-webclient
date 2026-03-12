# L9-55 — Create README.md

## Goal

Document project setup and usage.

## Input

Completed project.

## Output

`README.md` with project documentation.

## Content

```markdown
# Todo Web Client

Personal GTD task management web application.

## Features

- **Capture:** Quick capture tasks into Inbox
- **Clarify:** Process inbox items with full task details
- **Organize:** Organize by projects, contexts, tags, and areas
- **Engage:** Focus on Next Actions
- **Review:** Guided weekly review workflow

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand (UI), TanStack Query (server)
- **Forms:** React Hook Form + Zod

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd todowka-webclient

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the API

Ensure the Todo API is running:

```bash
# From the API project
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## GTD Workflow

### 1. Capture

Use the quick capture form on Dashboard to quickly add tasks to your Inbox.

### 2. Clarify

Go to Inbox page to process items:
- Edit to add project, context, tags, priority
- Delete irrelevant items
- Move to "Someday" for later

### 3. Organize

Create projects to group related tasks. Use contexts for "where" (Home, Office, Phone). Use tags for "what" (Work, Personal).

### 4. Engage

Focus on Next Actions - tasks you've marked as ready to do. Complete them one by one.

### 5. Review

Weekly review:
1. Process all Inbox items
2. Review project progress
3. Select Next Actions for next week
4. Review Someday items

## Project Structure

```
src/
├── app/                    # Next.js pages
├── components/             # React components
│   ├── ui/              # Base components
│   ├── task/            # Task components
│   ├── project/         # Project components
│   └── layout/          # Layout components
├── lib/                  # Utilities and API
│   ├── api/             # API client
│   ├── hooks/           # React Query hooks
│   └── utils/           # Helper functions
├── types/                # TypeScript types
└── stores/               # Zustand stores
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run lint and typecheck
4. Submit a pull request

## License

MIT
```

## Done When

README.md created with all sections complete.

## Effort

S (1 hour)

## Depends On

None
