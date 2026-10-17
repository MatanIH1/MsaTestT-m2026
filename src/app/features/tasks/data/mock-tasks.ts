import { Task } from '../models/task.model';
import { addDays, todayKey } from '../../../shared/utils/date.utils';

/**
 * Requirement: the data can be Mock Data – no server needed.
 *
 * Initial data shown on first launch (before anything is saved to LocalStorage).
 * Dates are relative to today so there is always a mix of late / upcoming tasks.
 */
export function createMockTasks(): Task[] {
  const today = todayKey();
  const createdAt = new Date().toISOString();

  return [
    {
      id: 'mock-1',
      description: 'הכנת דוח רבעוני להנהלה',
      assignee: 'דנה לוי',
      dueDate: addDays(today, 5),
      status: 'in-progress',
      createdAt,
    },
    {
      id: 'mock-2',
      description: 'עדכון הרשאות משתמשים במערכת השכר',
      assignee: 'יוסי כהן',
      dueDate: addDays(today, -3),
      status: 'in-progress',
      createdAt,
    },
    {
      id: 'mock-3',
      description: 'בדיקת גיבויים לשרתי הקבצים',
      assignee: 'מיכל אברהם',
      dueDate: addDays(today, -1),
      status: 'reported-done',
      createdAt,
    },
    {
      id: 'mock-4',
      description: 'התקנת עמדות עבודה לעובדים חדשים',
      assignee: 'יוסי כהן',
      dueDate: addDays(today, -7),
      status: 'done',
      createdAt,
    },
    {
      id: 'mock-5',
      description: 'חידוש רישיונות אנטי-וירוס',
      assignee: 'דנה לוי',
      dueDate: today,
      status: 'in-progress',
      createdAt,
    },
    {
      id: 'mock-6',
      description: 'תיאום הדרכה על מערכת ניהול המסמכים',
      assignee: 'רועי מזרחי',
      dueDate: addDays(today, 12),
      status: 'in-progress',
      createdAt,
    },
  ];
}
