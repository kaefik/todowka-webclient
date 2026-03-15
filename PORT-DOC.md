# PORT-DOC: Todo Web Client

> **Version**: 1.0  
> **Source project**: Next.js 14 + TypeScript + TanStack Query Web Client  
> **Generated**: 2026-03-15  
> **Purpose**: Platform-neutral specification for rebuilding this GTD task management application on any target platform.

---

## 1. Project Overview

### What This Project Does
Personal task management web application implementing the Getting Things Done (GTD) methodology. Users can capture tasks into an inbox, clarify and organize them by projects, contexts, tags, and areas, focus on next actions, and perform weekly reviews.

### Core User Personas
- **Productivity-focused individual**: Needs a systematic approach to manage personal tasks across different contexts and projects
- **GTD practitioner**: Familiar with GTD methodology and needs tools that support the five-step workflow (Capture, Clarify, Organize, Engage, Review)

### Key Constraints & Non-Negotiables
- Requires external Todo API server running (data persistence handled server-side)
- Must maintain real-time optimistic updates for task operations
- Must support the complete GTD workflow implementation
- Application state is client-side temporary; permanent data lives in the API

---

## 2. Feature Inventory

### Feature: Quick Capture
- **ID**: F-001
- **Summary**: Fast task creation with minimal input
- **User story**: As a user, I want to quickly capture tasks so that I don't forget them
- **Inputs**: Task title (required), optional description
- **Outputs / Effects**: Creates task with status "inbox" in the system
- **Business rules**:
  - Title is required (1-200 characters)
  - Status defaults to "inbox"
  - Priority defaults to "medium"
- **Error cases**: API connection failure, validation errors
- **External dependency**: Todo API (POST /inbox)

### Feature: Inbox Processing
- **ID**: F-002
- **Summary**: Process inbox items one by one or all at once
- **User story**: As a user, I want to clarify and organize my inbox items so that my tasks are properly structured
- **Inputs**: User actions on each task (clarify, delete, move to someday, set waiting)
- **Outputs / Effects**: Tasks move from inbox to organized states
- **Business rules**:
  - Can process one task at a time or all in sequence
  - Clarifying a task opens form to set project, context, tags, priority
  - Deleting removes task from inbox
  - Process All mode automatically moves to next task after saving
- **Error cases**: API failure should show error and allow retry
- **External dependency**: Todo API (GET /inbox, PUT /tasks/{id}, DELETE /tasks/{id})

### Feature: Task List with Filters
- **ID**: F-003
- **Summary**: View and filter tasks by various criteria
- **User story**: As a user, I want to filter tasks so that I can focus on specific subsets
- **Inputs**: Filter selections (status, priority, project, context, tag, search text), sort options
- **Outputs / Effects**: Displays filtered list of tasks with pagination
- **Business rules**:
  - Multiple filters can be applied simultaneously
  - Search matches task titles
  - Sort options: created_at, priority, title (ascending/descending)
  - Pagination: 10-50 items per page
- **Error cases**: Invalid filter values rejected
- **External dependency**: Todo API (GET /tasks with query parameters)

### Feature: Task Actions
- **ID**: F-004
- **Summary**: Perform actions on tasks (complete, edit, delete, set next action, set waiting)
- **User story**: As a user, I want to manage individual tasks so that I can progress through my work
- **Inputs**: User selection of action on a task
- **Outputs / Effects**: Task state changes accordingly
- **Business rules**:
  - Complete: Sets status to "completed", removes from next actions
  - Set Next Action: Toggles is_next_action flag. If task is in waiting/someday/completed, requires confirmation to change status to active
  - Set Waiting: Opens modal to specify who/what we're waiting for, sets status to "waiting"
  - Edit: Opens form to modify all task fields
  - Delete: Moves task to trash (soft delete)
- **Error cases**: Confirmations for destructive actions, API failure handling
- **External dependency**: Todo API (various endpoints)

