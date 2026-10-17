import { DisplayStatus, Task } from '../models/task.model';
import { TaskFilters } from '../models/task-filters.model';

/**
 * Requirement: "if the due date has passed and the task was not handled yet,
 * show the task as late".
 *
 * A task is late when its due date has passed and nobody has handled it yet.
 * A task that was "reported as done" is waiting for approval, so it is not counted as late.
 * Due today is not late yet – only a date strictly before today.
 */
export function isOverdue(task: Task, today: string): boolean {
  return task.status === 'in-progress' && task.dueDate < today;
}

/**
 * The status shown in the UI. "late" is derived here and never saved,
 * so it is always correct – no job has to update tasks when a day passes.
 * Used by the table, the status filter and the summary counters.
 */
export function getDisplayStatus(task: Task, today: string): DisplayStatus {
  return isOverdue(task, today) ? 'late' : task.status;
}

/**
 * Requirement: search + filter by assignee, status and due date.
 * All filters are combined (AND). An empty filter value means "don't filter by it".
 */
export function filterTasks(tasks: Task[], filters: TaskFilters, today: string): Task[] {
  const search = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    // Free text search – case insensitive, in description or assignee
    if (
      search &&
      !task.description.toLowerCase().includes(search) &&
      !task.assignee.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (filters.assignee && task.assignee !== filters.assignee) {
      return false;
    }
    // Compare with the displayed status, so filtering by "late" works too
    if (filters.status && getDisplayStatus(task, today) !== filters.status) {
      return false;
    }
    // YYYY-MM-DD strings can be compared as plain strings
    if (filters.dueFrom && task.dueDate < filters.dueFrom) {
      return false;
    }
    if (filters.dueTo && task.dueDate > filters.dueTo) {
      return false;
    }
    return true;
  });
}

/** Open tasks first (by nearest due date), finished tasks at the bottom. */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aDone = a.status === 'done' ? 1 : 0;
    const bDone = b.status === 'done' ? 1 : 0;
    return aDone - bDone || a.dueDate.localeCompare(b.dueDate);
  });
}

export function countByStatus(tasks: Task[], today: string): Record<DisplayStatus, number> {
  const counts: Record<DisplayStatus, number> = {
    'in-progress': 0,
    late: 0,
    'reported-done': 0,
    done: 0,
  };
  for (const task of tasks) {
    counts[getDisplayStatus(task, today)]++;
  }
  return counts;
}
