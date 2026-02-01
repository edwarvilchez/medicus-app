import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
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

  updateSearch(event: any) {
    this.searchTerm.set(event.target.value);
  }

  filteredPayments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.payments().filter(p => 
      p.reference?.toLowerCase().includes(term) || 
      p.Patient?.User?.firstName.toLowerCase().includes(term) ||
      p.Patient?.User?.lastName.toLowerCase().includes(term) ||
      p.concept.toLowerCase().includes(term)
    );
  });

  constructor(
    private http: HttpClient,
    public langService: LanguageService
  ) {}

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

  viewReceipt(payment: any) {
    Swal.fire({
      title: this.langService.translate('payments.receipt'),
      html: `
        <div class="text-start border p-3 rounded bg-light">
          <div class="d-flex justify-content-between mb-2">
            <strong>${this.langService.translate('payments.reference')}:</strong> <span>#${payment.reference || 'N/A'}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <strong>${this.langService.translate('payments.patient')}:</strong> <span>${payment.Patient?.User?.firstName} ${payment.Patient?.User?.lastName}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <strong>${this.langService.translate('payments.concept')}:</strong> <span>${payment.concept}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <strong>${this.langService.translate('payments.amount')}:</strong> <span class="fw-bold text-success">$${payment.amount.toFixed(2)}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <strong>${this.langService.translate('payments.fecha')}:</strong> <span>${new Date(payment.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="d-flex justify-content-between">
            <strong>${this.langService.translate('common.status')}:</strong> 
            <span class="badge ${payment.status === 'Paid' ? 'bg-success' : 'bg-warning'} text-white">
              ${payment.status === 'Paid' ? this.langService.translate('payments.paid') : this.langService.translate('payments.pending')}
            </span>
          </div>
        </div>
      `,
      confirmButtonText: this.langService.translate('common.cancel'),
      confirmButtonColor: '#0ea5e9',
      showCancelButton: true,
      cancelButtonText: `<i class="bi bi-printer me-1"></i> ${this.langService.translate('common.printing')}`,
      cancelButtonColor: '#64748b'
    }).then(result => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        window.print();
      }
    });
  }

  exportReport() {
    if (this.filteredPayments().length === 0) {
      Swal.fire('Atención', 'No hay datos para exportar', 'warning');
      return;
    }

    const headers = ['Referencia', 'Paciente', 'Concepto', 'Monto', 'Fecha', 'Estado'];
    const rows = this.filteredPayments().map(p => [
      p.reference || 'N/A',
      `${p.Patient?.User?.firstName} ${p.Patient?.User?.lastName}`,
      p.concept,
      p.amount,
      new Date(p.createdAt).toLocaleDateString(),
      p.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Pagos_Medicus_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    Swal.fire('¡Éxito!', 'Reporte exportado correctamente.', 'success');
  }
}
