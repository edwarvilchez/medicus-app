import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // User data
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      
      // Patient specific data
      documentId: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      address: [''],
      bloodType: [''],
      allergies: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const formValue = this.registerForm.value;
      
      const registrationData = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        role: 'PATIENT',
        patientData: {
          documentId: formValue.documentId,
          phone: formValue.phone,
          birthDate: formValue.birthDate,
          gender: formValue.gender,
          address: formValue.address,
          bloodType: formValue.bloodType,
          allergies: formValue.allergies
        }
      };

      this.http.post('http://localhost:5000/api/auth/register', registrationData)
        .subscribe({
          next: (response) => {
            this.loading = false;
            Swal.fire({
              title: '¡Registro Exitoso!',
              text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
              icon: 'success',
              confirmButtonColor: '#0ea5e9'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            this.loading = false;
            Swal.fire({
              title: 'Error',
              text: error.error?.message || 'No se pudo completar el registro. Por favor, intenta de nuevo.',
              icon: 'error',
              confirmButtonColor: '#ef4444'
            });
          }
        });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