### Feature: Next Actions View
- **ID**: F-005
- **Summary**: Focus on tasks marked as next actions
- **User story**: As a user, I want to see my next actions so that I know what to do now
- **Inputs**: None (automatic filter for is_next_action=true)
- **Outputs / Effects**: Displays list of next action tasks
- **Business rules**:
  - Only shows tasks with is_next_action=true
  - Completed tasks are automatically removed
  - Tasks can be toggled as next action from this view
- **Error cases**: API failure
- **External dependency**: Todo API (GET /tasks/next-actions)

### Feature: Projects Management
- **ID**: F-006
- **Summary**: Create, edit, delete, and view projects
- **User story**: As a user, I want to organize tasks into projects so that I can track progress
- **Inputs**: Project name, description, optional area
- **Outputs / Effects**: Project entities are created with automatic progress tracking
- **Business rules**:
  - Project name is required (1-100 characters)
  - Progress is calculated automatically: (completed_tasks / total_tasks) * 100
  - Projects can be active or completed
  - Deleting a project does not delete associated tasks
- **Error cases**: Name validation, API failure
- **External dependency**: Todo API (CRUD on /projects)

### Feature: Project Details View
- **ID**: F-007
- **Summary**: View project details and associated tasks
- **User story**: As a user, I want to see all tasks in a project so that I understand project progress
- **Inputs**: Project selection
- **Outputs / Effects**: Shows project info, progress bar, and list of tasks
- **Business rules**:
  - Shows all tasks belonging to the project
  - Progress bar reflects completion percentage
  - Can add new tasks directly to project
- **Error cases**: Project not found
- **External dependency**: Todo API (GET /projects/{id}, GET /tasks?project_id={id})

### Feature: Contexts Management
- **ID**: F-008
- **Summary**: Manage contexts (situations for task execution)
- **User story**: As a user, I want to define contexts so that I know where I can do tasks
- **Inputs**: Context name, optional description
- **Outputs / Effects**: Context entities available for task assignment
- **Business rules**:
  - Context name is required (1-100 characters)
  - Examples: Home, Office, Phone, Computer
  - Tasks can belong to one context at most
- **Error cases**: Name validation
- **External dependency**: Todo API (CRUD on /contexts)

