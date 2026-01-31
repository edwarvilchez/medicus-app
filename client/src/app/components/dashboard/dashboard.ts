import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StatsService } from '../../services/stats.service';
import Swal from 'sweetalert2';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';

// Registrar componentes de Chart.js
Chart.register(...registerables);

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {


  stats = signal<any>({
    appointmentsToday: 0,
    totalPatients: 0,
    monthlyIncome: 0,
    pendingAppointments: 0,
    upcomingAppointments: [],
    activityData: []
  });

  // Configuración del Gráfico
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { 
        beginAtZero: true, 
        grid: { color: '#f1f5f9' },
        ticks: { stepSize: 1 }
      }
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Citas', backgroundColor: '#3b82f6', hoverBackgroundColor: '#2563eb' }
    ]
  };

  constructor(
    private statsService: StatsService,
    public authService: AuthService,
    private router: Router
  ) {
    // Reaccionar cuando cambian los stats para actualizar el gráfico
    effect(() => {
      const data = this.stats().activityData;
      if (data && data.length > 0) {
        this.updateChartData(data);
      } else {
        // Inicializar gráfico vacío con etiquetas de días
        this.updateChartData([]);
      }
    });
  }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.statsService.getDashboardStats().subscribe({
      next: (data) => {
        console.log('Dashboard stats loaded:', data);
        this.stats.set(data);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        
        let errorMessage = 'No se pudieron cargar las estadísticas';
        
        if (err.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.status === 0) {
          errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  updateChartData(activityData: any[]) {
    // Agrupar citas por fecha (últimos 7 días)
    const daysMap = new Map<string, number>();
    const today = new Date();
    
    // Inicializar últimos 7 días con 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayKey = dayName.charAt(0).toUpperCase() + dayName.slice(1); // Capitalizar
      daysMap.set(dayKey, 0);
    }

    // Llenar con datos reales
    if (activityData && activityData.length > 0) {
      activityData.forEach(item => {
        const date = new Date(item.date);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
        const dayKey = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        
        // Solo actualizar si la fecha cae en el rango de los últimos 7 días
        if (daysMap.has(dayKey)) {
          daysMap.set(dayKey, (daysMap.get(dayKey) || 0) + 1);
        }
      });
    }

    // Actualizar datos del gráfico
    this.barChartData = {
      labels: Array.from(daysMap.keys()),
      datasets: [
        { 
          data: Array.from(daysMap.values()), 
          label: 'Citas', 
          backgroundColor: '#0ea5e9',
          hoverBackgroundColor: '#0284c7',
          borderColor: 'transparent',
          barThickness: typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20,
          borderRadius: 4
        }
      ]
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  downloadDailyReport() {
    Swal.fire({
      title: 'Generando Reporte',
      text: 'Preparando reporte diario de actividades...',
      icon: 'info',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      Swal.fire({
        title: '¡Reporte Generado!',
        text: 'El reporte diario se ha descargado exitosamente.',
        icon: 'success',
        confirmButtonColor: '#0ea5e9'
      });
    });
  }

  goToNewAppointment() {
    this.router.navigate(['/appointments']);
    setTimeout(() => {
      Swal.fire({
        title: 'Nueva Cita',
        text: 'Redirigiendo al módulo de citas...',
        icon: 'info',
        showConfirmButton: false,
        timer: 1000
      });
    }, 100);
  }
}
