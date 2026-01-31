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
