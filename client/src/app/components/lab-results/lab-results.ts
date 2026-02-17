import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { LabPdfService } from '../../services/lab-pdf.service';
import { LanguageService } from '../../services/language.service';
import { LabReport, HEMATOLOGY_STRUCTURE, CHEMISTRY_STRUCTURE } from './lab-report.model';

@Component({
  selector: 'app-lab-results',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './lab-results.html',
  styleUrls: []
})
export class LabResults implements OnInit {
  searchControl = new FormControl('');
  
  // Datos mockeados para demostración inmediata
  labResults = signal<any[]>([
    {
      id: 1,
      patientName: 'Juan González',
      patientInitials: 'JG',
      patientId: 'V-11111111',
      testType: 'Hematología Completa',
      date: new Date(),
      status: 'Completado',
      labOrder: 'M0018-P25134'
    },
    {
      id: 2,
      patientName: 'Elena Pérez',
      patientInitials: 'EP',
      patientId: 'V-22222222',
      testType: 'Perfil Lipídico',
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: 'Completado',
      labOrder: 'M0018-P25135'
    },
    {
      id: 3,
      patientName: 'Luis Díaz',
      patientInitials: 'LD',
      patientId: 'V-33333333',
      testType: 'Uroanálisis',
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      status: 'Completado',
      labOrder: 'M0018-P25136'
    }
  ]);

  constructor(
    private pdfService: LabPdfService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
  }

  viewResult(result: any) {
    if (result.status !== 'Completado') {
      Swal.fire('Atención', 'El resultado aún no está disponible para visualizar.', 'warning');
      return;
    }
    const report = this.getMockReport(result);
    this.pdfService.viewPDF(report);
  }

  downloadResult(result: any) {
    if (result.status !== 'Completado') {
      Swal.fire('Atención', 'El resultado aún no está listo para descargar.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Generando PDF',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      const report = this.getMockReport(result);
      this.pdfService.generatePDF(report);
      Swal.close();
    }, 500); 
  }

  private getMockReport(result: any): LabReport {
    const report: LabReport = {
      header: {
        labOrder: result.labOrder || '0000',
        patientName: result.patientName,
        ci: result.patientId.replace('V-', ''),
        sex: 'Masculino',
        age: 48,
        entryDate: new Date(result.date).toLocaleDateString('es-ES'),
        entryTime: '07:15:36 am',
        address: 'MONTALBAN',
        phone: '04241599101',
        printDate: new Date().toLocaleString('es-ES'),
        agreement: 'BANCO DE LA GENTE EMPRENDEDORA (BANGENTE)',
      },
      sections: []
    };

    if (result.testType.includes('Hematología')) {
      const hemItems = [...HEMATOLOGY_STRUCTURE];
      const items = hemItems.map(i => ({...i}));
      
      items[0].result = '5,26';
      items[1].result = '4,8';
      
      report.sections.push({
        title: 'HEMATOLOGIA',
        items: items
      });
    } else if (result.testType.includes('Lipídico') || result.testType.includes('Química')) {
      const chemItems = CHEMISTRY_STRUCTURE.map(i => ({...i}));
      
      chemItems[0].result = '97,6'; 
      chemItems[3].result = '239,0'; chemItems[3].isAbnormal = true;
      chemItems[4].result = '269,6'; chemItems[4].isAbnormal = true;

      report.sections.push({
        title: 'QUIMICA SANGUINEA',
        items: chemItems
      });

      report.sections.push({
        title: 'SEROLOGIA',
        items: [
          { description: 'VDRL', result: 'NO REACTIVO', units: '', referenceValues: 'AVC' }
        ]
      });
    } else {
      report.sections.push({
        title: 'RESULTADOS DE EXAMEN',
        items: [
          { description: 'Examen General', result: 'NORMAL', units: '-', referenceValues: '-' }
        ]
      });
    }

    return report;
  }

  uploadResult() {
    Swal.fire({
      title: 'Subir Resultado',
      html: `
        <input type="file" class="form-control mb-3">
        <select class="form-select mb-3">
          <option selected>Seleccionar Paciente</option>
          <option value="1">Juan González</option>
          <option value="2">Elena Pérez</option>
        </select>
        <select class="form-select">
          <option selected>Tipo de Examen</option>
          <option value="Hematologia">Hematología</option>
          <option value="Orina">Orina</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Subir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0ea5e9',
      preConfirm: () => {
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Éxito!', 'El resultado se ha subido correctamente.', 'success');
        const current = this.labResults();
        this.labResults.set([{
          id: Math.random(),
          patientName: 'Juan González',
          patientInitials: 'JG',
          patientId: 'V-11111111',
          testType: 'Hematología (Nuevo)',
          date: new Date(),
          status: 'Pendiente',
          labOrder: 'M0018-T' + Math.floor(Math.random() * 1000)
        }, ...current]);
      }
    });
  }
}
