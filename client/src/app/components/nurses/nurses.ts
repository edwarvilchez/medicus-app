import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-nurses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nurses.html',
  styleUrl: './nurses.css',
})
export class Nurses implements OnInit {
  nurses = signal<any[]>([]);
  searchTerm = signal('');
  shiftFilter = signal('all');
  showAdvancedFilters = signal(false);

  filteredNurses = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const shift = this.shiftFilter();
    
    return this.nurses().filter(n => {
      const matchesSearch = 
        n.User.firstName.toLowerCase().includes(term) || 
        n.User.lastName.toLowerCase().includes(term) ||
        n.specialization.toLowerCase().includes(term);
      
      const matchesShift = shift === 'all' || n.shift === shift;
      
      return matchesSearch && matchesShift;
    });
  });

  constructor(
    private http: HttpClient,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    this.loadNurses();
  }

  getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
  }

  loadNurses() {
    this.http.get<any[]>('http://localhost:5000/api/nurses', { headers: this.getHeaders() })
      .subscribe(data => this.nurses.set(data));
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters.set(!this.showAdvancedFilters());
  }

  clearFilters() {
    this.searchTerm.set('');
    this.shiftFilter.set('all');
    Swal.fire({
      title: 'Filtros Limpiados',
      text: 'Se han restablecido todos los filtros',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }

  createNewNurse() {
    Swal.fire({
      title: 'Nueva/o Enfermera/o',
      html: `
        <div class="text-start">
          <div class="row g-2">
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Nombre</label>
              <input id="firstName" class="form-control form-control-sm" placeholder="María">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Apellido</label>
              <input id="lastName" class="form-control form-control-sm" placeholder="González">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Email</label>
              <input id="email" type="email" class="form-control form-control-sm" placeholder="enfermera@medicus.com">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Teléfono</label>
              <input id="phone" class="form-control form-control-sm" placeholder="+58412-1234567">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Licencia</label>
              <input id="licenseNumber" class="form-control form-control-sm" placeholder="ENF-12345">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Turno</label>
              <select id="shift" class="form-select form-select-sm">
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
                <option value="Rotativo">Rotativo</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold mb-1">Especialización</label>
              <select id="specialization" class="form-select form-select-sm">
                <option value="Enfermería General">Enfermería General</option>
                <option value="Cuidados Intensivos">Cuidados Intensivos</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Quirófano">Quirófano</option>
                <option value="Emergencias">Emergencias</option>
                <option value="Geriatría">Geriatría</option>
                <option value="Neonatología">Neonatología</option>
                <option value="Oncología">Oncología</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold mb-1">Contraseña</label>
              <input id="password" type="password" class="form-control form-control-sm" placeholder="Mínimo 6 caracteres">
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear Enfermera/o',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#64748b',
      width: '600px',
      customClass: {
        popup: 'swal-no-overflow'
      },
      preConfirm: () => {
        const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
        const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const licenseNumber = (document.getElementById('licenseNumber') as HTMLInputElement).value;
        const shift = (document.getElementById('shift') as HTMLSelectElement).value;
        const specialization = (document.getElementById('specialization') as HTMLSelectElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        if (!firstName || !lastName || !email || !phone || !licenseNumber || !password) {
          Swal.showValidationMessage('Por favor completa todos los campos obligatorios');
          return false;
        }

        return { firstName, lastName, email, phone, licenseNumber, shift, specialization, password };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nurseData = {
          username: result.value.email.split('@')[0],
          email: result.value.email,
          password: result.value.password,
          firstName: result.value.firstName,
          lastName: result.value.lastName,
          phone: result.value.phone,
          licenseNumber: result.value.licenseNumber,
          shift: result.value.shift,
          specialization: result.value.specialization
        };

        this.http.post('http://localhost:5000/api/nurses', nurseData, { headers: this.getHeaders() })
          .subscribe({
            next: () => {
              this.loadNurses();
              Swal.fire({
                title: '¡Enfermera/o Creada/o!',
                text: 'El personal de enfermería ha sido registrado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#0ea5e9'
              });
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: err.error?.message || 'No se pudo crear el registro. Verifica los datos.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
              });
            }
          });
      }
    });
  }

  deleteNurse(id: string) {
    Swal.fire({
      title: '¿Confirmar eliminación?',
      text: "Se borrará el registro del enfermero/a.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:5000/api/nurses/${id}`, { headers: this.getHeaders() })
          .subscribe({
            next: () => {
              this.loadNurses();
              Swal.fire({
                title: '¡Eliminado!',
                text: 'Registro eliminado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#0ea5e9'
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el registro',
                icon: 'error',
                confirmButtonColor: '#ef4444'
              });
            }
          });
      }
    });
  }
}
