import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals for reactive state
  registerData = signal<RegisterRequest>({
    name: '',
    mobile: '',
    password: ''
  });
  confirmPassword = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  // Computed signals
  canSubmit = computed(() => {
    const data = this.registerData();
    const confirm = this.confirmPassword();
    return data.name.trim() !== '' && 
           data.mobile.trim() !== '' && 
           data.password.trim() !== '' && 
           confirm.trim() !== '' && 
           data.password === confirm && 
           !this.isLoading();
  });

  passwordsMatch = computed(() => {
    const data = this.registerData();
    const confirm = this.confirmPassword();
    return data.password === confirm || confirm === '';
  });

  onSubmit(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerData()).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  updateName(name: string): void {
    this.registerData.update(data => ({ ...data, name }));
  }

  updateMobile(mobile: string): void {
    this.registerData.update(data => ({ ...data, mobile }));
  }

  updatePassword(password: string): void {
    this.registerData.update(data => ({ ...data, password }));
  }

  updateConfirmPassword(confirmPassword: string): void {
    this.confirmPassword.set(confirmPassword);
  }
} 