### Feature: Tags Management
- **ID**: F-009
- **Summary**: Create and manage tags for categorizing tasks
- **User story**: As a user, I want to tag tasks so that I can organize by categories
- **Inputs**: Tag name, optional color (hex code)
- **Outputs / Effects**: Tag entities available for task assignment
- **Business rules**:
  - Tag name is required (1-100 characters)
  - Color must be valid hex format (#RRGGBB)
  - Tasks can have multiple tags
- **Error cases**: Name validation, color format validation
- **External dependency**: Todo API (CRUD on /tags)

### Feature: Areas Management
- **ID**: F-010
- **Summary**: Manage areas of responsibility
- **User story**: As a user, I want to define areas so that I can categorize projects at a high level
- **Inputs**: Area name, optional description
- **Outputs / Effects**: Area entities available for project assignment
- **Business rules**:
  - Area name is required (1-100 characters)
  - Projects can belong to one area at most
  - Examples: Career, Health, Finance, Family
- **Error cases**: Name validation
- **External dependency**: Todo API (CRUD on /areas)

### Feature: Weekly Review
- **ID**: F-011
- **Summary**: Guided step-by-step weekly review workflow
- **User story**: As a user, I want to perform a weekly review so that I stay organized
- **Inputs**: User navigation through four review steps
- **Outputs / Effects**: User processes inbox, reviews projects, selects next actions, reviews someday items
- **Business rules**:
  - Four-step process: Inbox Review, Projects Review, Next Actions Selection, Someday Review
  - Each step is independent but should be completed in order
  - User can move between steps freely
- **Error cases**: API failure during review
- **External dependency**: Todo API (various endpoints)

### Feature: Trash Management
- **ID**: F-012
- **Summary**: View, restore, or permanently delete soft-deleted tasks
- **User story**: As a user, I want to recover deleted tasks so that I don't lose data accidentally
- **Inputs**: User selection of restore or permanent delete action
- **Outputs / Effects**: Tasks are restored or permanently removed
- **Business rules**:
  - Soft-deleted tasks are stored with deleted_at timestamp
  - Restore clears deleted_at timestamp
  - Permanent delete removes task completely
  - Can empty all trash at once
- **Error cases**: API failure
- **External dependency**: Todo API (GET /tasks/deleted, POST /tasks/{id}/restore, DELETE /tasks/{id}/permanent)

### Feature: Dashboard Overview
- **ID**: F-013
- **Summary**: Quick overview of key metrics and recent items
- **User story**: As a user, I want to see my status at a glance so that I can plan my day
- **Inputs**: None (automatic data gathering)
- **Outputs / Effects**: Displays counters (Inbox, Next Actions, Active Projects) and lists (Top 5 Next Actions, Active Projects)
- **Business rules**:
  - Inbox count: uncompleted tasks with status "inbox"
  - Next Actions count: tasks with is_next_action=true
  - Active Projects count: projects with status "active"
  - Shows top 5 next actions (most recent or highest priority)
- **Error cases**: API failure shows empty states
- **External dependency**: Todo API (multiple endpoints)

---

## 3. Data Models

### Entity: Task

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| id | integer | No (auto) | Unique identifier | Auto-generated |
| title | string | Yes | Task title | 1-200 characters |
| description | string | No | Task details | Max 1000 characters |
| completed | boolean | No (auto) | Completion status | Default false |
| status | enum | No | GTD status | inbox, active, completed, waiting, someday (default: inbox) |
| priority | enum | No | Urgency level | low, medium, high (default: medium) |
| due_date | datetime | No | Due date/time | ISO 8601 format |
| reminder_time | datetime | No | Reminder time | ISO 8601 format |
| is_next_action | boolean | No (auto) | Marked as next action | Default false |
| waiting_for | string | No | Who/what we're waiting for | Max 200 characters |
| delegated_to | string | No | Person task is delegated to | Max 100 characters |
| someday | boolean | No | Flag for someday/maybe | Default false |
| project_id | integer | No | Associated project | Must exist in projects table |
| context_id | integer | No | Associated context | Must exist in contexts table |
| area_id | integer | No | Associated area | Must exist in areas table |
| tags | array | No | List of associated tags | Objects with id, name, color |
| created_at | datetime | No (auto) | Creation time | ISO 8601 |
| updated_at | datetime | No (auto) | Last update time | ISO 8601 |
| completed_at | datetime | No (auto) | Completion time | Set when completed=true |
| deleted_at | datetime | No (auto) | Soft deletion time | Set when deleted |

**Relationships**:
- Belongs to: Project (optional)
- Belongs to: Context (optional)
- Belongs to: Area (optional)
- Has many: Tags (many-to-many)

**Business rules on this entity**:
- Title cannot be empty
- Status can transition: inbox → active, inbox → someday, active → waiting, active → completed, waiting → active, someday → active, completed → active
- is_next_action can only be true for tasks with status in {active, inbox}
- When is_next_action is set to true on a task with status in {waiting, someday, completed}, status must change to active (with user confirmation)
- When completed is set to true, status changes to completed, waiting_for is cleared, someday is set to false
- deleted_at is set instead of permanent deletion (soft delete)

### Entity: Project

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| id | integer | No (auto) | Unique identifier | Auto-generated |
| name | string | Yes | Project name | 1-100 characters |
| description | string | No | Project details | Max 500 characters |
| area_id | integer | No | Associated area | Must exist in areas table |
| status | enum | No (auto) | Project status | active, completed (default: active) |
| progress | integer | No (auto) | Completion percentage | 0-100 (calculated) |
| total_tasks | integer | No (auto) | Total tasks count | Calculated from tasks |
| completed_tasks | integer | No (auto) | Completed tasks count | Calculated from tasks |
| created_at | datetime | No (auto) | Creation time | ISO 8601 |
| updated_at | datetime | No (auto) | Last update time | ISO 8601 |

**Relationships**:
- Belongs to: Area (optional)
- Has many: Tasks

**Business rules on this entity**:
- Name cannot be empty
- Progress = (completed_tasks / total_tasks) * 100 when total_tasks > 0, else 0
- When status changes to completed, all associated tasks may be completed (optional behavior)
- Deleting a project does not cascade delete to tasks

### Entity: Tag

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| id | integer | No (auto) | Unique identifier | Auto-generated |
| name | string | Yes | Tag name | 1-100 characters |
| color | string | No | Hex color code | Format #RRGGBB |
| created_at | datetime | No (auto) | Creation time | ISO 8601 |
| updated_at | datetime | No (auto) | Last update time | ISO 8601 |

**Relationships**:
- Belongs to many: Tasks (many-to-many)

**Business rules on this entity**:
- Name cannot be empty
- Color must be valid hex format if provided

### Entity: Context

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| id | integer | No (auto) | Unique identifier | Auto-generated |
| name | string | Yes | Context name | 1-100 characters |
| description | string | No | Context description | Max 500 characters |
| created_at | datetime | No (auto) | Creation time | ISO 8601 |
| updated_at | datetime | No (auto) | Last update time | ISO 8601 |

**Relationships**:
- Has many: Tasks

**Business rules on this entity**:
- Name cannot be empty

### Entity: Area

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| id | integer | No (auto) | Unique identifier | Auto-generated |
| name | string | Yes | Area name | 1-100 characters |
| description | string | No | Area description | Max 500 characters |
| created_at | datetime | No (auto) | Creation time | ISO 8601 |
| updated_at | datetime | No (auto) | Last update time | ISO 8601 |

**Relationships**:
- Has many: Projects

**Business rules on this entity**:
- Name cannot be empty

### Entity: Notification

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| id | integer | No (auto) | Unique identifier | Auto-generated |
| message | string | No | Notification message | Max 500 characters |
| task_id | integer | No | Associated task | Must exist in tasks table |
| status | enum | No (auto) | Notification status | pending, sent, failed (default: pending) |
| scheduled_at | datetime | No | Scheduled time | ISO 8601 |
| sent_at | datetime | No (auto) | Sent time | Set when status=sent |
| error | string | No | Error message | Set when status=failed |
| created_at | datetime | No (auto) | Creation time | ISO 8601 |
| updated_at | datetime | No (auto) | Last update time | ISO 8601 |

**Relationships**:
- Belongs to: Task (optional)

**Business rules on this entity**:
- Status transitions: pending → sent, pending → failed

### Pagination Schema

Used for list responses:

| Field | Type | Description |
|-------|------|-------------|
| items | array | Array of items |
| total | integer | Total number of items |
| page | integer | Current page number |
| limit | integer | Items per page |
| pages | integer | Total number of pages |

---

## 4. Core Business Logic

### Logic: Task Progress Calculation for Projects
- **Purpose**: Automatically calculate project completion percentage based on associated tasks
- **Trigger**: Whenever tasks are fetched for a project or project list
- **Algorithm**:
  1. Get all tasks associated with the project (filter by project_id)
  2. Count total tasks: total_tasks = tasks.length
  3. Count completed tasks: completed_tasks = tasks.filter(t => t.completed).length
  4. Calculate progress: 
     - If total_tasks > 0: progress = Math.round((completed_tasks / total_tasks) * 100)
     - Else: progress = 0
- **Edge cases**:
  - Project with no tasks: progress = 0, total_tasks = 0, completed_tasks = 0
- **Performance notes**: Calculation happens client-side after fetching data from API

### Logic: Next Action Status Management
- **Purpose**: Enforce business rules when marking tasks as next actions
- **Trigger**: User clicks "Next Action" toggle on a task
- **Algorithm**:
  1. Check current task status and is_next_action value
  2. If setting to true (marking as next action):
     - If task status is in {waiting, someday, completed}:
       - Show confirmation dialog: "Task is in [Status]. Setting as Next Action will change status to Active. Continue?"
       - If user confirms: Update status to "active", then set is_next_action = true
       - If user cancels: Do nothing
     - Else (status is inbox or active): Set is_next_action = true
  3. If setting to false: Set is_next_action = false
- **Edge cases**:
  - Task that is completed and marked as next action: requires status change to active
- **Performance notes**: Immediate UI update with optimistic update, confirmed by API response

### Logic: Inbox Processing Flow
- **Purpose**: Guide users through processing inbox items efficiently
- **Trigger**: User clicks "Process All" button
- **Algorithm**:
  1. Get list of active inbox tasks (filter: status='inbox', completed=false)
  2. If no tasks: Show message "No items to process"
  3. Set processing mode flag = true
  4. Open edit form for first task in list
  5. When user saves task:
     - Update task with provided data (should include status change to active)
     - Find current task index in list
     - If next task exists: Open form for next task
     - Else (no more tasks): Exit processing mode, close form
  6. When user deletes task:
     - Delete task from system
     - Find current task index in list
     - If next task exists: Open form for next task
     - Else (no more tasks): Exit processing mode, close form
  7. When user cancels or closes form: Exit processing mode
- **Edge cases**:
  - User edits task but doesn't change status from inbox: task remains in inbox
  - Task deleted during processing: automatically moves to next
- **Performance notes**: Optimistic updates for immediate feedback

### Logic: Optimistic Updates for Task Operations
- **Purpose**: Provide immediate UI feedback while API request is in progress
- **Trigger**: Any task mutation (create, update, delete, complete, set next action, set waiting)
- **Algorithm**:
  1. Store current state (previous data) before mutation
  2. Cancel pending queries for affected caches
  3. Update local cache with optimistic change immediately
  4. Send API request
  5. On success:
     - Invalidate relevant queries to fetch fresh data
     - New data from API replaces optimistic data
  6. On error:
     - Restore previous state from step 1
     - Show error message to user
  7. On settled (regardless of success/error):
     - Invalidate queries to ensure cache consistency
- **Edge cases**:
  - Multiple rapid mutations: Each mutation stores its own previous state
  - Network timeout: Rollback to previous state
- **Performance notes**: UI feels instant, reduces perceived latency

### Logic: Task Deletion (Soft Delete)
- **Purpose**: Allow task recovery instead of permanent deletion
- **Trigger**: User deletes a task
- **Algorithm**:
  1. Send delete request to API (sets deleted_at timestamp)
  2. On success:
     - Remove task from all active lists (inbox, tasks, next actions, etc.)
     - Task remains visible in trash view
     - Task can be restored (clears deleted_at)
     - Task can be permanently deleted (removes from database)
  3. On error: Show error, keep task in lists
- **Edge cases**:
  - Task in trash when associated project is deleted: Task remains in trash
- **Performance notes**: Soft delete is immediate API call, no confirmation for delete but required for permanent delete

### Logic: Weekly Review State Management
- **Purpose**: Track which review step user is on during weekly review
- **Trigger**: User navigates between review steps
- **Algorithm**:
  1. Maintain current step state (one of: inbox, projects, next-actions, someday)
  2. Display appropriate content for current step
  3. Each step is independent but conceptually sequential
  4. User can freely navigate between steps
- **Edge cases**:
  - User completes one step but not others: State persists per session
- **Performance notes**: State is client-side only, not persisted

---

## 5. User Flows

### Flow: Quick Capture

```
[Dashboard or any page] → [User types task title] → [Press Enter/Submit] 
                                                                 ↓
                                                       [Task created in Inbox]
                                                       [Show success notification]
```

**Steps**:
1. **Quick Capture Form**: User sees input field on dashboard or floating action button
2. **Enter Title**: User types task title (required)
3. **Optional Description**: User can add description (optional)
4. **Submit**: User presses Enter or clicks Submit button
5. **Create Task**: System creates task with status="inbox", priority="medium"
6. **Feedback**: Show success message, task appears in inbox

**Success outcome**: Task is captured quickly without leaving current context
**Failure outcomes**: API error - show error message, task not created

### Flow: Process Inbox

```
[Inbox Page] → [User clicks "Process All"] → [Edit form opens for first task] 
                                                                 ↓
                                                     [User fills in details]
                                                                 ↓
                                                       [User saves task]
                                                                 ↓
                                          [Form opens for next task] OR [Processing complete]
```

**Steps**:
1. **Navigate to Inbox**: User goes to /inbox page
2. **View Items**: System shows list of inbox tasks (status='inbox', completed=false)
3. **Process All**: User clicks "Process All" button
4. **First Task**: System opens edit form for first task
5. **Clarify Task**: User fills in project, context, tags, priority, status (usually change to 'active')
6. **Save**: User saves task
7. **Next Task**: System automatically opens form for next task
8. **Repeat**: Steps 5-7 repeat for each task
9. **Complete**: When no more tasks, system shows "Processing complete" message

**Alternative paths**:
- **Delete task**: User can delete task from processing flow, automatically moves to next
- **Cancel processing**: User can cancel and exit processing mode

**Success outcome**: All inbox tasks are clarified and organized
**Failure outcomes**: API error on save - show error, allow retry or skip task

### Flow: Set Task as Next Action

```
[Task in any view] → [User clicks Next Action toggle] 
                                                 ↓
                            [Is task in waiting/someday/completed status?]
                              ├─ Yes → [Show confirmation dialog]
                              │         ├─ Confirm → [Change status to active, set is_next_action=true]
                              │         └─ Cancel → [Do nothing]
                              └─ No → [Set is_next_action=true]
```

**Steps**:
1. **View Task**: User sees task in list (tasks, next actions, etc.)
2. **Toggle Next Action**: User clicks Next Action button/toggle
3. **Check Status**: System checks current task status
4. **If problematic status** (waiting, someday, completed):
   - Show confirmation: "Task is in [Status]. Setting as Next Action will change status to Active. Continue?"
   - If confirm: Update status to "active", set is_next_action=true
   - If cancel: Do nothing
5. **If good status** (inbox, active):
   - Set is_next_action=true

**Success outcome**: Task is marked as next action and appears in Next Actions view
**Failure outcomes**: API error - show error, revert toggle state

### Flow: Set Task as Waiting

```
[Task in any view] → [User clicks Waiting button] → [Waiting modal opens]
                                                                ↓
                                              [User enters who/what waiting for]
                                                                ↓
                                                    [User submits modal]
                                                                ↓
                                     [Task status changes to "waiting", waiting_for is set]
```

**Steps**:
1. **View Task**: User sees task in list
2. **Click Waiting**: User clicks "Waiting" button on task
3. **Open Modal**: System opens modal with input field
4. **Enter Details**: User types who or what we're waiting for (required)
5. **Submit**: User submits modal
6. **Update Task**: System sets status="waiting", waiting_for=value, removes from next actions

**Success outcome**: Task is in waiting state, tracked with waiting_for value
**Failure outcomes**: API error - show error, keep modal open for retry

### Flow: Weekly Review

```
[Review Page] → [Select step: Inbox] → [Process inbox items]
                                              ↓
                            [Select step: Projects] → [Review projects]
                                              ↓
                         [Select step: Next Actions] → [Select next week's actions]
                                              ↓
                           [Select step: Someday] → [Review someday items]
```

**Steps**:
1. **Navigate to Review**: User goes to /review page
2. **Select Step**: User sees four step buttons (Inbox, Projects, Next Actions, Someday)
3. **Inbox Review**: User processes all inbox items (same as Process Inbox flow)
4. **Projects Review**: User views all projects, can update status, check progress
5. **Next Actions Selection**: User sees all active tasks, can toggle is_next_action for next week
6. **Someday Review**: User sees someday tasks, can decide to activate any
7. **Navigate Freely**: User can move between steps in any order

**Success outcome**: User completes weekly review, system is organized for next week
**Failure outcomes**: API errors during review - show error but allow continuing

### Flow: Restore Deleted Task

```
[Trash Page] → [User sees deleted tasks] → [User clicks Restore on a task]
                                                               ↓
                                                  [Task is restored, removed from trash]
```

**Steps**:
1. **Navigate to Trash**: User goes to /trash page
2. **View Deleted Tasks**: System shows list of soft-deleted tasks (deleted_at is set)
3. **Restore Task**: User clicks "Restore" button on a task
4. **Clear deleted_at**: System clears deleted_at timestamp
5. **Remove from Trash**: Task disappears from trash view, appears in appropriate lists

**Success outcome**: Task is recovered and available in regular views
**Failure outcomes**: API error - show error, task remains in trash

---

## 6. State Management

### Application State

| State key | Type | Initial value | When it changes | Who reads it |
|-----------|------|--------------|-----------------|--------------|
| selectedTask | Task \| null | null | User clicks edit on a task, or selects from list | TaskForm, Modal |
| waitingTask | Task \| null | null | User clicks Waiting on a task | WaitingModal |
| taskFilters | TaskFilters | {} | User changes filter selections | TaskFilters, useTasks |
| viewMode | 'list' \| 'card' | 'list' | User toggles view mode | TaskList |
| currentPage | string | '/' | User navigates between pages | Navigation components |
| sidebarOpen | boolean | true | User toggles sidebar | Sidebar layout |
| inboxCount | number | 0 | Fetched from API on load | Dashboard, Sidebar |
| nextActionsCount | number | 0 | Fetched from API on load | Dashboard, Sidebar |
| reviewMode | boolean | false | User starts weekly review | Review page |
| isProcessing | boolean | false | User clicks Process All or completes processing | Inbox page |

### Persisted State

| Data | Storage type in original | Notes for porting |
|------|--------------------------|-------------------|
| Navigation preferences (sidebar state) | localStorage via Zustand persist middleware | Can use any key-value store or local storage |
| API base URL | Environment variable (NEXT_PUBLIC_API_URL) | Must be configurable per environment |

### Server State (from API)

| Data | Cache strategy | Notes |
|------|----------------|-------|
| Tasks | TanStack Query with cache | Auto-refetch on focus/reconnect, optimistic updates |
| Projects | TanStack Query with cache | Recalculates progress client-side |
| Inbox | TanStack Query with cache | Subset of tasks with status='inbox' |
| Next Actions | TanStack Query with cache | Tasks with is_next_action=true |
| Contexts | TanStack Query with cache | Master data for dropdowns |
| Tags | TanStack Query with cache | Master data for dropdowns |
| Areas | TanStack Query with cache | Master data for dropdowns |
| Deleted Tasks | TanStack Query with cache | Tasks with deleted_at set |

---

## 7. External Integrations

### Integration: Todo API
- **Purpose**: Backend data storage and business logic for all task/project operations
- **Calls made**: 
  - `GET /inbox` — Get all inbox tasks
  - `POST /inbox` — Create task in inbox (title, description)
  - `GET /tasks` — Get tasks with optional filters (status, priority, project_id, context_id, tag_ids, search, sort, order, page, limit)
  - `GET /tasks/{id}` — Get single task
  - `POST /tasks` — Create task
  - `PUT /tasks/{id}` — Update task (all fields)
  - `PATCH /tasks/{id}` — Partial update task (specific fields)
  - `DELETE /tasks/{id}` — Soft delete task
  - `POST /tasks/{id}/complete` — Mark task as completed
  - `POST /tasks/{id}/next-action` — Toggle is_next_action flag
  - `POST /tasks/{id}/waiting` — Set task as waiting
  - `GET /tasks/next-actions` — Get all next actions
  - `GET /tasks/deleted` — Get soft-deleted tasks
  - `POST /tasks/{id}/restore` — Restore deleted task
  - `DELETE /tasks/{id}/permanent` — Permanently delete task
  - `DELETE /tasks/deleted/all` — Empty all trash
  - `GET /projects` — Get projects with pagination (page, limit)
  - `GET /projects/{id}` — Get single project
  - `POST /projects` — Create project
  - `PUT /projects/{id}` — Update project
  - `DELETE /projects/{id}` — Delete project
  - `POST /projects/{id}/complete` — Mark project as completed
  - `GET /contexts` — Get all contexts
  - `POST /contexts` — Create context
  - `GET /contexts/{id}` — Get single context
  - `PUT /contexts/{id}` — Update context
  - `DELETE /contexts/{id}` — Delete context
  - `GET /tags` — Get all tags
  - `POST /tags` — Create tag
  - `GET /tags/{id}` — Get single tag
  - `PUT /tags/{id}` — Update tag
  - `DELETE /tags/{id}` — Delete tag
  - `GET /areas` — Get all areas
  - `POST /areas` — Create area
  - `GET /areas/{id}` — Get single area
  - `PUT /areas/{id}` — Update area
  - `DELETE /areas/{id}` — Delete area
- **Auth**: None (personal use, no authentication in current implementation)
- **Failure behavior**: Show error message to user, revert optimistic updates, allow retry
- **Portability note**: Any REST API with matching endpoints can be used. Client is responsible for data fetching and caching.

---

## 8. Platform-Specific Notes from Original

### What was tightly coupled to the original platform
- **TanStack Query for data fetching**: Heavily integrated with React ecosystem, provides caching, optimistic updates, automatic refetching
- **Zustand for state management**: React-specific state management library
- **React Hook Form + Zod for forms**: Form handling and validation specific to React
- **Next.js App Router**: Page routing and server components
- **Tailwind CSS for styling**: Utility-first CSS framework integrated with build process
- **fetch API for HTTP requests**: Browser-based API for network requests
- **localStorage for persistence**: Web browser storage API

### Suggested neutral alternatives
| Original implementation | Platform-neutral approach |
|------------------------|--------------------------|
| TanStack Query (React Query) | Any data fetching layer that supports caching, optimistic updates, and invalidation. Key features: cache key-based storage, mutation hooks with onMutate/onSuccess/onError callbacks, query invalidation after mutations |
| Zustand | Any state management library with subscriptions. Key features: create stores, subscribe to state changes, update state via actions |
| React Hook Form + Zod | Any form handling with validation. Key features: form state management (values, errors, touched), validation schema (can use Zod or similar), submit handling |
| Next.js App Router | Any routing system. Key features: URL-based navigation, nested routes, programmatic navigation |
| Tailwind CSS | Any styling system. Key features: responsive design, consistent spacing and colors, utility classes or component styling |
| fetch API | Any HTTP client. Key features: GET/POST/PUT/PATCH/DELETE methods, error handling, request/response interceptors |
| localStorage | Any persistent storage. Key features: key-value storage, read/write operations, persistence across sessions |

---

## 9. Glossary

| Term | Definition |
|------|------------|
| GTD | Getting Things Done - A productivity methodology by David Allen consisting of five steps: Capture, Clarify, Organize, Engage, Review |
| Inbox | Default location for newly captured tasks before they are processed and organized |
| Next Action | A task that has been identified as the immediate next step to take on a project or area |
| Context | A situation or location where a task can be performed (e.g., Home, Office, Phone) |
| Tag | A category or label for organizing tasks (e.g., Work, Personal, Urgent) |
| Area | A high-level area of responsibility (e.g., Career, Health, Finance) that contains related projects |
| Project | A collection of related tasks that together achieve a specific outcome |
| Waiting | A task status indicating the user is waiting for someone or something before proceeding |
| Someday | A task status indicating the task is for "someday/maybe" and has no specific deadline |
| Soft Delete | Deleting an item by marking it as deleted instead of removing it permanently, allowing recovery |
| Optimistic Update | Updating the UI immediately before receiving confirmation from the server to improve perceived performance |
| Paginated Response | API response that includes items plus metadata about pagination (total, page, limit, pages) |

---

## 10. Open Questions

Things that need clarification before porting:

- [ ] Should the mobile version work offline with full sync capability?
- [ ] Is authentication required for multi-user support in future versions?
- [ ] Should notifications be implemented (push notifications, in-app notifications)?
- [ ] What is the target user scale (personal use only, or can it scale to teams)?
- [ ] Should there be data export/import functionality?
- [ ] Are there any specific accessibility requirements (WCAG level, screen reader support)?
- [ ] Should the application support multiple languages (i18n)?
- [ ] Is real-time collaboration needed (multiple users editing same tasks)?
- [ ] Should there be recurring tasks functionality?
- [ ] What are the specific design requirements (minimalist, detailed, dark mode support)?

---

**Document End**
