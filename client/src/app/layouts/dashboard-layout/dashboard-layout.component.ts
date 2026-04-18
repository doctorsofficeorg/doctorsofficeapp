import { Component, signal, inject, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';
import { ViewportService } from '../../core/services/viewport.service';
import { ThemeService } from '../../core/services/theme.service';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, BottomNavComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  private authStore = inject(AuthStore);
  private viewport = inject(ViewportService);
  private themeService = inject(ThemeService);

  doctor = this.authStore.currentDoctor;
  activeClinic = this.authStore.activeClinic;
  theme = this.themeService.theme;
  belowLg = this.viewport.belowLg;
  isMobile = this.viewport.isMobile;

  drawerOpen = signal(false);
  showUserMenu = signal(false);

  doctorInitials = computed(() => {
    const name = this.doctor()?.fullName ?? 'Doctor';
    const parts = name.split(' ');
    if (parts.length >= 2) return parts[0].charAt(0) + parts[1].charAt(0);
    return parts[0].substring(0, 2);
  });

  clinicInitials = computed(() => {
    const name = this.activeClinic()?.clinicName ?? 'Doctors Office';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  });

  doctorShortName = computed(() => {
    const name = this.doctor()?.fullName ?? 'Doctor';
    const parts = name.split(' ');
    if (parts.length >= 2) return parts[0] + ' ' + parts[1].charAt(0) + '.';
    return parts[0];
  });

  constructor() {
    // Auto-close drawer when viewport grows past lg.
    effect(() => {
      if (!this.belowLg() && this.drawerOpen()) this.drawerOpen.set(false);
    });
  }

  openDrawer(): void { this.drawerOpen.set(true); }
  closeDrawer(): void { this.drawerOpen.set(false); }
  toggleUserMenu(): void { this.showUserMenu.update(v => !v); }
  closeUserMenu(): void { this.showUserMenu.set(false); }
  toggleTheme(): void { this.themeService.toggle(); }
  signOut(): void { this.authStore.logout(); }
}
