/**
 * Requirement: the possible statuses are in progress / late / reported as done / done.
 *
 * Statuses that are actually stored on a task.
 * "late" is not stored – it is calculated from the due date (see getDisplayStatus).
 */
export type TaskStatus = 'in-progress' | 'reported-done' | 'done';

/** The status the user sees in the UI. */
export type DisplayStatus = TaskStatus | 'late';

/** Requirement: every task shows at least description, assignee, due date and status. */
export interface Task {
  id: string;
  description: string;
  assignee: string;
  /** Local date in YYYY-MM-DD format */
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}

/** The fields the user fills in when creating / editing a task. */
export type TaskInput = Pick<Task, 'description' | 'assignee' | 'dueDate' | 'status'>;
