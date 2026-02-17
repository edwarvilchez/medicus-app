import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api-config';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bulk-data.html',
  styleUrl: './bulk-data.css'
})
export class BulkData {
  selectedFile: File | null = null;
  importType = signal<'patients' | 'doctors'>('patients');
  isImporting = signal(false);
  importResults = signal<any>(null);

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public langService: LanguageService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  setImportType(type: 'patients' | 'doctors') {
    this.importType.set(type);
    this.importResults.set(null);
  }

  async startImport() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo CSV', 'error');
      return;
    }

    this.isImporting.set(true);
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post(`${API_URL}/bulk/import/${this.importType()}`, formData, { headers })
      .subscribe({
        next: (res: any) => {
          this.isImporting.set(false);
          this.importResults.set(res);
          Swal.fire('Importación Finalizada', res.message, 'success');
        },
        error: (err) => {
          this.isImporting.set(false);
          Swal.fire('Error', err.error?.error || 'Error al importar datos', 'error');
        }
      });
  }

  downloadTemplate() {
    const type = this.importType();
    let csvContent = '';
    
    if (type === 'patients') {
      csvContent = 'firstName,lastName,email,username,password,documentId,birthDate,gender,phone,address,bloodType,allergies\n' +
                   'Juan,Perez,juan@ejemplo.com,jperez,Medicus123!,12345678,1990-05-15,Male,04121234567,Caracas,O+,Ninguna';
    } else {
      csvContent = 'firstName,lastName,email,username,password,licenseNumber,phone,address,specialty,gender\n' +
                   'Maria,Gomez,maria@ejemplo.com,mgomez,Medicus123!,MPPS-9999,04247654321,Valencia,Cardiologia,Female';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `plantilla_${type}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
