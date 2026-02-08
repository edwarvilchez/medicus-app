import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoConsultationService } from '../../services/video-consultation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  consultationId = signal<number | null>(null);
  roomId = signal<string>('');
  isDoctor = signal(false);
  participantName = signal<string>('');
  localParticipantName = signal<string>('Tú');
  callDuration = signal<string>('00:00');
  
  private startTime: Date | null = null;
  private durationInterval: any = null;
  private streamObserverInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public videoService: VideoConsultationService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.consultationId.set(+id);

    // Obtener datos de la consulta
    this.videoService.getVideoConsultation(+id).subscribe({
      next: async (consultation) => {
        this.roomId.set(consultation.roomId);
        
        // Determinar si es doctor o paciente
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.isDoctor.set(user.id === consultation.doctorId);
        
        // Establecer nombre local
        this.localParticipantName.set(`${user.firstName} ${user.lastName} (Tú)`);

        // Establecer nombre del otro participante
        if (this.isDoctor()) {
          this.participantName.set(`${(consultation as any).patient?.firstName} ${(consultation as any).patient?.lastName}`);
        } else {
          this.participantName.set(`Dr. ${(consultation as any).doctor?.firstName} ${(consultation as any).doctor?.lastName}`);
        }

        // Inicializar media
        try {
          await this.videoService.initializeMedia();
          
          // Conectar al room
          this.videoService.connectToRoom(
            consultation.roomId,
            user.id,
            this.isDoctor() ? 'doctor' : 'patient'
          );

          // Iniciar consulta si es doctor
          if (this.isDoctor()) {
            this.videoService.startVideoConsultation(+id).subscribe({
              next: () => {
                this.startTime = new Date();
                this.startDurationTimer();
              }
            });
          } else {
            this.startTime = new Date();
            this.startDurationTimer();
          }
        } catch (error: any) {
          console.error('Error inicializando videollamada:', error);
          await Swal.fire({
            icon: 'error',
            title: 'Error de Acceso',
            text: error.message || 'No se pudo acceder a la cámara o micrófono',
            confirmButtonColor: '#4a90e2'
          });
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error cargando consulta:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la videoconsulta',
          confirmButtonColor: '#4a90e2'
        });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngAfterViewInit() {
    // Esperar un momento para que los ViewChild estén disponibles
    setTimeout(() => {
      // Observar cambios en el stream local
      const localStream = this.videoService.localStream();
      if (localStream && this.localVideo) {
        this.localVideo.nativeElement.srcObject = localStream;
        this.localVideo.nativeElement.muted = true;
      }

      // Observar cambios en el stream remoto
      const remoteStream = this.videoService.remoteStream();
      if (remoteStream && this.remoteVideo) {
        this.remoteVideo.nativeElement.srcObject = remoteStream;
      }

      // Configurar observadores para cambios futuros
      this.setupStreamObservers();
    }, 100);
  }

  private setupStreamObservers() {
    // Verificar periódicamente si hay cambios en los streams
    const checkInterval = setInterval(() => {
      const localStream = this.videoService.localStream();
      const remoteStream = this.videoService.remoteStream();

      if (localStream && this.localVideo && this.localVideo.nativeElement.srcObject !== localStream) {
        this.localVideo.nativeElement.srcObject = localStream;
        this.localVideo.nativeElement.muted = true;
      }

      if (remoteStream && this.remoteVideo && this.remoteVideo.nativeElement.srcObject !== remoteStream) {
        this.remoteVideo.nativeElement.srcObject = remoteStream;
      }
    }, 500);

    // Guardar referencia al intervalo
    this.streamObserverInterval = checkInterval;
  }

  private startDurationTimer() {
    this.durationInterval = setInterval(() => {
      if (this.startTime) {
        const now = new Date();
        const diff = now.getTime() - this.startTime.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        this.callDuration.set(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);
  }

  toggleMute() {
    this.videoService.toggleMute();
  }

  toggleVideo() {
    this.videoService.toggleVideo();
  }

  async endCall() {
    const result = await Swal.fire({
      title: '¿Finalizar Videoconsulta?',
      text: this.isDoctor() ? 'Puedes agregar notas sobre la consulta' : '¿Estás seguro de salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Cancelar',
      input: this.isDoctor() ? 'textarea' : undefined,
      inputPlaceholder: this.isDoctor() ? 'Notas de la consulta (opcional)' : undefined,
      inputAttributes: {
        'aria-label': 'Notas de la consulta'
      }
    });

    if (result.isConfirmed) {
      const notes = result.value || '';
      
      if (this.isDoctor() && this.consultationId()) {
        this.videoService.endVideoConsultation(this.consultationId()!, notes).subscribe({
          next: () => {
            this.cleanup();
            Swal.fire({
              icon: 'success',
              title: 'Videoconsulta Finalizada',
              text: `Duración: ${this.callDuration()}`,
              timer: 2000,
              showConfirmButton: false
            });
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Error finalizando consulta:', err);
            this.cleanup();
            this.router.navigate(['/dashboard']);
          }
        });
      } else {
        this.cleanup();
        this.router.navigate(['/dashboard']);
      }
    }
  }

  private cleanup() {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
    }
    if (this.streamObserverInterval) {
      clearInterval(this.streamObserverInterval);
    }
    this.videoService.disconnect();
  }

  ngOnDestroy() {
    this.cleanup();
  }
}
