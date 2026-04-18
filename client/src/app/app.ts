import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClarityService } from './core/services/clarity.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Initialize Clarity tracking on app startup
  private clarity = inject(ClarityService);
  private theme = inject(ThemeService);

  constructor() {
    this.theme.initialize();
  }
}
