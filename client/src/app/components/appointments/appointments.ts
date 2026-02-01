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
  timeSlots: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      reason: ['', Validators.required],
      notes: ['']
    });
    
    this.generateTimeSlots();
  }

  ngOnInit() {
    this.loadAppointments();
    this.loadDropdownData();
  }
  
  generateTimeSlots() {
    const slots: string[] = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 18 && minute > 0) break; // Stop at 18:00
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    this.timeSlots = slots;
  }
  
  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

  getGoogleCalendarLink(formData: any, patientName: string, doctorName: string) {
    // Logic from Rootes project adapted
    // formData.date is "YYYY-MM-DDTHH:mm"
    const [datePart, timePart] = formData.date.split('T');
    const startTime = datePart.replace(/-/g, '') + 'T' + timePart.replace(/:/g, '') + '00Z';
    
    // Add 30 mins for end time
    const dateObj = new Date(formData.date);
    const endDateObj = new Date(dateObj.getTime() + 30 * 60000);
    const endDateISO = endDateObj.toISOString().split('.')[0]; // Remove ms
    const endTime = endDateISO.replace(/-/g, '').replace(/:/g, '') + 'Z';

    const details = `Cita con Dr. ${doctorName}\nPaciente: ${patientName}\nMotivo: ${formData.reason}`;
    const location = 'Clínica Medicus';

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Cita Médica: ' + formData.reason)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${startTime}/${endTime}&add=edwarvilchez1977@gmail.com`;
  }

  getWhatsAppLink(formData: any, patientName: string, doctorName: string, phone: string) {
    const message = encodeURIComponent(
      `*Confirmación de Cita - Clínica Medicus*\n\n` +
      `Hola ${patientName}, tu cita ha sido agendada:\n\n` +
      `*Doctor:* ${doctorName}\n` +
      `*Fecha:* ${formData.date.replace('T', ' ')}\n` +
      `*Motivo:* ${formData.reason}\n\n` +
      `Te esperamos. Si necesitas cancelar o reagendar, contáctanos al 0424-1599101.`
    );
    // Send to patient's WhatsApp number
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${message}`;
  }

  submitAppointment() {
    if (this.appointmentForm.valid) {
      this.whatsappSending.set(true);
      const formVal = this.appointmentForm.value;

      // Combine date and time into ISO format
      const combinedDateTime = `${formVal.appointmentDate}T${formVal.appointmentTime}:00`;
      const appointmentData = {
        patientId: formVal.patientId,
        doctorId: formVal.doctorId,
        date: combinedDateTime,
        reason: formVal.reason,
        notes: formVal.notes
      };

      // Lookup names for the links
      const patient = this.patients().find(p => p.id === formVal.patientId);
      const doctor = this.doctors().find(d => d.id === formVal.doctorId);
      
      const patientName = patient ? `${patient.User.firstName} ${patient.User.lastName}` : 'Paciente';
      const patientPhone = patient ? patient.phone : '';
      const doctorName = doctor ? `${doctor.User.firstName} ${doctor.User.lastName}` : 'Doctor';

      // Create formData object for helper methods
      const formDataForLinks = {
        ...appointmentData,
        date: combinedDateTime
      };

      const calendarLink = this.getGoogleCalendarLink(formDataForLinks, patientName, doctorName);
      const waLink = this.getWhatsAppLink(formDataForLinks, patientName, doctorName, patientPhone);

      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (res) => {
          this.loadAppointments();
          this.closeModal();
          this.whatsappSending.set(false);
          
          Swal.fire({
            title: '¡Cita Agendada!',
            html: `
              <p>La cita ha sido registrada exitosamente.</p>
              <p class="text-muted small">Se ha enviado una notificación automática, pero puedes usar estos accesos directos:</p>
              <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <a href="${waLink}" target="_blank" style="background-color: #25D366; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: flex; align-items: center; gap: 5px;">
                  <i class="bi bi-whatsapp"></i> WhatsApp
                </a>
                <a href="${calendarLink}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: flex; align-items: center; gap: 5px;">
                  <i class="bi bi-calendar-event"></i> Google Calendar
                </a>
              </div>
            `,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true
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
