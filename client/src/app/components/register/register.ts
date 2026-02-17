import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../services/language.service';
import { API_URL } from '../../api-config';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

type AccountType = 'PATIENT' | 'PROFESSIONAL' | 'CLINIC' | 'HOSPITAL';

interface OrgOption {
  type: AccountType;
  icon: string;
  labelKey: string;
  descKey: string;
  color: string;
}

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
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  private formSub?: Subscription;
  private readonly STORAGE_KEY = 'medicus_register_draft';

  /** Step 1 = type selection, Step 2 = form */
  step = signal<1 | 2>(1);
  accountType = signal<AccountType>('PATIENT');

  orgOptions: OrgOption[] = [
    { type: 'PATIENT',      icon: 'bi-person-heart',     labelKey: 'register.patient',      descKey: 'register.patientDesc',      color: 'primary' },
    { type: 'PROFESSIONAL', icon: 'bi-briefcase-fill',   labelKey: 'landing.professional',  descKey: 'register.professionalDesc', color: 'success' },
    { type: 'CLINIC',       icon: 'bi-building',         labelKey: 'landing.clinic',        descKey: 'register.clinicDesc',       color: 'info' },
    { type: 'HOSPITAL',     icon: 'bi-hospital-fill',    labelKey: 'landing.hospital',      descKey: 'register.hospitalDesc',     color: 'warning' },
  ];

  isPatient = computed(() => this.accountType() === 'PATIENT');
  isProvider = computed(() => !this.isPatient());
  needsBusinessName = computed(() => this.accountType() === 'CLINIC' || this.accountType() === 'HOSPITAL');

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public langService: LanguageService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // Patient fields
      documentId: [''],
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
      birthDate: [''],
      gender: [''],
      address: [''],
      bloodType: [''],
      allergies: [''],
      // Provider fields
      businessName: [''],
      licenseNumber: [''],
      // Common
      accountType: ['PATIENT'],
      acceptTerms: [false, Validators.requiredTrue],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const savedDraft = localStorage.getItem(this.STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        delete draft.password;
        delete draft.confirmPassword;
        this.registerForm.patchValue(draft);
        if (draft.accountType) {
          this.accountType.set(draft.accountType);
        }
      } catch (_) {}
    }

    this.formSub = this.registerForm.valueChanges.subscribe(values => {
      const toSave = { ...values };
      delete toSave.password;
      delete toSave.confirmPassword;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    });
  }

  ngOnDestroy() {
    this.formSub?.unsubscribe();
  }

  /** Step 1 → Step 2 */
  selectAccountType(type: AccountType) {
    this.accountType.set(type);
    this.registerForm.patchValue({ accountType: type });
    this.updateValidators(type);
    this.step.set(2);
  }

  goBack() {
    this.step.set(1);
  }

  getSelectedOption(): OrgOption | undefined {
    return this.orgOptions.find(opt => opt.type === this.accountType());
  }

  private updateValidators(type: AccountType) {
    const c = (name: string) => this.registerForm.get(name)!;

    if (type === 'PATIENT') {
      c('documentId').setValidators([Validators.required]);
      c('phone').setValidators([Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]);
      c('birthDate').setValidators([Validators.required]);
      c('gender').setValidators([Validators.required]);
      c('businessName').clearValidators();
      c('licenseNumber').clearValidators();
    } else {
      c('documentId').clearValidators();
      c('birthDate').clearValidators();
      c('gender').clearValidators();
      c('licenseNumber').setValidators([Validators.required]);
      c('phone').setValidators([Validators.pattern(/^[0-9+\-\s()]+$/)]);
      if (type === 'CLINIC' || type === 'HOSPITAL') {
        c('businessName').setValidators([Validators.required]);
      } else {
        c('businessName').clearValidators();
      }
    }

    ['documentId', 'phone', 'birthDate', 'gender', 'businessName', 'licenseNumber'].forEach(
      name => c(name).updateValueAndValidity()
    );
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
      const f = this.registerForm.value;

      const data: any = {
        username: f.username,
        email: f.email,
        password: f.password,
        firstName: f.firstName,
        lastName: f.lastName,
        accountType: f.accountType,
        businessName: f.businessName,
        licenseNumber: f.licenseNumber,
        address: f.address,
        phone: f.phone,
      };

      if (f.accountType === 'PATIENT') {
        data.patientData = {
          documentId: f.documentId,
          phone: f.phone,
          birthDate: f.birthDate,
          gender: f.gender,
          address: f.address,
          bloodType: f.bloodType,
          allergies: f.allergies,
        };
      }

      this.http.post(`${API_URL}/auth/register`, data).subscribe({
        next: (res: any) => {
          this.loading = false;
          localStorage.removeItem(this.STORAGE_KEY);
          Swal.fire({
            title: this.langService.translate('register.success'),
            text: res.message || 'Tu cuenta ha sido creada exitosamente.',
            icon: 'success',
            confirmButtonColor: '#0ea5e9',
            confirmButtonText: this.langService.translate('auth.login'),
          }).then(() => this.router.navigate(['/login']));
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: this.langService.translate('register.error'),
            text: err.error?.message || 'No se pudo completar el registro.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
          });
        },
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const ctrl = this.registerForm.get(key);
        if (ctrl?.invalid) ctrl.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    const es = this.langService.lang() === 'es';
    if (control?.hasError('required')) return es ? 'Campo requerido' : 'Required';
    if (control?.hasError('email')) return es ? 'Email inválido' : 'Invalid email';
    if (control?.hasError('minlength'))
      return es ? `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres` : `Min ${control.errors?.['minlength'].requiredLength} chars`;
    if (control?.hasError('pattern')) return es ? 'Formato inválido' : 'Invalid format';
    if (control?.hasError('passwordMismatch')) return es ? 'No coinciden' : 'Mismatch';
    return '';
  }

  viewHistory() {
    Swal.fire({
      title: 'Acceso Restringido',
      text: 'Para ver tu historial médico digital, debes iniciar sesión.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Iniciar Sesión',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#0ea5e9',
    }).then(r => { if (r.isConfirmed) this.router.navigate(['/login']); });
  }
}
