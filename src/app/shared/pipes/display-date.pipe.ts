import { Pipe, PipeTransform } from '@angular/core';

/** 2026-03-15 -> 15/03/2026 (string based, so there are no timezone surprises) */
@Pipe({ name: 'displayDate' })
export class DisplayDatePipe implements PipeTransform {
  transform(dateKey: string | null | undefined): string {
    if (!dateKey) {
      return '';
    }
    const [year, month, day] = dateKey.split('-');
    return `${day}/${month}/${year}`;
  }
}
