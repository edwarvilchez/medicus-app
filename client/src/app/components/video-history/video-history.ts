import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoConsultationService } from '../../services/video-consultation.service';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-video-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4 align-items-center">
        <div class="col">
          <h3 class="fw-bold mb-1">Historial de Videoconsultas</h3>
          <p class="text-muted">Consulta los informes y notas de tus sesiones anteriores.</p>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-primary" (click)="loadHistory()">
            <i class="bi bi-arrow-clockwise"></i> Actualizar
          </button>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12" *ngIf="loading()">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>

        <div class="col-12" *ngIf="!loading() && consultations().length === 0">
          <div class="card p-5 text-center border-0 shadow-sm rounded-4">
            <div class="mb-3">
              <div class="icon-circle bg-light text-muted mx-auto">
                <i class="bi bi-camera-video fs-1"></i>
              </div>
            </div>
            <h5 class="text-muted mb-2">No se encontraron videoconsultas</h5>
            <p class="text-muted small mb-4">
              Aquí aparecerá el historial de tus videollamadas realizadas y sus informes.
            </p>
            <button class="btn btn-primary px-4 rounded-pill" routerLink="/appointments">
              Ir a Mis Citas
            </button>
          </div>
        </div>

        <div class="col-md-6 col-lg-4" *ngFor="let vc of consultations()">
          <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card">
            <div class="card-header bg-white border-0 pt-4 px-4 pb-0">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge rounded-pill" 
                  [ngClass]="{
                    'bg-success': vc.status === 'completed',
                    'bg-primary': vc.status === 'scheduled' || vc.status === 'active',
                    'bg-danger': vc.status === 'cancelled'
                  }">
                  {{ getStatusLabel(vc.status) }}
                </span>
                <small class="text-muted">
                  <i class="bi bi-calendar3 me-1"></i> {{ vc.Appointment?.date | date:'dd MMM yyyy' }}
                </small>
              </div>
            </div>

            <div class="card-body px-4">
              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="avatar-circle bg-primary bg-opacity-10 text-primary fw-bold fs-5">
                  {{ isDoctor ? vc.patient?.firstName?.charAt(0) : vc.doctor?.firstName?.charAt(0) }}
                </div>
                <div>
                  <div class="small text-muted text-uppercase fw-bold" style="font-size: 0.7rem;">
                    {{ isDoctor ? 'Paciente' : 'Doctor' }}
                  </div>
                  <h6 class="mb-0 fw-bold text-dark">
                    {{ isDoctor 
                      ? (vc.patient?.firstName + ' ' + vc.patient?.lastName) 
                      : ('Dr. ' + vc.doctor?.firstName + ' ' + vc.doctor?.lastName) 
                    }}
                  </h6>
                  <small class="text-muted" *ngIf="!isDoctor && vc.doctor?.Doctor?.specialty">
                    {{ vc.doctor.Doctor.specialty }}
                  </small>
                </div>
              </div>

              <div class="info-grid mb-3">
                <div class="d-flex align-items-center gap-2 text-muted small">
                  <i class="bi bi-clock"></i>
                  <span>Duración: {{ vc.duration ? vc.duration + ' min' : '--' }}</span>
                </div>
                <div class="d-flex align-items-center gap-2 text-muted small">
                  <i class="bi bi-camera-video"></i>
                  <span>ID: {{ vc.id }}</span>
                </div>
              </div>

              <div *ngIf="vc.notes" class="notes-preview p-3 bg-light rounded-3 mb-3">
                <div class="d-flex align-items-center gap-2 mb-2 text-primary small fw-bold">
                  <i class="bi bi-journal-text"></i> Notas de la consulta:
                </div>
                <p class="mb-0 text-muted small text-truncate-3">{{ vc.notes }}</p>
              </div>
            </div>

            <div class="card-footer bg-white border-0 px-4 pb-4 pt-0">
              <div class="d-grid gap-2">
                <button *ngIf="vc.status === 'completed'" 
                        class="btn btn-outline-primary btn-sm rounded-pill" 
                        (click)="generateReport(vc)">
                  <i class="bi bi-file-earmark-pdf me-1"></i> Descargar Informe
                </button>
                
                <button *ngIf="vc.status === 'scheduled' || vc.status === 'active'" 
                        class="btn btn-primary btn-sm rounded-pill"
                        [routerLink]="['/video-call', vc.id]">
                  <i class="bi bi-camera-video-fill me-1"></i> Unirse a la llamada
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    .avatar-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .text-truncate-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
  `]
})
export class VideoHistory implements OnInit {
  consultations = signal<any[]>([]);
  loading = signal(true);
  isDoctor = false;

  constructor(
    private videoService: VideoConsultationService,
    private authService: AuthService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    this.checkRole();
    this.loadHistory();
  }

  checkRole() {
    this.isDoctor = this.authService.hasRole(['DOCTOR']);
  }

  loadHistory() {
    this.loading.set(true);
    let request$;

    if (this.isDoctor) {
      request$ = this.videoService.getMyConsultations();
    } else {
      request$ = this.videoService.getMyPatientConsultations();
    }

    request$.subscribe({
      next: (data) => {
        this.consultations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.loading.set(false);
        Swal.fire('Error', 'No se pudo cargar el historial', 'error');
      }
    });
  }

  getStatusLabel(status: string): string {
    const map: any = {
      'scheduled': 'Programada',
      'active': 'En Curso',
      'completed': 'Finalizada',
      'cancelled': 'Cancelada'
    };
    return map[status] || status;
  }

  generateReport(vc: any) {
    const doc = new jsPDF();
    const primaryColor = '#4a90e2';

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Videoconsulta', 20, 25);
    
    doc.setFontSize(10);
    doc.text('Medicus - Plataforma de Telemedicina', 140, 25);

    // Info General
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let y = 60;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles de la Sesión', 20, y);
    doc.line(20, y + 2, 190, y + 2);
    
    y += 15;
    
    // Doctor
    doc.setFont('helvetica', 'bold');
    doc.text('Médico Tratante:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dr/a. ${vc.doctor?.firstName} ${vc.doctor?.lastName}`, 70, y);
    
    y += 10;
    
    // Paciente
    doc.setFont('helvetica', 'bold');
    doc.text('Paciente:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${vc.patient?.firstName} ${vc.patient?.lastName}`, 70, y);

    y += 10;

    // Fecha y Hora
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', 20, y);
    doc.setFont('helvetica', 'normal');
    const date = new Date(vc.Appointment?.date).toLocaleDateString();
    doc.text(date, 70, y);

    y += 10;

    // Duración
    doc.setFont('helvetica', 'bold');
    doc.text('Duración:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${vc.duration || 0} minutos`, 70, y);

    y += 20;

    // Notas Clínicas
    if (vc.notes) {
      doc.setFont('helvetica', 'bold');
      doc.text('Notas Clínicas / Resumen:', 20, y);
      doc.line(20, y + 2, 190, y + 2);
      
      y += 15;
      
      doc.setFont('helvetica', 'normal');
      const notes = doc.splitTextToSize(vc.notes, 170);
      doc.text(notes, 20, y);
    }

    // Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generado el ${new Date().toLocaleString()}`, 20, pageHeight - 10);
    doc.text('Medicus App', 180, pageHeight - 10);

    doc.save(`Medicus_Informe_${vc.id}.pdf`);
  }
}
