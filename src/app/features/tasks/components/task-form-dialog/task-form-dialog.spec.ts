import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormDialog } from './task-form-dialog';
import { TaskInput } from '../../models/task.model';
import { addDays, todayKey } from '../../../../shared/utils/date.utils';

describe('TaskFormDialog', () => {
  let fixture: ComponentFixture<TaskFormDialog>;
  let element: HTMLElement;
  let saved: TaskInput | undefined;

  beforeEach(async () => {
    // jsdom does not implement <dialog>.showModal()
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.open = true;
    };

    fixture = TestBed.createComponent(TaskFormDialog);
    element = fixture.nativeElement;
    saved = undefined;
    fixture.componentInstance.save.subscribe((value) => (saved = value));
    await fixture.whenStable();
  });

  function setValue(selector: string, value: string): void {
    const input = element.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  async function submit(): Promise<void> {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  it('does not save and shows errors when required fields are missing', async () => {
    setValue('[formControlName=description]', '   ');
    await submit();

    expect(saved).toBeUndefined();
    expect(element.querySelector('[role=alert]')).not.toBeNull();
    expect(element.querySelectorAll('.field__error')).toHaveLength(3);
  });

  it('does not allow a due date in the past for a new task', async () => {
    setValue('[formControlName=description]', 'משימה');
    setValue('[formControlName=assignee]', 'דנה');
    setValue('[formControlName=dueDate]', addDays(todayKey(), -1));
    await submit();

    expect(saved).toBeUndefined();
    expect(element.textContent).toContain('תאריך היעד לא יכול להיות בעבר');
  });

  it('emits trimmed values when the form is valid', async () => {
    const dueDate = addDays(todayKey(), 3);
    setValue('[formControlName=description]', '  הכנת מצגת  ');
    setValue('[formControlName=assignee]', ' דנה ');
    setValue('[formControlName=dueDate]', dueDate);
    await submit();

    expect(saved).toEqual({
      description: 'הכנת מצגת',
      assignee: 'דנה',
      dueDate,
      status: 'in-progress',
    });
  });
});
