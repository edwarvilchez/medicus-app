import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../services/language.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  currentYear = new Date().getFullYear();
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  private formSub?: Subscription;
  private readonly STORAGE_KEY = 'medicus_register_draft';
  accountType = signal<'PATIENT' | 'PROFESSIONAL' | 'CLINIC' | 'HOSPITAL'>('PATIENT');

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public langService: LanguageService
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
      allergies: [''],
      acceptTerms: [false, Validators.requiredTrue],

      // Provider specific data
      businessName: [''],
      licenseNumber: [''],
      accountType: ['PATIENT']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Restaurar datos guardados
    const savedDraft = localStorage.getItem(this.STORAGE_KEY);
    if (savedDraft) {
      try {
        const draftValues = JSON.parse(savedDraft);
        // No restauramos contraseñas por seguridad
        delete draftValues.password;
        delete draftValues.confirmPassword;
        this.registerForm.patchValue(draftValues);
      } catch (e) {
        console.error('Error al restaurar borrador de registro:', e);
      }
    }

    // Guardar cambios automáticamente
    this.formSub = this.registerForm.valueChanges.subscribe(values => {
      const toSave = { ...values };
      delete toSave.password;
      delete toSave.confirmPassword;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    });

    // Listen to account type changes to adjust validators
    this.registerForm.get('accountType')?.valueChanges.subscribe(type => {
      this.accountType.set(type);
      this.调整Validators(type);
    });
  }

  private 调整Validators(type: string) {
    const businessNameControl = this.registerForm.get('businessName');
    const licenseNumberControl = this.registerForm.get('licenseNumber');
    const documentIdControl = this.registerForm.get('documentId');

    if (type === 'PATIENT') {
      businessNameControl?.clearValidators();
      licenseNumberControl?.clearValidators();
      documentIdControl?.setValidators([Validators.required]);
    } else {
      documentIdControl?.clearValidators();
      licenseNumberControl?.setValidators([Validators.required]);
      if (type === 'CLINIC' || type === 'HOSPITAL') {
        businessNameControl?.setValidators([Validators.required]);
      } else {
        businessNameControl?.clearValidators();
      }
    }
    businessNameControl?.updateValueAndValidity();
    licenseNumberControl?.updateValueAndValidity();
    documentIdControl?.updateValueAndValidity();
  }

  ngOnDestroy() {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
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
        role: formValue.accountType === 'PATIENT' ? 'PATIENT' : (formValue.accountType === 'PROFESSIONAL' ? 'DOCTOR' : 'ADMINISTRATIVE'),
        accountType: formValue.accountType,
        businessName: formValue.businessName,
        licenseNumber: formValue.licenseNumber,
        address: formValue.address,
        phone: formValue.phone,
        patientData: formValue.accountType === 'PATIENT' ? {
          documentId: formValue.documentId,
          phone: formValue.phone,
          birthDate: formValue.birthDate,
          gender: formValue.gender,
          address: formValue.address,
          bloodType: formValue.bloodType,
          allergies: formValue.allergies
        } : undefined
      };

      this.http.post('http://localhost:5000/api/auth/register', registrationData)
        .subscribe({
          next: (response: any) => {
            this.loading = false;
            localStorage.removeItem(this.STORAGE_KEY);
            Swal.fire({
              title: this.langService.translate('register.success'),
              text: response.message || (this.langService.lang() === 'es' ? 'Tu cuenta ha sido creada exitosamente.' : 'Your account has been created successfully.'),
              icon: 'success',
              confirmButtonColor: '#0ea5e9',
              confirmButtonText: this.langService.translate('auth.login')
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            this.loading = false;
            const errorMsg = error.error?.message || error.error?.error || (this.langService.lang() === 'es' ? 'No se pudo completar el registro.' : 'Could not complete registration.');
            
            Swal.fire({
              title: this.langService.translate('register.error'),
              text: errorMsg,
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

  viewHistory() {
    Swal.fire({
      title: 'Acceso Restringido',
      text: 'Para ver tu historial médico digital, debes ser un paciente registrado e iniciar sesión en la plataforma por motivos de seguridad y privacidad (ISO 27001).',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Iniciar Sesión',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    const isEs = this.langService.lang() === 'es';
    
    if (control?.hasError('required')) {
      return isEs ? 'Este campo es requerido' : 'This field is required';
    }
    if (control?.hasError('email')) {
      return isEs ? 'Email inválido' : 'Invalid email';
    }
    if (control?.hasError('minlength')) {
      return isEs 
        ? `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres` 
        : `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return isEs ? 'Formato inválido' : 'Invalid format';
    }
    if (control?.hasError('passwordMismatch')) {
      return isEs ? 'Las contraseñas no coinciden' : 'Passwords do not match';
    }
    return '';
  }
}
