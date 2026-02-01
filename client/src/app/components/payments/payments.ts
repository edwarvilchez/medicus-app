import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments implements OnInit {
  payments = signal<any[]>([]);
  searchTerm = signal('');

  filteredPayments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.payments().filter(p => 
      p.reference?.toLowerCase().includes(term) || 
      p.Patient?.User?.firstName.toLowerCase().includes(term) ||
      p.Patient?.User?.lastName.toLowerCase().includes(term) ||
      p.concept.toLowerCase().includes(term)
    );
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPayments();
  }

  getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
  }

  loadPayments() {
    this.http.get<any[]>('http://localhost:5000/api/payments', { headers: this.getHeaders() })
      .subscribe(data => this.payments.set(data));
  }

  createNewPayment() {
    // Primero cargamos los pacientes para el selector
    this.http.get<any[]>('http://localhost:5000/api/patients', { headers: this.getHeaders() })
      .subscribe(patients => {
        Swal.fire({
          title: 'Emitir Nuevo Pago',
          html: `
            <div class="text-start">
              <div class="mb-3">
                <label class="form-label small fw-bold mb-1">Paciente</label>
                <select id="patientId" class="form-select form-select-sm">
                  ${patients.map(p => `<option value="${p.id}">${p.User.firstName} ${p.User.lastName} (${p.documentId})</option>`).join('')}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold mb-1">Concepto / Servicio</label>
                <input id="concept" class="form-control form-control-sm" placeholder="Ej: Consulta General, Examen...">
              </div>
              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-1">Monto ($)</label>
                  <input id="amount" type="number" class="form-control form-control-sm" placeholder="0.00">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-1">Referencia</label>
                  <input id="reference" class="form-control form-control-sm" placeholder="REF-XXXXX">
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Generar Recibo',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#0ea5e9',
          cancelButtonColor: '#64748b',
          preConfirm: () => {
            const patientId = (document.getElementById('patientId') as HTMLSelectElement).value;
            const concept = (document.getElementById('concept') as HTMLInputElement).value;
            const amount = (document.getElementById('amount') as HTMLInputElement).value;
            const reference = (document.getElementById('reference') as HTMLInputElement).value;

            if (!patientId || !concept || !amount) {
              Swal.showValidationMessage('Paciente, concepto y monto son obligatorios');
              return false;
            }

            return { patientId, concept, amount, reference, status: 'Pending' };
          }
        }).then(result => {
          if (result.isConfirmed) {
            this.http.post('http://localhost:5000/api/payments', result.value, { headers: this.getHeaders() })
              .subscribe({
                next: () => {
                  this.loadPayments();
                  Swal.fire('¡Generado!', 'El pago ha sido registrado como pendiente.', 'success');
                },
                error: (err) => {
                  Swal.fire('Error', err.error?.message || 'No se pudo generar el pago', 'error');
                }
              });
          }
        });
      });
  }

  collectPayment(id: string) {
    Swal.fire({
      title: '¿Confirmar cobro?',
      text: "El estado del pago cambiará a 'Pagado'.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      confirmButtonText: 'Sí, cobrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`http://localhost:5000/api/payments/collect/${id}`, {}, { headers: this.getHeaders() })
          .subscribe(() => {
            this.loadPayments();
            Swal.fire('¡Éxito!', 'Pago cobrado correctamente.', 'success');
          });
      }
    });
  }
}
