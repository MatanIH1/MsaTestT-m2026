import { DisplayStatus } from './task.model';

export interface TaskFilters {
  search: string;
  assignee: string;
  status: DisplayStatus | '';
  /** YYYY-MM-DD, empty = no limit */
  dueFrom: string;
  dueTo: string;
}

export const EMPTY_FILTERS: TaskFilters = {
  search: '',
  assignee: '',
  status: '',
  dueFrom: '',
  dueTo: '',
};
