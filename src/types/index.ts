export type TaskStatus = 'inbox' | 'active' | 'completed' | 'waiting' | 'someday';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'active' | 'completed';
export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  reminder_time?: string;
  is_next_action: boolean;
  waiting_for?: string;
  delegated_to?: string;
  someday: boolean;
  created_at: string;
  updated_at: string;
  project_id?: number;
  context_id?: number;
  area_id?: number;
  tags: Tag[];
}

export interface Project {
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

export interface Tag {
  id: number;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Context {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
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

export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  context_id?: number;
  tag_ids?: number[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  reminder_time?: string;
  is_next_action?: boolean;
  waiting_for?: string;
  delegated_to?: string;
  someday?: boolean;
  project_id?: number;
  context_id?: number;
  area_id?: number;
  tag_ids?: number[];
}

export interface ProjectCreate {
  name: string;
  description?: string;
  area_id?: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  area_id?: number;
}

export interface InboxCreate {
  title: string;
  description?: string;
}

export interface TagCreate {
  name: string;
  color?: string;
}

export interface TagUpdate {
  name?: string;
  color?: string;
}

export interface ContextCreate {
  name: string;
  description?: string;
}

export interface ContextUpdate {
  name?: string;
  description?: string;
}

export interface AreaCreate {
  name: string;
  description?: string;
}

export interface AreaUpdate {
  name?: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type TaskListResponse = Task[] | PaginatedResponse<Task>;
export type ProjectListResponse = Project[] | PaginatedResponse<Project>;
export type TagListResponse = Tag[] | PaginatedResponse<Tag>;
export type ContextListResponse = Context[] | PaginatedResponse<Context>;
export type AreaListResponse = Area[] | PaginatedResponse<Area>;

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  context_id?: number;
  tag_id?: number;
  search?: string;
  sort?: 'created_at' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}
