import { Component, computed, input } from '@angular/core';
import { DisplayStatus } from '../../models/task.model';
import { STATUS_LABELS } from '../../models/task-status.config';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge badge--{{ status() }}">{{ label() }}</span>`,
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  readonly status = input.required<DisplayStatus>();

  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
}
