import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { DodsToast, DodsToastService } from './toast.service';

@Component({
  selector: 'dods-toast-container',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DodsToastContainerComponent {
  private readonly svc = inject(DodsToastService);
  readonly toasts = this.svc.toasts;

  dismiss(t: DodsToast) { this.svc.dismiss(t.id); }

  iconFor(t: DodsToast): string {
    if (t.icon) return t.icon;
    switch (t.severity) {
      case 'success': return 'pi pi-check-circle';
      case 'warning': return 'pi pi-exclamation-triangle';
      case 'danger':  return 'pi pi-times-circle';
      default:        return 'pi pi-info-circle';
    }
  }
}
