import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals for reactive state
  loginData = signal<LoginRequest>({
    mobile: '',
    password: ''
  });
  isLoading = signal(false);
  errorMessage = signal('');

  // Computed signals
  canSubmit = computed(() => {
    const data = this.loginData();
    return data.mobile.trim() !== '' && data.password.trim() !== '' && !this.isLoading();
  });

  onSubmit(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginData()).subscribe({
      next: () => {
        this.router.navigate(['/chats']);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  updateMobile(mobile: string): void {
    this.loginData.update(data => ({ ...data, mobile }));
  }

  updatePassword(password: string): void {
    this.loginData.update(data => ({ ...data, password }));
  }
} 