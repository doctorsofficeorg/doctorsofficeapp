import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { STORY_INDEX } from '../story-index';
import { DodsButtonComponent } from '../../components/button';

@Component({
  selector: 'dods-playground-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DodsButtonComponent],
  templateUrl: './playground-shell.component.html',
  styleUrls: ['./playground-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DodsPlaygroundShellComponent {
  readonly index = STORY_INDEX;
  readonly theme = signal<'light' | 'dark'>(
    (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'light'
  );
  readonly sidebarOpen = signal(true);

  readonly groups = Object.entries(this.index).reduce<Record<string, { id: string; name: string; icon?: string }[]>>(
    (acc, [id, meta]) => {
      (acc[meta.group] ||= []).push({ id, name: meta.name, icon: meta.icon });
      return acc;
    },
    {},
  );

  readonly groupNames = Object.keys(this.groups);

  toggleTheme() {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }
}
