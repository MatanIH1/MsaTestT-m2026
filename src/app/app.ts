import { Component } from '@angular/core';
import { TaskListPage } from './features/tasks/pages/task-list-page/task-list-page';

@Component({
  selector: 'app-root',
  imports: [TaskListPage],
  template: `
    <main class="container">
      <app-task-list-page />
    </main>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  `,
})
export class App {}
