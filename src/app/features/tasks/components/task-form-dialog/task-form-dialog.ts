import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task, TaskInput, TaskStatus } from '../../models/task.model';
import { EDITABLE_STATUSES } from '../../models/task-status.config';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { todayKey } from '../../../../shared/utils/date.utils';

export const DESCRIPTION_MAX_LENGTH = 200;
export const ASSIGNEE_MAX_LENGTH = 50;

/**
 * Create / edit task form inside a native <dialog>.
 * When `task` is passed the form works in edit mode, otherwise it creates a new task.
 */
@Component({
  selector: 'app-task-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-dialog.html',
  styleUrl: './task-form-dialog.scss',
})
export class TaskFormDialog implements OnInit {
  readonly task = input<Task | null>(null);
  /** Existing assignees – used as suggestions in the assignee field */
  readonly assignees = input<string[]>([]);

  readonly save = output<TaskInput>();
  readonly closed = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly statusOptions = EDITABLE_STATUSES;
  protected readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;
  protected readonly isEditMode = computed(() => this.task() !== null);
  protected readonly submitted = signal(false);
  protected readonly minDate = todayKey();

  /**
   * Requirement: Reactive Forms for the create task form.
   * Requirement: description, assignee and due date are required, status is optional
   * (a new task starts as "in progress").
   */
  protected readonly form = this.fb.group({
    description: ['', [CustomValidators.notBlank, Validators.maxLength(DESCRIPTION_MAX_LENGTH)]],
    assignee: ['', [CustomValidators.notBlank, Validators.maxLength(ASSIGNEE_MAX_LENGTH)]],
    dueDate: ['', Validators.required],
    status: this.fb.control<TaskStatus>('in-progress'),
  });

  constructor() {
    // Requirement: clicking "add task" opens a dialog. showModal() needs the element in the DOM
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  // Inputs are available only from ngOnInit, not in the constructor
  ngOnInit(): void {
    const task = this.task();
    if (task) {
      this.form.setValue({
        description: task.description,
        assignee: task.assignee,
        dueDate: task.dueDate,
        status: task.status,
      });
    } else {
      // An existing task may already be overdue, so this rule applies only to new tasks
      this.form.controls.dueDate.addValidators(CustomValidators.notInPast());
    }
  }

  /**
   * Show an error only after the user left the field or tried to save –
   * not on an empty form that was just opened.
   */
  protected isInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    // Requirement: basic validation + a message to the user when information is missing
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // The form doesn't save by itself – it emits the values and the page decides what to do
    const { description, assignee, dueDate, status } = this.form.getRawValue();
    this.save.emit({
      description: description.trim(),
      assignee: assignee.trim(),
      dueDate,
      status,
    });
  }

  /** Esc key – let the parent close the dialog instead of the browser */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.closed.emit();
  }
}
