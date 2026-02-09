import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-video-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h3 class="fw-bold mb-1">{{ langService.translate('video_history.title') }}</h3>
          <p class="text-muted">{{ langService.translate('video_history.subtitle') }}</p>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12" *ngIf="loading()">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>

        <div class="col-12" *ngIf="!loading() && videoAppointments().length === 0">
          <div class="card-premium p-5 text-center border-0 shadow-sm">
            <i class="bi bi-camera-video text-muted fs-1 mb-3 d-block"></i>
            <h5 class="text-muted">No se registran videoconsultas</h5>
            <p class="text-muted small">Las citas marcadas como modalidad "Video" aparecerán aquí.</p>
            <button class="btn btn-primary-premium mt-3" routerLink="/appointments">
              Ir a Agenda de Citas
            </button>
          </div>
        </div>

        <div class="col-md-6 col-lg-4" *ngFor="let apt of videoAppointments()">
          <div class="card-premium h-100 border-0 shadow-sm p-3 position-relative">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="badge px-3 py-2 rounded-pill" [ngClass]="getStatusClass(apt.status)">
                {{ apt.status }}
              </div>
              <div class="text-primary small fw-bold">
                <i class="bi bi-clock me-1"></i> {{ formatTime(apt.time) }}
              </div>
            </div>

            <h6 class="fw-bold mb-1">{{ apt.reason }}</h6>
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="avatar-circle-sm bg-primary bg-opacity-10 text-primary fw-bold">
                {{ apt.Patient?.User?.firstName?.charAt(0) }}
              </div>
              <div class="small">
                <span class="text-muted d-block x-small text-uppercase fw-bold">Paciente</span>
                <span class="fw-medium">{{ apt.Patient?.User?.firstName }} {{ apt.Patient?.User?.lastName }}</span>
              </div>
            </div>

            <div class="border-top pt-3 mt-auto">
              <div class="d-flex justify-content-between align-items-center">
                <div class="small text-muted">
                  <i class="bi bi-calendar3 me-1"></i> {{ apt.date | date:'dd/MM/yyyy' }}
                </div>
                <button 
                  *ngIf="canJoin(apt)"
                  (click)="joinCall(apt)"
                  class="btn btn-sm btn-primary rounded-pill px-3"
                >
                  <i class="bi bi-camera-video-fill me-1"></i> Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle-sm {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.8rem;
    }
  `]
})
export class VideoHistory implements OnInit {
  videoAppointments = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private appointmentService: AppointmentService,
    public langService: LanguageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVideoAppointments();
  }

  loadVideoAppointments() {
    this.loading.set(true);
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        // Filter only video calls
        this.videoAppointments.set(data.filter((apt: any) => apt.type === 'Video'));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading video history:', err);
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmed': return 'bg-success bg-opacity-10 text-success';
      case 'Pending': return 'bg-warning bg-opacity-10 text-warning';
      case 'Cancelled': return 'bg-danger bg-opacity-10 text-danger';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  }

  canJoin(apt: any): boolean {
    return apt.status === 'Confirmed' || apt.status === 'Completed';
  }

  joinCall(apt: any) {
    this.router.navigate(['/video-call', apt.id]);
  }
}
