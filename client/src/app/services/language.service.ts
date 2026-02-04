import { Injectable, signal, computed } from '@angular/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = signal<Language>('es');
  
  public locale = computed(() => this.currentLang() === 'es' ? 'es-ES' : 'en-US');
  
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
        noResults: 'No se encontraron resultados',
        doctor: 'Doctor'
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
      medical_history: {
        title: 'Historial del Paciente',
        subtitle: 'Registro detallado de consultas, tratamientos y evolución',
        selectPatient: 'Selecciona un Paciente para ver su Historial',
        id: 'ID',
        phone: 'Teléfono',
        gender: 'Género',
        newRecord: 'Nuevo Informe Médico',
        changePatient: 'Cambiar Paciente',
        tabs: {
          consultations: 'Consultas',
          labs: 'Laboratorio',
          treatments: 'Tratamientos'
        },
        diagnosis: 'Diagnóstico',
        physicalExam: 'Examen Físico',
        treatment: 'Tratamiento',
        indications: 'Indicaciones',
        medicalLeave: 'Suspensión Médica (Reposo)',
        leaveDays: 'Días de Reposo',
        startDate: 'Fecha de Inicio',
        endDate: 'Fecha de Fin',
        save: 'Guardar Informe en Historial',
        noRecords: 'No hay registros médicos para este paciente.',
        diagnosisPlaceholder: 'Escribe el diagnóstico principal...',
        examPlaceholder: 'Detalles del examen físico...',
        treatmentPlaceholder: 'Medicamentos y dosis...',
        indicationsPlaceholder: 'Recomendaciones generales...'
      },
      sidebar: {
        medicalManagement: 'GESTIÓN MÉDICA',
        appointments: 'Citas Médicas',
        history: 'Historial Médico',
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
        registerHere: 'Regístrate aquí',
        publicBooking: 'Agendar Cita (Sin cuenta)'
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
        confirmed: 'Confirmada',
        newAptDesc: 'Programa tu próxima visita médica fácilmente.',
        bookNow: 'Agendar Ahora',
        stats: {
          totalPatients: 'Pacientes Totales',
          appointments: 'Citas Hoy',
          income: 'Ingresos Mes',
          pending: 'Pendientes'
        },
        reminderSent: 'Recordatorio enviado',
        active: 'Activo'
      },
      specialties: {
        all: 'Todas',
        cardiology: 'Cardiología',
        pediatrics: 'Pediatría',
        gynecology: 'Ginecología'
      },
      nurses: {
        title: 'Personal de Enfermería',
        subtitle: 'Gestión de perfiles, turnos y especialidades del equipo de enfermería',
        new: 'Nueva Enfermera/o',
        searchPlaceholder: 'Buscar por nombre o especialización...',
        allShifts: 'Todos los turnos',
        filters: 'Filtros',
        table: {
          nurse: 'Enfermero/a',
          specialty: 'Especialización',
          shift: 'Turno',
          license: 'Licencia'
        },
        noResults: 'No se encontraron enfermeros'
      },
      lab: {
        title: 'Laboratorio',
        subtitle: 'Gestión de resultados y exámenes médicos',
        new: 'Nuevo Resultado',
        searchPlaceholder: 'Buscar por paciente...',
        examType: 'Tipo de Examen',
        table: {
          patient: 'PACIENTE',
          exam: 'TIPO EXAMEN',
          date: 'FECHA'
        }
      },
      patients_list: {
        title: 'Pacientes',
        subtitle: 'Gestiona el padrón de pacientes de la clínica',
        new: 'Nuevo Paciente',
        searchPlaceholder: 'Buscar por nombre, apellido o ID...',
        allGenders: 'Todos los géneros',
        table: {
          patient: 'Paciente',
          document: 'ID / Documento',
          gender: 'Género',
          phone: 'Teléfono'
        }
      },
      appointments_list: {
        title: 'Agendamiento de Citas',
        subtitle: 'Gestión de turnos médicos y disponibilidad',
        new: 'Agendar Nueva Cita',
        filterSpecialty: 'Filtrar por Especialidad',
        all: 'Todas',
        whatsappService: 'Recordatorios WhatsApp',
        serviceActive: 'Servicio Activo',
        whatsappDesc: 'Se enviarán recordatorios automáticamente al agendar.',
        scheduled: 'Citas Agendadas',
        tabs: {
          day: 'Día',
          week: 'Semana',
          month: 'Mes'
        },
        doctorSpecialty: 'Doctor / Especialidad',
        time: 'Hora',
        reason: 'Motivo de Consulta',
        reasonPlaceholder: 'Ej: Control Mensual',
        notes: 'Observaciones (Opcional)'
      },
      doctors: {
        title: 'Equipo Médico',
        subtitle: 'Directorio de doctores y especialistas',
        new: 'Nuevo Doctor',
        searchPlaceholder: 'Buscar por nombre o especialidad...',
        allSpecialties: 'Todas las especialidades',
        noResults: 'No se encontraron doctores con esos criterios.',
        viewProfile: 'Ver Perfil',
        schedule: 'Agendar',
        available: 'Disponible'
      },

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
        noResults: 'No results found',
        doctor: 'Doctor'
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
      medical_history: {
        title: 'Patient History',
        subtitle: 'Detailed record of consultations, treatments, and evolution',
        selectPatient: 'Select a Patient to view their History',
        id: 'ID',
        phone: 'Phone',
        gender: 'Gender',
        newRecord: 'New Medical Record',
        changePatient: 'Change Patient',
        tabs: {
          consultations: 'Consultations',
          labs: 'Laboratory',
          treatments: 'Treatments'
        },
        diagnosis: 'Diagnosis',
        physicalExam: 'Physical Exam',
        treatment: 'Treatment',
        indications: 'Indications',
        medicalLeave: 'Medical Leave',
        leaveDays: 'Leave Days',
        startDate: 'Start Date',
        endDate: 'End Date',
        save: 'Save Record to History',
        noRecords: 'No medical records for this patient.',
        diagnosisPlaceholder: 'Enter main diagnosis...',
        examPlaceholder: 'Physical exam details...',
        treatmentPlaceholder: 'Medications and dosage...',
        indicationsPlaceholder: 'General recommendations...'
      },
      sidebar: {
        medicalManagement: 'MEDICAL MANAGEMENT',
        appointments: 'Appointments',
        history: 'Patient History',
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
        registerHere: 'Register here',
        publicBooking: 'Schedule Appointment (No account)'
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
        confirmed: 'Confirmed',
        newAptDesc: 'Schedule your next medical visit easily.',
        bookNow: 'Book Now',
        stats: {
          totalPatients: 'Total Patients',
          appointments: 'Today\'s Appointments',
          income: 'Month Revenue',
          pending: 'Pending'
        },
        reminderSent: 'Reminder sent',
        active: 'Active'
      },
      specialties: {
        all: 'All',
        cardiology: 'Cardiology',
        pediatrics: 'Pediatrics',
        gynecology: 'Gynecology'
      },
      nurses: {
        title: 'Nursing Staff',
        subtitle: 'Profile, shift, and specialty management of the nursing team',
        new: 'New Nurse',
        searchPlaceholder: 'Search by name or specialty...',
        allShifts: 'All shifts',
        filters: 'Filters',
        table: {
          nurse: 'Nurse',
          specialty: 'Specialty',
          shift: 'Shift',
          license: 'License'
        },
        noResults: 'No nurses found'
      },
      lab: {
        title: 'Laboratory',
        subtitle: 'Medical results and exams management',
        new: 'New Result',
        searchPlaceholder: 'Search by patient...',
        examType: 'Exam Type',
        table: {
          patient: 'PATIENT',
          exam: 'EXAM TYPE',
          date: 'DATE'
        }
      },
      patients_list: {
        title: 'Patients',
        subtitle: 'Manage the clinic patient database',
        new: 'New Patient',
        searchPlaceholder: 'Search by name, last name or ID...',
        allGenders: 'All genders',
        table: {
          patient: 'Patient',
          document: 'ID / Documento',
          gender: 'Gender',
          phone: 'Phone'
        }
      },
      appointments_list: {
        title: 'Appointment Scheduling',
        subtitle: 'Medical shifts and availability management',
        new: 'Schedule New Appointment',
        filterSpecialty: 'Filter by Specialty',
        all: 'All',
        whatsappService: 'WhatsApp Reminders',
        serviceActive: 'Service Active',
        whatsappDesc: 'Reminders will be sent automatically when scheduling.',
        scheduled: 'Scheduled Appointments',
        tabs: {
          day: 'Day',
          week: 'Week',
          month: 'Month'
        },
        doctorSpecialty: 'Doctor / Specialty',
        time: 'Time',
        reason: 'Reason for Visit',
        reasonPlaceholder: 'e.g. Monthly Checkup',
        notes: 'Notes (Optional)'
      },
      doctors: {
        title: 'Medical Team',
        subtitle: 'Directory of doctors and specialists',
        new: 'New Doctor',
        searchPlaceholder: 'Search by name or specialty...',
        allSpecialties: 'All specialties',
        noResults: 'No doctors found with those criteria.',
        viewProfile: 'View Profile',
        schedule: 'Schedule',
        available: 'Available'
      },

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
