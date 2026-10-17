import { Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { EDITABLE_STATUSES } from '../../models/task-status.config';
import { getDisplayStatus } from '../../utils/task.utils';
import { StatusBadge } from '../status-badge/status-badge';
import { DisplayDatePipe } from '../../../../shared/pipes/display-date.pipe';

export interface StatusChange {
  task: Task;
  status: TaskStatus;
}

/**
 * Requirement: view the list of tasks (description, assignee, due date, status)
 * and change the status of a task.
 *
 * Presentational component – gets the tasks to show and only emits events.
 */
@Component({
  selector: 'app-task-table',
  imports: [StatusBadge, DisplayDatePipe],
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss',
})
export class TaskTable {
  readonly tasks = input.required<Task[]>();
  readonly today = input.required<string>();

  readonly statusChange = output<StatusChange>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();

  protected readonly statusOptions = EDITABLE_STATUSES;
  protected readonly getDisplayStatus = getDisplayStatus;

  protected onStatusChange(task: Task, value: string): void {
    this.statusChange.emit({ task, status: value as TaskStatus });
  }
}
