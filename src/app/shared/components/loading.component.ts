import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.overlay]="overlay">
      <div class="loading-content">
        <div class="spinner">
          <div class="spinner-inner"></div>
        </div>
        <p class="loading-text" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 9999;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(243, 156, 18, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: spin 1s linear infinite;
    }

    .spinner-inner {
      width: 30px;
      height: 30px;
      border: 3px solid transparent;
      border-top-color: #f39c12;
      border-radius: 50%;
      animation: spin 0.8s linear infinite reverse;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: #ecf0f1;
      font-size: 1rem;
      margin: 0;
      text-align: center;
    }

    .overlay .loading-text {
      color: #f39c12;
      font-weight: 500;
    }
  `]
})
export class LoadingComponent {
  @Input() message: string = 'Cargando...';
  @Input() overlay: boolean = false;
}