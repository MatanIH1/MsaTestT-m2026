import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskInput } from '../../models/task.model';
import { EMPTY_FILTERS, TaskFilters } from '../../models/task-filters.model';
import { countByStatus, filterTasks, sortTasks } from '../../utils/task.utils';
import { TaskSummary } from '../../components/task-summary/task-summary';
import { TaskFiltersBar } from '../../components/task-filters-bar/task-filters-bar';
import { StatusChange, TaskTable } from '../../components/task-table/task-table';
import { TaskFormDialog } from '../../components/task-form-dialog/task-form-dialog';
import { todayKey } from '../../../../shared/utils/date.utils';

/**
 * Container component: talks to the service and holds the page state.
 * The child components are presentational – they get data via inputs and report back via outputs.
 */
@Component({
  selector: 'app-task-list-page',
  imports: [TaskSummary, TaskFiltersBar, TaskTable, TaskFormDialog],
  templateUrl: './task-list-page.html',
  styleUrl: './task-list-page.scss',
})
export class TaskListPage {
  private readonly taskService = inject(TaskService);

  protected readonly today = todayKey();
  protected readonly tasks = this.taskService.tasks;
  protected readonly assignees = this.taskService.assignees;
  protected readonly filters = signal<TaskFilters>(EMPTY_FILTERS);

  // computed = recalculated automatically whenever tasks() or filters() change
  protected readonly counts = computed(() => countByStatus(this.tasks(), this.today));
  protected readonly visibleTasks = computed(() =>
    sortTasks(filterTasks(this.tasks(), this.filters(), this.today)),
  );

  protected readonly isFormOpen = signal(false);
  /** null = creating a new task */
  protected readonly editedTask = signal<Task | null>(null);
  protected readonly notice = signal<string | null>(null);
  private noticeTimer?: ReturnType<typeof setTimeout>;

  // Requirement: "add task" button
  protected openCreateForm(): void {
    this.editedTask.set(null);
    this.isFormOpen.set(true);
  }

  protected openEditForm(task: Task): void {
    this.editedTask.set(task);
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
    this.editedTask.set(null);
  }

  // Requirement: after saving the form the new task is added to the list
  protected onSave(input: TaskInput): void {
    const task = this.editedTask();
    if (task) {
      this.taskService.update(task.id, input);
      this.showNotice('המשימה עודכנה');
    } else {
      this.taskService.add(input);
      this.showNotice('המשימה נוספה בהצלחה');
    }
    this.closeForm();
  }

  protected onStatusChange({ task, status }: StatusChange): void {
    this.taskService.updateStatus(task.id, status);
  }

  // Bonus: delete, with a confirmation so a task isn't deleted by mistake
  protected onRemove(task: Task): void {
    if (confirm(`למחוק את המשימה "${task.description}"?`)) {
      this.taskService.remove(task.id);
      this.showNotice('המשימה נמחקה');
    }
  }

  protected filterByStatus(status: TaskFilters['status']): void {
    this.filters.update((filters) => ({ ...filters, status }));
  }

  protected clearFilters(): void {
    this.filters.set(EMPTY_FILTERS);
  }

  private showNotice(message: string): void {
    clearTimeout(this.noticeTimer);
    this.notice.set(message);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 3000);
  }
}
