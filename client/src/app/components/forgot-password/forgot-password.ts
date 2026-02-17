import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api-config';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  forgotForm: FormGroup;
  status = signal<{ type: string; message: string }>({ type: '', message: '' });
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.loading.set(true);
      this.status.set({ type: '', message: '' });

      this.http.post(`${API_URL}/auth/forgot-password`, this.forgotForm.value)
        .subscribe({
          next: (response: any) => {
            this.loading.set(false);
            const debugMsg = response.debugToken ? ` (Debug Token: ${response.debugToken})` : '';
            this.status.set({
              type: 'success',
              message: `Si el correo existe, recibirás instrucciones para restablecer tu contraseña.${debugMsg}`
            });
          },
          error: (err) => {
            this.loading.set(false);
            const errorMessage = err.error?.error || err.message || 'Error al procesar la solicitud';
            this.status.set({ type: 'error', message: errorMessage });
          }
        });
    }
  }
}
