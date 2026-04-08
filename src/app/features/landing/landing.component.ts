import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly features = [
    {
      icon: 'prescription',
      title: '60-Second Prescriptions',
      description:
        'Create, preview, and send professional prescriptions in under a minute. Smart templates and auto-complete make it effortless.',
    },
    {
      icon: 'shield',
      title: 'Your Data, Your Control',
      description:
        'All patient data stays on your device. Zero third-party tracking, full encryption, and complete ownership of your records.',
    },
    {
      icon: 'billing',
      title: 'GST-Ready Billing',
      description:
        'Generate GST-compliant invoices instantly. Automatic tax calculations, HSN codes, and export-ready reports for your CA.',
    },
  ];
}
