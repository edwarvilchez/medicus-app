import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener roles permitidos desde la configuración de la ruta
  const expectedRoles = route.data['roles'] as string[];

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!expectedRoles || expectedRoles.length === 0) {
    return true; // Si no hay roles definidos, asumimos acceso libre (autenticado)
  }

  if (authService.hasRole(expectedRoles)) {
    return true;
  }

  // Acceso denegado
  Swal.fire({
    title: 'Acceso Denegado',
    text: 'No tienes permisos suficientes para acceder a esta sección.',
    icon: 'error',
    confirmButtonColor: '#ef4444'
  });
  
  router.navigate(['/dashboard']);
  return false;
};
