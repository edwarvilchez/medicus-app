import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { CurrencyService } from '../../services/currency.service';
import { AuthService } from '../../services/auth.service';
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
    public langService: LanguageService,
    public currencyService: CurrencyService,
    public authService: AuthService
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
    if (this.authService.hasRole(['PATIENT'])) {
      this.createPatientPayment();
    } else {
      this.createAdminPayment();
    }
  }

  createPatientPayment() {
    this.http.get<any[]>('http://localhost:5000/api/appointments', { headers: this.getHeaders() })
      .subscribe(appointments => {
        // Filtrar citas pendientes o confirmadas que no estén canceladas/completadas
        const validAppointments = appointments.filter(a => a.status !== 'Cancelled' && a.status !== 'Completed');
        
        let appointmentOptions = '<option value="">Seleccione una cita...</option>';
        if (validAppointments.length > 0) {
            appointmentOptions += validAppointments.map(a => 
                `<option value="${a.id}">${new Date(a.date).toLocaleDateString()} - Dr. ${a.Doctor?.User?.lastName || 'Medico'} (${a.reason})</option>`
            ).join('');
        } else {
            appointmentOptions = '<option value="" disabled>No hay citas pendientes</option>';
        }

        Swal.fire({
          title: 'Registrar Pago de Cita',
          html: `
            <div class="text-start">
              <div class="mb-3">
                <label class="form-label small fw-bold mb-1">Cita a Pagar</label>
                <select id="apptId" class="form-select form-select-sm">
                  ${appointmentOptions}
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold mb-1">Método de Pago</label>
                <select id="method" class="form-select form-select-sm" onchange="const d=document.getElementById('details'); if(this.value==='Efectivo'){d.classList.add('d-none');} else {d.classList.remove('d-none');}">
                    <option value="">Seleccione...</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Pago Móvil">Pago Móvil</option>
                    <option value="Efectivo">Efectivo (Pagar en Consultorio)</option>
                    <option value="Zelle">Zelle</option>
                </select>
              </div>

              <div id="details" class="d-none">
                <div class="mb-3">
                    <label class="form-label small fw-bold mb-1">Banco / Plataforma</label>
                    <input id="bank" class="form-control form-control-sm" placeholder="Ej: Banesco, Mercantil, Zelle...">
                </div>
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <label class="form-label small fw-bold mb-1">Referencia</label>
                        <input id="ref" class="form-control form-control-sm" placeholder="Últimos 4-6 dígitos">
                    </div>
                    <div class="col-6">
                        <label class="form-label small fw-bold mb-1">Monto Pagado</label>
                        <input id="amount" type="number" class="form-control form-control-sm" placeholder="0.00">
                    </div>
                </div>
                 <div class="mb-3">
                    <label class="form-label small fw-bold mb-1">Fecha de Pago</label>
                    <input id="date" type="date" class="form-control form-control-sm" value="${new Date().toISOString().split('T')[0]}">
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Registrar Pago',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const appointmentId = (document.getElementById('apptId') as HTMLSelectElement).value;
            const method = (document.getElementById('method') as HTMLSelectElement).value;
            const bank = (document.getElementById('bank') as HTMLInputElement).value;
            const reference = (document.getElementById('ref') as HTMLInputElement).value;
            const amount = (document.getElementById('amount') as HTMLInputElement).value;
            const date = (document.getElementById('date') as HTMLInputElement).value;

            if (!appointmentId) {
                Swal.showValidationMessage('Debe seleccionar una cita');
                return false;
            }
            if (!method) {
                Swal.showValidationMessage('Debe seleccionar un método de pago');
                return false;
            }

            if (method === 'Efectivo') {
                return {
                    appointmentId,
                    instrument: 'Efectivo',
                    concept: 'Pago en Consultorio (Efectivo)',
                    amount: 0, // O monto estimado?
                    status: 'Pending',
                    method: 'Cash'
                };
            }

            if (!bank || !reference || !amount) {
                Swal.showValidationMessage('Complete todos los datos del pago');
                return false;
            }

            return {
                appointmentId,
                instrument: method, // Transferencia, Pago Movil...
                bank,
                reference,
                amount: parseFloat(amount),
                concept: `Pago Cita`, // Backend podría mejorar esto
                status: 'Pending',
                createdAt: date ? new Date(date) : new Date()
            };
          }
        }).then((result) => {
            if (result.isConfirmed) {
                const data = result.value;
                if (data.instrument === 'Efectivo') {
                    Swal.fire({
                        title: 'Pago en Efectivo',
                        text: 'Recuerde realizar su pago al llegar al consultorio para ser atendido.',
                        icon: 'info',
                        confirmButtonText: 'Entendido'
                    }).then(() => {
                        this.submitPayment(data);
                    });
                } else {
                    this.submitPayment(data);
                }
            }
        });
      });
  }

  submitPayment(data: any) {
    this.http.post('http://localhost:5000/api/payments', data, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.loadPayments();
          Swal.fire('Registrado', 'Su pago ha sido registrado y está en proceso de verificación.', 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'Error registrando pago', 'error');
        }
      });
  }

  createAdminPayment() {
    this.http.get<any[]>('http://localhost:5000/api/patients', { headers: this.getHeaders() })
      .subscribe(patients => {
        const patientOptions = patients.map(p => 
          `<option value="${p.id}">${p.User.firstName} ${p.User.lastName} (${p.documentId || 'N/A'})</option>`
        ).join('');

        Swal.fire({
          title: this.langService.translate('payments.newPayment'),
          html: `
            <div class="text-start">
              <div class="mb-3">
                <label class="form-label small fw-bold mb-1">${this.langService.translate('payments.patient')}</label>
                <select id="patientId" class="form-select form-select-sm">
                  ${patientOptions}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold mb-1">${this.langService.translate('payments.concept')}</label>
                <input id="concept" class="form-control form-control-sm" placeholder="${this.langService.translate('common.search')}">
              </div>
              
              <div class="row g-2 mb-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-1">${this.langService.translate('sidebar.instrument')}</label>
                  <select id="instrument" class="form-select form-select-sm" onchange="const b = document.getElementById('bankGrp'); const r = document.getElementById('refGrp'); if(this.value === 'Efectivo'){ b.classList.add('d-none'); r.classList.add('d-none'); } else { b.classList.remove('d-none'); r.classList.remove('d-none'); }">
                    <option value="Efectivo">${this.langService.translate('sidebar.cash')}</option>
                    <option value="Transferencia">${this.langService.translate('sidebar.transfer')}</option>
                    <option value="Pago Móvil">${this.langService.translate('sidebar.mobile')}</option>
                    <option value="Débito">${this.langService.translate('sidebar.debit')}</option>
                    <option value="Crédito">${this.langService.translate('sidebar.credit')}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-1">${this.langService.translate('sidebar.currency')}</label>
                  <select id="payCurrency" class="form-select form-select-sm">
                    <option value="USD">USD ($)</option>
                    <option value="VES">VES (Bs.)</option>
                  </select>
                </div>
              </div>

              <div class="mb-3 d-none" id="bankGrp">
                <label class="form-label small fw-bold mb-1">${this.langService.translate('sidebar.bank')}</label>
                <input id="bank" class="form-control form-control-sm" placeholder="Ej: Banesco, Mercantil...">
              </div>

              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-1">${this.langService.translate('payments.amount')}</label>
                  <input id="amount" type="number" class="form-control form-control-sm" placeholder="0.00">
                </div>
                <div class="col-md-6 d-none" id="refGrp">
                  <label class="form-label small fw-bold mb-1">${this.langService.translate('payments.reference')}</label>
                  <input id="reference" class="form-control form-control-sm" placeholder="REF-XXXXX">
                </div>
              </div>

              <div class="mt-3">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="markAsPaid">
                  <label class="form-check-label small" for="markAsPaid">${this.langService.translate('payments.paid')}</label>
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: this.langService.translate('payments.newPayment'),
          cancelButtonText: this.langService.translate('common.cancel'),
          confirmButtonColor: '#0ea5e9',
          cancelButtonColor: '#64748b',
          preConfirm: () => {
            const patientId = (document.getElementById('patientId') as HTMLSelectElement).value;
            const concept = (document.getElementById('concept') as HTMLInputElement).value;
            const amount = (document.getElementById('amount') as HTMLInputElement).value;
            const reference = (document.getElementById('reference') as HTMLInputElement).value;
            const instrument = (document.getElementById('instrument') as HTMLSelectElement).value;
            const bank = (document.getElementById('bank') as HTMLInputElement).value;
            const currency = (document.getElementById('payCurrency') as HTMLSelectElement).value;
            const isPaid = (document.getElementById('markAsPaid') as HTMLInputElement).checked;

            if (!patientId || !concept || !amount) {
              Swal.showValidationMessage(this.langService.translate('common.error'));
              return false;
            }

            let finalAmount = parseFloat(amount);
            if (currency === 'VES') {
                finalAmount = finalAmount / this.currencyService.rate();
            }

            return { 
                patientId, 
                concept, 
                amount: finalAmount, 
                reference, 
                instrument, 
                bank,
                status: isPaid ? 'Paid' : 'Pending' 
            };
          }
        }).then(result => {
          if (result.isConfirmed) {
            this.submitPayment(result.value);
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
            <strong>${this.langService.translate('payments.amount')}:</strong> 
            <div class="text-end">
              <span class="fw-bold text-success d-block">${this.currencyService.formatAmount(payment.amount, 'USD')}</span>
              <span class="small text-muted">${this.currencyService.formatAmount(payment.amount, 'VES')}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <strong>${this.langService.translate('payments.fecha')}:</strong> <span>${new Date(payment.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="d-flex justify-content-between mb-2" *ngIf="payment.instrument">
            <strong>${this.langService.translate('sidebar.instrument')}:</strong> <span>${payment.instrument}</span>
          </div>
          <div class="d-flex justify-content-between mb-2" *ngIf="payment.bank">
            <strong>${this.langService.translate('sidebar.bank')}:</strong> <span>${payment.bank}</span>
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
