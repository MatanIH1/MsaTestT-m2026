import { DisplayStatus, TaskStatus } from './task.model';

export interface StatusOption<T extends string = DisplayStatus> {
  value: T;
  label: string;
}

/**
 * Single source of truth for statuses.
 * Adding a new status = add it to the type + to this map (TypeScript will force it).
 */
export const STATUS_LABELS: Record<DisplayStatus, string> = {
  'in-progress': 'בטיפול',
  late: 'באיחור',
  'reported-done': 'דווח כטופל',
  done: 'טופל',
};

/**
 * Statuses the user can choose manually (late is calculated automatically).
 * The order matches the natural flow: in progress -> reported as done -> done.
 */
export const EDITABLE_STATUSES: StatusOption<TaskStatus>[] = [
  { value: 'in-progress', label: STATUS_LABELS['in-progress'] },
  { value: 'reported-done', label: STATUS_LABELS['reported-done'] },
  { value: 'done', label: STATUS_LABELS.done },
];

/** All statuses, in the order they are shown in filters and in the summary. */
export const DISPLAY_STATUSES: StatusOption[] = (
  ['in-progress', 'late', 'reported-done', 'done'] as const
).map((value) => ({ value, label: STATUS_LABELS[value] }));
