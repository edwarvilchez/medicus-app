import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  appointments = signal<any[]>([]);
  patients = signal<any[]>([]);
  doctors = signal<any[]>([]);
  
  appointmentForm: FormGroup;
  showModal = signal(false);
  whatsappSending = signal(false);

  constructor(
    private appointmentService: AppointmentService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      reason: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadAppointments();
    this.loadDropdownData();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => this.appointments.set(data),
      error: (err) => console.error('Error loading appointments:', err)
    });
  }

  loadDropdownData() {
    this.http.get<any[]>('http://localhost:5000/api/patients').subscribe(data => this.patients.set(data));
    this.http.get<any[]>('http://localhost:5000/api/doctors').subscribe(data => this.doctors.set(data));
  }

  openNewAppointmentModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.appointmentForm.reset();
  }

  submitAppointment() {
    if (this.appointmentForm.valid) {
      this.whatsappSending.set(true);
      this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
        next: (res) => {
          this.loadAppointments();
          this.closeModal();
          this.whatsappSending.set(false);
          Swal.fire({
            title: '¡Cita Agendada!',
            text: 'La cita ha sido registrada y se ha enviado el recordatorio por WhatsApp.',
            icon: 'success',
            confirmButtonColor: '#0ea5e9'
          });
        },
        error: (err) => {
          console.error('Error creating appointment:', err);
          this.whatsappSending.set(false);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo agendar la cita. Por favor, intenta de nuevo.',
            icon: 'error',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Confirmed': return 'bg-success';
      case 'Pending': return 'bg-warning';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-primary';
    }
  }
}
