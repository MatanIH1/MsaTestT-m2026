import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { todayKey } from '../utils/date.utils';

export class CustomValidators {
  /** Like Validators.required, but also fails on a value with only spaces. */
  static notBlank(control: AbstractControl<string | null>): ValidationErrors | null {
    const value = control.value ?? '';
    return value.trim().length > 0 ? null : { required: true };
  }

  /**
   * Date (YYYY-MM-DD) must not be before today. Empty value is left for "required".
   * A factory (returns a function) so it can get parameters in the future, like Validators.maxLength(n).
   */
  static notInPast(): ValidatorFn {
    return (control: AbstractControl<string | null>) => {
      const value = control.value;
      return value && value < todayKey() ? { pastDate: true } : null;
    };
  }
}
