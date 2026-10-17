import { Component, computed, input, model } from '@angular/core';
import { EMPTY_FILTERS, TaskFilters } from '../../models/task-filters.model';
import { DISPLAY_STATUSES } from '../../models/task-status.config';

/**
 * Requirement: search tasks + filter by assignee, status and due date.
 * Only edits the filters object – the filtering itself happens in filterTasks().
 */
@Component({
  selector: 'app-task-filters-bar',
  templateUrl: './task-filters-bar.html',
  styleUrl: './task-filters-bar.scss',
})
export class TaskFiltersBar {
  /** Two-way binding: [(filters)] */
  readonly filters = model.required<TaskFilters>();
  readonly assignees = input.required<string[]>();

  protected readonly statuses = DISPLAY_STATUSES;

  protected readonly hasActiveFilters = computed(() =>
    Object.values(this.filters()).some((value) => value !== ''),
  );

  // Always a new object (immutable) so the computed in the page notices the change
  protected setFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]): void {
    this.filters.update((filters) => ({ ...filters, [key]: value }));
  }

  protected setStatus(value: string): void {
    this.setFilter('status', value as TaskFilters['status']);
  }

  protected clear(): void {
    this.filters.set(EMPTY_FILTERS);
  }
}
