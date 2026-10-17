import { Task } from '../models/task.model';
import { EMPTY_FILTERS } from '../models/task-filters.model';
import { countByStatus, filterTasks, getDisplayStatus, isOverdue, sortTasks } from './task.utils';

const TODAY = '2026-03-15';

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    description: 'משימה לדוגמה',
    assignee: 'דנה',
    dueDate: TODAY,
    status: 'in-progress',
    createdAt: '2026-03-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('task utils', () => {
  describe('isOverdue / getDisplayStatus', () => {
    it('marks an in-progress task with a past due date as late', () => {
      const task = createTask({ dueDate: '2026-03-14' });
      expect(isOverdue(task, TODAY)).toBe(true);
      expect(getDisplayStatus(task, TODAY)).toBe('late');
    });

    it('does not mark a task that is due today as late', () => {
      expect(getDisplayStatus(createTask({ dueDate: TODAY }), TODAY)).toBe('in-progress');
    });

    it('does not mark done or reported-done tasks as late', () => {
      const pastDate = '2026-01-01';
      expect(getDisplayStatus(createTask({ dueDate: pastDate, status: 'done' }), TODAY)).toBe(
        'done',
      );
      expect(
        getDisplayStatus(createTask({ dueDate: pastDate, status: 'reported-done' }), TODAY),
      ).toBe('reported-done');
    });
  });

  describe('filterTasks', () => {
    const tasks = [
      createTask({ id: '1', description: 'הכנת דוח', assignee: 'דנה', dueDate: '2026-03-10' }),
      createTask({ id: '2', description: 'גיבוי שרתים', assignee: 'יוסי', dueDate: '2026-03-20' }),
      createTask({
        id: '3',
        description: 'עדכון הרשאות',
        assignee: 'דנה',
        dueDate: '2026-03-25',
        status: 'done',
      }),
    ];

    const ids = (result: Task[]) => result.map((task) => task.id);

    it('returns all tasks when there are no filters', () => {
      expect(filterTasks(tasks, EMPTY_FILTERS, TODAY)).toHaveLength(3);
    });

    it('searches in description and assignee', () => {
      expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, search: 'גיבוי' }, TODAY))).toEqual(['2']);
      expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, search: 'יוסי' }, TODAY))).toEqual(['2']);
    });

    it('filters by assignee', () => {
      expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, assignee: 'דנה' }, TODAY))).toEqual([
        '1',
        '3',
      ]);
    });

    it('filters by the displayed status, including late', () => {
      expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, status: 'late' }, TODAY))).toEqual(['1']);
      expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, status: 'in-progress' }, TODAY))).toEqual([
        '2',
      ]);
    });

    it('filters by due date range (inclusive)', () => {
      const filters = { ...EMPTY_FILTERS, dueFrom: '2026-03-10', dueTo: '2026-03-20' };
      expect(ids(filterTasks(tasks, filters, TODAY))).toEqual(['1', '2']);
    });

    it('combines several filters', () => {
      const filters = { ...EMPTY_FILTERS, assignee: 'דנה', status: 'done' as const };
      expect(ids(filterTasks(tasks, filters, TODAY))).toEqual(['3']);
    });
  });

  it('sortTasks puts open tasks first, ordered by due date', () => {
    const tasks = [
      createTask({ id: 'a', dueDate: '2026-03-01', status: 'done' }),
      createTask({ id: 'b', dueDate: '2026-03-20' }),
      createTask({ id: 'c', dueDate: '2026-03-05' }),
    ];
    expect(sortTasks(tasks).map((task) => task.id)).toEqual(['c', 'b', 'a']);
  });

  it('countByStatus counts by the displayed status', () => {
    const counts = countByStatus(
      [
        createTask({ dueDate: '2026-03-01' }),
        createTask({ dueDate: '2026-04-01' }),
        createTask({ status: 'done' }),
      ],
      TODAY,
    );
    expect(counts).toEqual({ 'in-progress': 1, late: 1, 'reported-done': 0, done: 1 });
  });
});
