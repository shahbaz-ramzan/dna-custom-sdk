import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <h1>SDK Initialization Failed</h1>
        <p class="error-message">{{ errorMessage }}</p>

        <div class="actions">
          <button
            pButton
            label="Try Again"
            icon="pi pi-refresh"
            (click)="retryInitialization()"
            class="p-button-secondary"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .error-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background: var(--surface-ground);
      }

      .error-content {
        max-width: 600px;
        padding: 3rem;
        background: var(--surface-card);
        border-radius: var(--border-radius);
        box-shadow: var(--card-shadow);
        text-align: center;
      }

      .error-icon {
        font-size: 4rem;
        color: var(--primary-color);
        margin-bottom: 1.5rem;
      }

      h1 {
        color: var(--text-color);
        margin-bottom: 1rem;
      }

      .error-message {
        font-size: 1.1rem;
        color: var(--text-secondary-color);
        margin-bottom: 2rem;
      }

      .error-details {
        background: var(--surface-hover);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin: 1.5rem 0;
        text-align: left;

        h3 {
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        pre {
          white-space: pre-wrap;
          word-break: break-all;
          color: var(--primary-color);
          margin: 0;
          font-size: 0.9rem;
        }
      }

      .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;

        button {
          min-width: 150px;
        }

        :first-child {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }

        :last-child {
          background: var(--surface-card);
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
        }
      }
    `,
  ],
})
export class ErrorPageComponent implements OnInit {
  errorTitle: string = 'Initialization Failed';
  errorMessage: string = '';
  errorDetails: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Get error details from localStorage
    const errorStateStr = localStorage.getItem('errorState');
    if (errorStateStr) {
      try {
        const errorState = JSON.parse(errorStateStr);
        this.errorTitle = errorState.title || 'Initialization Failed';
        this.errorMessage = errorState.message;
        this.errorDetails = errorState.details;
        // Clear the error state from localStorage
        localStorage.removeItem('errorState');
      } catch (e) {
        console.error('Error parsing error state:', e);
      }
    }
  }

  retryInitialization() {
    // Reload the entire application with the original URL parameters
    window.location.href = window.location.origin + window.location.search;
  }

  contactSupport() {
    // Implement your support contact logic
    window.location.href = `mailto:support@example.com?subject=SDK Initialization Error&body=Error Details: ${this.errorDetails}`;
  }
}
