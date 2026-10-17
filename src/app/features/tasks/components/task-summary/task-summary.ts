import { Component, input, output } from '@angular/core';
import { DisplayStatus } from '../../models/task.model';
import { DISPLAY_STATUSES } from '../../models/task-status.config';

/** Counter per status. Clicking a card filters the list by that status. */
@Component({
  selector: 'app-task-summary',
  templateUrl: './task-summary.html',
  styleUrl: './task-summary.scss',
})
export class TaskSummary {
  readonly counts = input.required<Record<DisplayStatus, number>>();
  readonly selected = input<DisplayStatus | ''>('');
  readonly statusSelect = output<DisplayStatus | ''>();

  protected readonly statuses = DISPLAY_STATUSES;

  protected toggle(status: DisplayStatus): void {
    this.statusSelect.emit(this.selected() === status ? '' : status);
  }
}
