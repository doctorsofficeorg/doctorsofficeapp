import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);

  doctor = this.authService.currentDoctor;
  showUserMenu = signal(false);

  get doctorInitials(): string {
    const name = this.doctor()?.name ?? 'Doctor';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return parts[0].substring(0, 2);
  }

  get doctorShortName(): string {
    const name = this.doctor()?.name ?? 'Doctor';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0] + ' ' + parts[1].charAt(0) + '.';
    }
    return parts[0];
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  signOut(): void {
    this.authService.logout();
  }
}
