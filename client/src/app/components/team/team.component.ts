import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService, TeamMember } from '../../services/team.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4 fade-in">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">Gestión de Equipo</h2>
          <p class="text-muted">Administra los miembros de tu organización.</p>
        </div>
        <button class="btn btn-primary" (click)="toggleForm()">
          <i class="bi" [class.bi-plus-lg]="!showForm" [class.bi-x-lg]="showForm"></i>
          {{ showForm ? 'Cancelar' : 'Añadir Miembro' }}
        </button>
      </div>

      <!-- Add Member Form -->
      <div *ngIf="showForm" class="card border-0 shadow-sm mb-4 slide-in">
        <div class="card-body">
          <h5 class="card-title fw-bold mb-3">Nuevo Miembro</h5>
          <form (ngSubmit)="onSubmit()" #memberForm="ngForm">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="newMember.firstName" name="firstName" required>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted">Apellido</label>
                <input type="text" class="form-control" [(ngModel)]="newMember.lastName" name="lastName" required>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted">Email</label>
                <input type="email" class="form-control" [(ngModel)]="newMember.email" name="email" required>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted">Rol</label>
                <select class="form-select" [(ngModel)]="newMember.roleName" name="roleName" required>
                  <option value="" disabled>Seleccionar Rol</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Enfermera(o)</option>
                  <option value="ADMINISTRATIVE">Administrativo</option>
                </select>
              </div>
              
              <!-- Role Specific Fields -->
              <div class="col-md-6" *ngIf="newMember.roleName === 'DOCTOR' || newMember.roleName === 'NURSE'">
                <label class="form-label small fw-bold text-muted">Licencia / ID</label>
                <input type="text" class="form-control" [(ngModel)]="newMember.licenseNumber" name="licenseNumber">
              </div>

               <div class="col-md-6">
                <label class="form-label small fw-bold text-muted">Género</label>
                <select class="form-select" [(ngModel)]="newMember.gender" name="gender" required>
                   <option value="Male">Masculino</option>
                   <option value="Female">Femenino</option>
                </select>
              </div>

              <div class="col-12 mt-4 text-end">
                <button type="submit" class="btn btn-primary px-4" [disabled]="!memberForm.form.valid">
                  Guardar y Enviar Invitación
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Team List -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4 py-3 text-muted x-small text-uppercase">Miembro</th>
                  <th class="py-3 text-muted x-small text-uppercase">Email</th>
                  <th class="py-3 text-muted x-small text-uppercase">Rol</th>
                  <th class="pe-4 py-3 text-end text-muted x-small text-uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let member of teamService.members()">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <div class="avatar-circle bg-primary-subtle text-primary fw-bold">
                        {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                      </div>
                      <div>
                        <div class="fw-bold text-dark">{{ member.firstName }} {{ member.lastName }}</div>
                        <div class="small text-muted" *ngIf="member.licenseNumber">Lic: {{ member.licenseNumber }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ member.email }}</td>
                  <td>
                    <span class="badge rounded-pill fw-normal px-3 py-2"
                      [ngClass]="getRoleBadgeClass(member.Role?.name)">
                      {{ getRoleLabel(member.Role?.name) }}
                    </span>
                  </td>
                  <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-outline-danger border-0" (click)="removeMember(member.id)" 
                      [disabled]="member.id === authService.currentUser()?.id">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="teamService.members().length === 0">
                  <td colspan="4" class="text-center py-5 text-muted">
                    <i class="bi bi-people fs-1 d-block mb-3 opacity-50"></i>
                    No hay miembros en tu equipo aún.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }
    .x-small { font-size: 0.75rem; letter-spacing: 0.5px; }
    .fade-in { animation: fadeIn 0.3s ease-in; }
    .slide-in { animation: slideIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class TeamComponent implements OnInit {
  teamService = inject(TeamService);
  authService = inject(AuthService);
  showForm = false;

  newMember: any = {
    firstName: '',
    lastName: '',
    email: '',
    roleName: '',
    gender: 'Female',
    licenseNumber: ''
  };

  ngOnInit() {
    this.loadTeam();
  }

  loadTeam() {
    this.teamService.getTeam().subscribe({
      error: () => Swal.fire('Error', 'No se pudo cargar el equipo', 'error')
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    // Generate a temporary password if backend expects it, or backend generates it.
    // My backend code: password: password || 'medicus123'
    // So distinct input is not needed per user request "invitation".

    Swal.fire({
      title: 'Añadiendo miembro...',
      didOpen: () => Swal.showLoading()
    });

    this.teamService.addMember(this.newMember).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Miembro añadido correctamente', 'success');
        this.showForm = false;
        this.newMember = { firstName: '', lastName: '', email: '', roleName: '', gender: 'Female', licenseNumber: '' };
        this.loadTeam();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Error al añadir miembro', 'error');
      }
    });
  }

  removeMember(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.teamService.removeMember(id).subscribe({
          next: () => Swal.fire('Eliminado', 'El miembro ha sido eliminado.', 'success'),
          error: () => Swal.fire('Error', 'No se pudo eliminar el miembro.', 'error')
        });
      }
    });
  }

  getRoleBadgeClass(roleName: string | undefined): string {
    switch (roleName) {
      case 'DOCTOR': return 'bg-info-subtle text-info-emphasis';
      case 'NURSE': return 'bg-success-subtle text-success-emphasis';
      case 'ADMINISTRATIVE': return 'bg-warning-subtle text-warning-emphasis';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }

  getRoleLabel(roleName: string | undefined): string {
    switch (roleName) {
      case 'DOCTOR': return 'Doctor';
      case 'NURSE': return 'Enfermería';
      case 'ADMINISTRATIVE': return 'Administrativo';
      default: return roleName || 'Desconocido';
    }
  }
}
