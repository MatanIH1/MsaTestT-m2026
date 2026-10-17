import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'task-manager.tasks';

/**
 * Bonus: saving the data in LocalStorage.
 *
 * Responsible only for persistence.
 * If a real backend is added later, only this layer needs to change (e.g. to HttpClient).
 */
@Injectable({ providedIn: 'root' })
export class TaskStorageService {
  /** Returns null when nothing was saved yet (or the data is corrupted). */
  load(): Task[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Task[]) : null;
    } catch {
      return null;
    }
  }

  save(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      // e.g. storage is full or blocked – the app keeps working in memory
      console.warn('Could not save tasks to LocalStorage', error);
    }
  }
}
