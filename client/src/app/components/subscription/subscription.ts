import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';
import { LanguageService } from '../../services/language.service';
import { API_URL, BASE_URL } from '../../api-config';
import Swal from 'sweetalert2';

interface PricingPlan {
  name: string;      // Display Name (e.g., Consultorio)
  type: string;      // Backend Logic Type (PROFESSIONAL, CLINIC, HOSPITAL)
  tagline: string;
  price: number;
  icon: string;      // Bootstrap Icon Class
  color: string;     // color key for css classes
  popular?: boolean;
  features: string[];
  limit: string;
}

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css'
})
export class Subscription implements OnInit {
  billingCycle = signal('Mensual');
  currentPlan = signal<string | null>(null);
  
  cycles = [
    { id: 'Mensual', label: 'Mensual', discount: null },
    { id: 'Trimestral', label: 'Trimestral', discount: null },
    { id: 'Semestral', label: 'Semestral', discount: null },
    { id: 'Anual', label: 'Anual', discount: '-20%' }
  ];

  plans: PricingPlan[] = [
    {
      name: "Consultorio",
      type: "PROFESSIONAL",
      tagline: "Médicos Independientes",
      price: 49,
      icon: "bi-person-badge",
      color: "blue",
      features: [
        "1 Médico",
        "Hasta 1,500 Pacientes",
        "Agenda Médica Inteligente",
        "Historia Clínica Digital",
        "Soporte por Email"
      ],
      limit: "Límite: 1,500 Pacientes"
    },
    {
      name: "Clínica",
      type: "CLINIC",
      tagline: "Pequeñas Clínicas / Centros",
      price: 119,
      icon: "bi-hospital",
      color: "primary",
      popular: true,
      features: [
        "Hasta 10 Médicos",
        "Múltiples Recepcionistas",
        "Facturación y Caja",
        "Reportes Financieros",
        "Soporte Prioritario"
      ],
      limit: "Límite: 10 Médicos"
    },
    {
      name: "Hospital",
      type: "HOSPITAL",
      tagline: "Hospitales y Grandes Centros",
      price: 249,
      icon: "bi-building-fill",
      color: "indigo",
      features: [
        "Médicos Ilimitados",
        "Gestión de Camas/Habitaciones",
        "Módulo de Enfermería",
        "Laboratorio Integrado",
        "Auditoría Avanzada"
      ],
      limit: "Sin Límites"
    },
    {
      name: "Enterprise",
      type: "ENTERPRISE",
      tagline: "Redes de Salud",
      price: 499,
      icon: "bi-award-fill",
      color: "neutral",
      features: [
        "Infraestructura Dedicada",
        "API de Integración",
        "App Móvil Personalizada",
        "SLA Garantizado 99.9%",
        "Gerente de Cuenta"
      ],
      limit: "A Medida"
    }
  ];

  team = [
    { role: 'Sales Manager', name: 'Yanina Muñoz', tel: '+58 416-6078036' },
    { role: 'CFO', name: 'Lic. Omar Pérez', tel: '+58 412-9438088' },
    { role: 'CTO', name: 'Ing. Argimiro Crespo', tel: '+58 424-4275609' },
    { role: 'CEO', name: 'Ing. Edwar Vilchez', tel: null }
  ];

