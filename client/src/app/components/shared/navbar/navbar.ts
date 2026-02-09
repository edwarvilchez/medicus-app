import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { CurrencyService } from '../../../services/currency.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInside = target.closest('.user-dropdown-container'); // Need to add this class to container
    if (!isInside) {
      this.isUserMenuOpen = false;
    }
  }

  isUserMenuOpen = false;

  constructor(
    public authService: AuthService, 
    public langService: LanguageService,
    public currencyService: CurrencyService
  ) {}

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  setLanguage(lang: 'es' | 'en') {
    this.langService.setLanguage(lang);
  }


  setCurrency(currency: 'USD' | 'VES') {
    this.currencyService.setCurrency(currency);
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: "Tendrás que ingresar tus credenciales de nuevo.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#64748b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  openProfileModal() {
    // Placeholder - user data update
    Swal.fire({
      title: 'Actualizar Datos',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${this.authService.currentUser()?.firstName || ''}">
        <input id="swal-input2" class="swal2-input" placeholder="Apellido" value="${this.authService.currentUser()?.lastName || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ]
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Actualizado!', 'Tus datos han sido actualizados (Simulación).', 'success');
        // TODO: Call API to update user
      }
    });
  }

  openChangePasswordModal() {
    Swal.fire({
      title: 'Cambiar Contraseña',
      html: `
        <input type="password" id="current-pass" class="swal2-input" placeholder="Contraseña Actual">
        <input type="password" id="new-pass" class="swal2-input" placeholder="Nueva Contraseña">
        <input type="password" id="confirm-pass" class="swal2-input" placeholder="Confirmar Nueva Contraseña">
      `,
      confirmButtonText: 'Cambiar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const current = (document.getElementById('current-pass') as HTMLInputElement).value;
        const newPass = (document.getElementById('new-pass') as HTMLInputElement).value;
        const confirm = (document.getElementById('confirm-pass') as HTMLInputElement).value;
        
        if (!current || !newPass || !confirm) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
        }
        if (newPass !== confirm) {
          Swal.showValidationMessage('Las contraseñas nuevas no coinciden');
        }
        return { current, newPass };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Éxito!', 'Tu contraseña ha sido actualizada.', 'success');
        // TODO: Call API to change password
      }
    });
  }
}
