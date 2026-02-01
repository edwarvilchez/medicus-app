import { Injectable, signal, computed } from '@angular/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = signal<Language>('es');
  
  // Diccionarios de traducción
  private translations: any = {
    es: {
      common: {
        dashboard: 'Panel Lateral',
        search: 'Buscar...',
        actions: 'Acciones',
        status: 'Estado',
        save: 'Guardar',
        cancel: 'Cancelar',
        loading: 'Cargando...',
        printing: 'Imprimiendo...',
        success: '¡Éxito!',
        error: 'Error',
        warning: 'Atención',
        noResults: 'No se encontraron resultados'
      },
      auth: {
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        logout: 'Cerrar Sesión',
        email: 'Email',
        password: 'Contraseña'
      },
      payments: {
        title: 'Control de Pagos',
        subtitle: 'Gestión de facturación y estados de cuenta',
        newPayment: 'Nuevo Pago',
        export: 'Exportar Reporte',
        reference: 'Referencia',
        patient: 'Paciente',
        concept: 'Concepto',
        amount: 'Monto',
        fecha: 'Fecha',
        collect: 'Cobrar',
        receipt: 'Recibo',
        pending: 'Pendiente',
        paid: 'Pagado'
      },
      sidebar: {
        medicalManagement: 'GESTIÓN MÉDICA',
        appointments: 'Citas Médicas',
        patients: 'Pacientes',
        lab: 'Laboratorio',
        medicalStaff: 'PERSONAL MÉDICO',
        doctors: 'Doctores',
        nurses: 'Enfermería',
        administration: 'ADMINISTRACIÓN',
        staff: 'Personal Staff',
        payments: 'Pagos',
        bank: 'Banco',
        instrument: 'Tipo de Pago',
        method: 'Método',
        cash: 'Efectivo',
        transfer: 'Transferencia',
        mobile: 'Pago Móvil',
        debit: 'Débito',
        credit: 'Crédito',
        currency: 'Moneda'
      },
      landing: {
        title: 'Tu Socio en',
        subtitle: 'Salud Digital',
        description: 'Gestiona tu clínica con la plataforma más avanzada. Optimiza citas, historiales clínicos y comunicación con pacientes de forma segura y eficiente.',
        security: 'Seguridad Total',
        securityDesc: 'Protección de datos bajo estándares internacionales.',
        reminders: 'Recordatorios',
        remindersDesc: 'Automatiza avisos por WhatsApp a tus pacientes.',
        loginTitle: 'Iniciar Sesión',
        loginDesc: 'Ingresa tus credenciales para acceder',
        forgotPassword: '¿Olvidaste tu contraseña?',
        enterSystem: 'Ingresar al Sistema',
        noAccount: '¿No tienes cuenta?',
        registerHere: 'Regístrate aquí'
      },
      dashboard: {
        controlPanel: 'Panel de Control',
        welcome: 'Bienvenido',
        report: 'Reporte',
        newAppointment: 'Nueva Cita',
        activity: 'Actividad',
        days7: '7 días',
        days30: '30 días',
        upcoming: 'Próximas Citas',
        noUpcoming: 'No hay citas programadas',
        viewPatients: 'Ver pacientes',
        medicalCitas: 'Mis Próximas Citas Médicas',
        myResults: 'Mis Resultados',
        recentExams: 'Ver exámenes recientes',
        stats: {
          totalPatients: 'Pacientes Totales',
          appointments: 'Citas Hoy',
          income: 'Ingresos Mes',
          pending: 'Pendientes'
        }
      }
    },
    en: {
      common: {
        dashboard: 'Dashboard',
        search: 'Search...',
        actions: 'Actions',
        status: 'Status',
        save: 'Save',
        cancel: 'Cancel',
        loading: 'Loading...',
        printing: 'Printing...',
        success: 'Success!',
        error: 'Error',
        warning: 'Warning',
        noResults: 'No results found'
      },
      auth: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password'
      },
      payments: {
        title: 'Payment Control',
        subtitle: 'Billing and account statement management',
        newPayment: 'New Payment',
        export: 'Export Report',
        reference: 'Reference',
        patient: 'Patient',
        concept: 'Concept',
        amount: 'Amount',
        fecha: 'Date',
        collect: 'Collect',
        receipt: 'Receipt',
        pending: 'Pending',
        paid: 'Paid'
      },
      sidebar: {
        medicalManagement: 'MEDICAL MANAGEMENT',
        appointments: 'Appointments',
        patients: 'Patients',
        lab: 'Laboratory',
        medicalStaff: 'MEDICAL STAFF',
        doctors: 'Doctors',
        nurses: 'Nursing',
        administration: 'ADMINISTRATION',
        staff: 'Staff Members',
        payments: 'Payments',
        bank: 'Bank',
        instrument: 'Payment Type',
        method: 'Method',
        cash: 'Cash',
        transfer: 'Transfer',
        mobile: 'Mobile Payment',
        debit: 'Debit Card',
        credit: 'Credit Card',
        currency: 'Currency'
      },
      landing: {
        title: 'Your Partner in',
        subtitle: 'Digital Health',
        description: 'Manage your clinic with the most advanced platform. Optimize appointments, medical records, and patient communication securely and efficiently.',
        security: 'Total Security',
        securityDesc: 'Data protection under international standards.',
        reminders: 'Reminders',
        remindersDesc: 'Automate WhatsApp alerts for your patients.',
        loginTitle: 'Log In',
        loginDesc: 'Enter your credentials to access',
        forgotPassword: 'Forgot your password?',
        enterSystem: 'Log In',
        noAccount: "Don't have an account?",
        registerHere: 'Register here'
      },
      dashboard: {
        controlPanel: 'Control Panel',
        welcome: 'Welcome',
        report: 'Report',
        newAppointment: 'New Appointment',
        activity: 'Activity',
        days7: '7 days',
        days30: '30 days',
        upcoming: 'Upcoming Appointments',
        noUpcoming: 'No scheduled appointments',
        viewPatients: 'View patients',
        medicalCitas: 'My Upcoming Medical Appointments',
        myResults: 'My Results',
        recentExams: 'See recent exams',
        stats: {
          totalPatients: 'Total Patients',
          appointments: 'Today\'s Appointments',
          income: 'Month Revenue',
          pending: 'Pending'
        }
      }
    }
  };

  constructor() {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) {
      this.currentLang.set(savedLang);
    }
  }

  get lang() {
    return this.currentLang.asReadonly();
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }

  // Método para obtener una traducción
  translate(path: string): string {
    const keys = path.split('.');
    let translation = this.translations[this.currentLang()];
    
    for (const key of keys) {
      if (translation[key]) {
        translation = translation[key];
      } else {
        return path; // Retorna el path si no encuentra traducción
      }
    }
    
    return translation;
  }
}
