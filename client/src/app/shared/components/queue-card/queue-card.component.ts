import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { QueueItem } from '../../../core/models';

@Component({
  selector: 'app-queue-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule],
  templateUrl: './queue-card.component.html',
  styleUrl: './queue-card.component.scss',
})
export class QueueCardComponent {
  item = input.required<QueueItem>();

  vitals = output<QueueItem>();
  action = output<QueueItem>();

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'done':             return 'success';
      case 'in_consultation':  return 'info';
      case 'waiting':          return 'warn';
      case 'cancelled':
      case 'no_show':          return 'danger';
      default:                 return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'done':             return 'Completed';
      case 'in_consultation':  return 'In Consultation';
      case 'waiting':          return 'Waiting';
      case 'cancelled':        return 'Cancelled';
      case 'no_show':          return 'No Show';
      default:                 return status;
    }
  }

  getActionLabel(status: string): string {
    if (status === 'waiting') return 'Start';
    if (status === 'in_consultation') return 'Complete';
    return '';
  }
}
