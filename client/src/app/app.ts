import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClarityService } from './core/services/clarity.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Initialize Clarity tracking on app startup
  private clarity = inject(ClarityService);
}
