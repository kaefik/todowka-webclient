# ToDowka Web Client

GTD (Getting Things Done) task management web application.

## Features

- **Capture:** Quick capture tasks into Inbox
- **Clarify:** Process inbox items with full task details
- **Organize:** Organize by projects, contexts, tags, and areas
- **Engage:** Focus on Next Actions
- **Review:** Guided weekly review workflow
- **Mobile First:** Responsive design with bottom navigation

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.0
- **State Management:** Zustand (UI state), TanStack Query v5 (server state)
- **Forms:** React Hook Form + Zod
- **Utilities:** date-fns

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
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

### Type Check

```bash
npm run typecheck
```

## GTD Workflow

### 1. Capture

Use the quick capture form on the Dashboard to quickly add tasks to your Inbox.

### 2. Clarify

Go to the Inbox page to process items:
- Edit to add project, context, tags, priority
- Delete irrelevant items
- Move to "Someday" for later

### 3. Organize

Create projects to group related tasks. Use contexts for "where" (Home, Office, Phone). Use tags for "what" (Work, Personal).

### 4. Engage

Focus on Next Actions — tasks you've marked as ready to do. Complete them one by one.

### 5. Review

Weekly review:
1. Process all Inbox items
2. Review project progress
3. Select Next Actions for the next week
4. Review Someday items

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── (dashboard)/       # Dashboard group layout
│   │   ├── inbox/        # Inbox page
│   │   ├── tasks/        # Tasks pages
│   │   ├── projects/     # Project pages
│   │   ├── contexts/     # Contexts page
│   │   ├── areas/        # Areas page
│   │   ├── tags/         # Tags page
│   │   ├── review/       # Review page
│   │   ├── completed/    # Completed tasks page
│   │   └── trash/        # Trash page
│   ├── layout.tsx        # Root layout
│   └── page.tsx           # Dashboard page
├── components/             # React components
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Spinner.tsx
│   │   └── EmptyState.tsx
│   ├── task/             # Task components
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskActionMenu.tsx
│   │   └── WaitingModal.tsx
│   ├── project/          # Project components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectList.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectActionMenu.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/           # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── MainContent.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── MoreMenu.tsx
│   │   └── QuickCapture.tsx
│   ├── ErrorBoundary.tsx
│   ├── APIErrorHandler.tsx
│   └── APIErrorAlert.tsx
├── lib/                  # Utilities and API
│   ├── api/              # API client modules
│   │   ├── client.ts    # HTTP client
│   │   ├── tasks.ts     # Task API
│   │   ├── projects.ts  # Project API
│   │   ├── inbox.ts     # Inbox API
│   │   ├── contexts.ts  # Context API
│   │   ├── areas.ts     # Area API
│   │   ├── tags.ts      # Tag API
│   │   └── notifications.ts
│   ├── hooks/            # React Query hooks
│   │   ├── useTasks.ts
│   │   ├── useProjects.ts
│   │   ├── useInbox.ts
│   │   ├── useContexts.ts
│   │   ├── useAreas.ts
│   │   └── useTags.ts
│   └── QueryClientProvider.tsx
├── stores/               # Zustand stores
│   ├── useTaskStore.ts
│   ├── useGTDStore.ts
│   ├── useNavigationStore.ts
│   └── useAPIErrorStore.ts
└── types/                # TypeScript types
    └── index.ts
```

## Task Status Flow

- `inbox` → `active` → `completed`
- Can also go to `waiting` or `someday`
- Soft delete with `deleted_at` timestamp

## Mobile Responsiveness

- Bottom navigation on mobile devices
- Responsive grid layouts with `sm:` breakpoints
- Mobile-optimized components
- Touch-friendly interface

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run typecheck`
4. Submit a pull request

## Troubleshooting

### Build Fails

1. Run `npm run typecheck`
2. Fix any type errors
3. Clear cache: `rm -rf .next`
4. Try build again

### API Connection Issues

1. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure API server is running on the specified port
3. Check browser console for network errors

### State Not Updating

1. Check React Query DevTools (if installed)
2. Verify query keys match between mutations and queries
3. Ensure `invalidateQueries` is called after mutations

## License

MIT
