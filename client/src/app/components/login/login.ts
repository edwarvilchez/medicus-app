import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  showPassword = signal(false);

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set('');
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Sesión iniciada correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al iniciar sesión. Verifica tus datos.');
          this.loading.set(false);
          Swal.fire({
            title: 'Error de Acceso',
            text: this.error(),
            icon: 'error',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    }
  }
}
