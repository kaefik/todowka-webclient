# L1-04 — Create TypeScript types file

## Goal

Define all TypeScript types matching API schemas.

## Input

Task L0-03 completed, API documentation.

## Output

`src/types/index.ts` with all type definitions.

## Types to Define

```typescript
// Enums
type TaskStatus = 'inbox' | 'active' | 'completed' | 'waiting' | 'someday';
type TaskPriority = 'low' | 'medium' | 'high';
type ProjectStatus = 'active' | 'completed';
type NotificationStatus = 'pending' | 'sent' | 'failed';

// Core Entities
interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id?: number;
  context_id?: number;
  tag_ids: number[];
  is_next_action: boolean;
  completed_at?: string;
  reminder_at?: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  area_id?: number;
  status: ProjectStatus;
  progress: number;
  total_tasks: number;
  completed_tasks: number;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: number;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

interface Context {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface Area {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: number;
  message: string;
  task_id?: number;
  status: NotificationStatus;
  scheduled_at?: string;
  sent_at?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

// Create/Update Types
interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  context_id?: number;
  tag_ids?: number[];
}

interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  context_id?: number;
  tag_ids?: number[];
}

interface ProjectCreate {
  name: string;
  description?: string;
  area_id?: number;
}

interface ProjectUpdate {
  name?: string;
  description?: string;
  area_id?: number;
}

interface InboxCreate {
  title: string;
  description?: string;
}

interface TagCreate {
  name: string;
  color?: string;
}

interface TagUpdate {
  name?: string;
  color?: string;
}

interface ContextCreate {
  name: string;
  description?: string;
}

interface ContextUpdate {
  name?: string;
  description?: string;
}

interface AreaCreate {
  name: string;
  description?: string;
}

interface AreaUpdate {
  name?: string;
  description?: string;
}

// Pagination
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Filters
interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  context_id?: number;
  tag_id?: number;
  search?: string;
  sort?: 'created_at' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}
```

## Done When

All types from design doc are defined with correct properties and types.

## Effort

S (1 hour)

## Depends On

L0-03
