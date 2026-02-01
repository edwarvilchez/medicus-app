import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
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

  constructor(
    public authService: AuthService, 
    public langService: LanguageService
  ) {}

  setLanguage(lang: 'es' | 'en') {
    this.langService.setLanguage(lang);
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
}
