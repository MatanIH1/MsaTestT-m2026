import { computed, inject, Injectable, signal } from '@angular/core';
import { Task, TaskInput, TaskStatus } from '../models/task.model';
import { createMockTasks } from '../data/mock-tasks';
import { TaskStorageService } from './task-storage.service';

/**
 * Holds the tasks state for the whole app.
 * Components read from the signals and change data only through the methods here.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly storage = inject(TaskStorageService);

  // Saved data from LocalStorage, or mock data on the first run (requirement: Mock Data / local service)
  private readonly tasksState = signal<Task[]>(this.storage.load() ?? createMockTasks());

  // Read-only for the outside – nobody can change the list without going through this service
  readonly tasks = this.tasksState.asReadonly();

  // Unique assignee names – for the assignee filter and the suggestions in the form
  readonly assignees = computed(() =>
    [...new Set(this.tasksState().map((task) => task.assignee))].sort((a, b) =>
      a.localeCompare(b, 'he'),
    ),
  );

  // Requirement: create a new task
  add(input: TaskInput): Task {
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.setTasks([...this.tasksState(), task]);
    return task;
  }

  update(id: string, changes: Partial<TaskInput>): void {
    this.setTasks(
      this.tasksState().map((task) => (task.id === id ? { ...task, ...changes } : task)),
    );
  }

  // Requirement: update the task status (e.g. in progress -> reported as done -> done)
  updateStatus(id: string, status: TaskStatus): void {
    this.update(id, { status });
  }

  // Bonus: delete a task
  remove(id: string): void {
    this.setTasks(this.tasksState().filter((task) => task.id !== id));
  }

  /**
   * Every change goes through here: update the signal (the UI refreshes by itself)
   * and save. Always a new array – signals compare by reference.
   */
  private setTasks(tasks: Task[]): void {
    this.tasksState.set(tasks);
    this.storage.save(tasks);
  }
}
