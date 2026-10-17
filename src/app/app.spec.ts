import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(() => localStorage.clear());

  it('renders the tasks page with the mock data', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('ניהול משימות');
    expect(element.querySelectorAll('tbody tr').length).toBeGreaterThan(0);
  });
});