  constructor(
    public authService: AuthService,
    public currencyService: CurrencyService,
    public langService: LanguageService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.accountType) {
      this.currentPlan.set(user.accountType);
    }
  }

  setCycle(cycleId: string) {
    this.billingCycle.set(cycleId);
  }

  getPrice(basePrice: number): number {
    const cycle = this.billingCycle();
    if (cycle === 'Trimestral') return basePrice * 3;
    if (cycle === 'Semestral') return basePrice * 6;
    if (cycle === 'Anual') return Math.round((basePrice * 12 * 0.8));
    return basePrice;
  }

  getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
  }

  payForPlan(plan: PricingPlan) {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/register']);
      return;
    }

    const cycle = this.billingCycle();
    const amount = this.getPrice(plan.price);
    const concept = `Suscripción ${plan.name} (${cycle})`;

    Swal.fire({
      title: 'Realizar Pago de Suscripción',
      html: `
        <div class="text-start">
          <div class="alert alert-info border-0 shadow-sm mb-3">
            <h6 class="fw-bold mb-1"><i class="bi bi-cart-check"></i> Resumen del Pedido</h6>
            <div class="d-flex justify-content-between">
              <span>Plan:</span> <strong>${plan.name}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span>Ciclo:</span> <strong>${cycle}</strong>
            </div>
            <hr class="my-2">
            <div class="d-flex justify-content-between fs-5">
              <span>Total a Pagar:</span> <strong class="text-primary">$${amount} USD</strong>
            </div>
            <div class="small text-muted mt-1">≈ Bs. ${(amount * this.currencyService.rate()).toFixed(2)}</div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold mb-1">Método de Pago</label>
            <select id="method" class="form-select form-select-sm">
                <option value="Transferencia">Transferencia Bancaria (Bs.)</option>
                <option value="Pago Móvil">Pago Móvil (Bs.)</option>
                <option value="Zelle">Zelle (USD)</option>
                <option value="Binance">Binance Pay (USDT)</option>
            </select>
          </div>

          <div id="bankDetails" class="alert alert-secondary p-2 mb-3 small">
            <!-- Dynamic info based on method could go here -->
            <p class="mb-0"><strong>Datos de Pago:</strong></p>
            <p class="mb-0">Banesco: 0134-XXXX-XX-XXXXXXXXXX</p>
            <p class="mb-0">Pago Móvil: 0412-XXXXXXX / J-12345678</p>
            <p class="mb-0">Zelle: pagos@medicus.com</p>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold mb-1">Referencia / comprobante</label>
            <input id="ref" class="form-control form-control-sm" placeholder="Número de confirmación">
          </div>
          
          <div class="mb-3">
             <label class="form-label small fw-bold mb-1">Adjuntar Recibo (Opcional)</label>
             <input id="receiptFile" type="file" class="form-control form-control-sm" accept="image/*,application/pdf">
          </div>
        </div>
      `,
      confirmButtonText: 'Confirmar Pago',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0ea5e9',
      preConfirm: () => {
        const method = (document.getElementById('method') as HTMLSelectElement).value;
        const ref = (document.getElementById('ref') as HTMLInputElement).value;
        const fileInput = document.getElementById('receiptFile') as HTMLInputElement;
        const file = fileInput?.files ? fileInput.files[0] : null;

        if (!ref) {
          Swal.showValidationMessage('Por favor ingrese el número de referencia');
          return false;
        }

        const formData = new FormData();
        // Since we don't have a dedicated endpoint for subscription payments yet, 
        // we might create a generic 'Payment' but mark it related to Org.
        // For now, we will use the existing /api/payments but modify backend to handle 'SUBSCRIPTION' type?
        // Or simply store it as a generic payment with special concept.
        
        // However, the backend 'Payment' model requires 'patientId'. 
        // Subscription payments are not from patients.
        // We need to create a new endpoint or adapting the model.
        // Given constraint "without breaking existing functionality", I will use a WORKAROUND:
        // Create a 'System Patient' or similar? No, that's messy.
        
        // Better: Send to a new route /api/payments/subscription
        
        formData.append('concept', concept);
        formData.append('amount', amount.toString());
        formData.append('currency', 'USD');
        formData.append('reference', ref);
        formData.append('instrument', method);
        formData.append('status', 'Pending');
        formData.append('type', 'SUBSCRIPTION'); 
        formData.append('planType', plan.type); // To upgrade automatically if approved
        formData.append('billingCycle', cycle);
        
        if (file) formData.append('receipt', file);
        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Send to backend
        this.http.post(`${API_URL}/payments/subscription`, result.value, { headers: this.getHeaders() })
          .subscribe({
            next: () => {
              Swal.fire('¡Pago Enviado!', 'Tu pago ha sido registrado y está siendo verificado. Te notificaremos cuando tu plan esté activo.', 'success');
            },
            error: (err) => {
              // Since /api/payments/subscription doesn't exist yet, this will 404.
              console.error(err);
              Swal.fire('Error', 'No se pudo procesar el pago. (Ruta no implementada aún en backend)', 'error');
            }
          });
      }
    });
  }
}
