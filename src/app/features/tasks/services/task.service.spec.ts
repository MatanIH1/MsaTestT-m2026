import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { TaskStorageService } from './task-storage.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let saved: Task[] | null;

  const initialTasks: Task[] = [
    {
      id: '1',
      description: 'משימה קיימת',
      assignee: 'דנה',
      dueDate: '2026-03-15',
      status: 'in-progress',
      createdAt: '2026-03-01T10:00:00.000Z',
    },
  ];

  beforeEach(() => {
    saved = null;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TaskStorageService,
          useValue: {
            load: () => initialTasks,
            save: (tasks: Task[]) => (saved = tasks),
          },
        },
      ],
    });
    service = TestBed.inject(TaskService);
  });

  it('loads the tasks from storage', () => {
    expect(service.tasks()).toEqual(initialTasks);
  });

  it('adds a task with a generated id and saves it', () => {
    const task = service.add({
      description: 'משימה חדשה',
      assignee: 'יוסי',
      dueDate: '2026-04-01',
      status: 'in-progress',
    });

    expect(task.id).toBeTruthy();
    expect(service.tasks()).toHaveLength(2);
    expect(saved).toEqual(service.tasks());
  });

  it('updates the status of a task', () => {
    service.updateStatus('1', 'reported-done');

    expect(service.tasks()[0].status).toBe('reported-done');
    expect(saved?.[0].status).toBe('reported-done');
  });

  it('removes a task', () => {
    service.remove('1');

    expect(service.tasks()).toEqual([]);
    expect(saved).toEqual([]);
  });

  it('returns a unique list of assignees', () => {
    service.add({ description: 'א', assignee: 'דנה', dueDate: '2026-04-01', status: 'done' });
    service.add({ description: 'ב', assignee: 'יוסי', dueDate: '2026-04-01', status: 'done' });

    expect(service.assignees()).toEqual(['דנה', 'יוסי']);
  });
});
