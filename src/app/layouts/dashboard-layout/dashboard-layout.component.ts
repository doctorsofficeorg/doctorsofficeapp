import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private readonly router = inject(Router);

  protected readonly pageTitle = signal('Dashboard');
  protected readonly pageSubtitle = signal('Welcome back, Dr. Mehta');

  protected readonly profileMenuOpen = signal(false);
  protected readonly userName = signal('Dr. Mehta');
  protected readonly userEmail = signal('dr.mehta@clinic.com');

  protected readonly userInitials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'grid' },
    { label: 'Patients', route: '/patients', icon: 'users' },
    { label: 'Appointments', route: '/appointments', icon: 'calendar' },
    { label: 'Prescriptions', route: '/prescriptions', icon: 'file-text' },
    { label: 'Billing', route: '/billing', icon: 'rupee' },
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];

  protected toggleProfileMenu(): void {
    this.profileMenuOpen.update((v) => !v);
  }

  protected closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  protected signOut(): void {
    this.router.navigate(['/login']);
  }

  protected navigateToSettings(): void {
    this.closeProfileMenu();
    this.router.navigate(['/settings']);
  }

  protected navigateToProfile(): void {
    this.closeProfileMenu();
    this.router.navigate(['/settings']);
  }
}
