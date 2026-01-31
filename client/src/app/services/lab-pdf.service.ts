import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LabReport } from '../components/lab-results/lab-report.model';

@Injectable({
  providedIn: 'root'
})
export class LabPdfService {

  // Método privado para crear el documento
  private createDoc(report: LabReport): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // --- CABECERA (Header) ---
    // Título / Logo placeholder
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    // doc.text("MEDICUS", 14, 15); // Logo iría aquí
    
    // Nro de Orden (Derecha)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(report.header.labOrder, pageWidth - 14, 15, { align: 'right' });
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(14, 18, pageWidth - 14, 18);

    // Datos del Paciente (Grid como en la imagen)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    let y = 25;
    const leftCol = 14;
    const midCol = 90; // Ajustado
    const rightCol = 150; // Ajustado
    
    // Fila 1
    doc.setFont('helvetica', 'bold'); doc.text('Paciente:', leftCol, y);
    doc.setFont('helvetica', 'normal'); doc.text(`${report.header.patientName}  CI: ${report.header.ci}`, leftCol + 16, y);

    doc.setFont('helvetica', 'bold'); doc.text('Sexo:', 115, y); // Ajuste manual de posición
    doc.setFont('helvetica', 'normal'); doc.text(report.header.sex, 125, y);
    
    doc.setFont('helvetica', 'bold'); doc.text('Edad:', 145, y);
    doc.setFont('helvetica', 'normal'); doc.text(`${report.header.age} Años`, 155, y);

    doc.setFont('helvetica', 'bold'); doc.text('Ingreso:', rightCol + 15, y);
    doc.setFont('helvetica', 'normal'); doc.text(report.header.entryDate, rightCol + 30, y);

    y += 6;
    // Fila 2
    doc.setFont('helvetica', 'bold'); doc.text('Dirección:', leftCol, y);
    doc.setFont('helvetica', 'normal'); doc.text(report.header.address, leftCol + 18, y);

    doc.setFont('helvetica', 'bold'); doc.text('Teléfono:', 115, y);
    doc.setFont('helvetica', 'normal'); doc.text(report.header.phone, 130, y);

    doc.setFont('helvetica', 'bold'); doc.text('Hora:', rightCol + 15, y);
    doc.setFont('helvetica', 'normal'); doc.text(report.header.entryTime, rightCol + 25, y);

    y += 6;
    // Fila 3
    doc.setFont('helvetica', 'bold'); doc.text('Convenio:', leftCol, y);
    const convenio = report.header.agreement || 'PARTICULAR';
    doc.setFont('helvetica', 'normal'); doc.text(convenio, leftCol + 18, y);

    doc.setFont('helvetica', 'bold'); doc.text('Imp:', rightCol + 15, y); // Impresión
    doc.setFont('helvetica', 'normal'); doc.text(report.header.printDate, rightCol + 23, y);
    
    // Línea separadora final cabecera
    y += 4;
    doc.line(14, y, pageWidth - 14, y);

    y += 10; // Espacio antes del contenido

    // --- SECCIONES ---
    
    report.sections.forEach(section => {
      // Título de Sección (Ej: HEMATOLOGIA / QUIMICA SANGUINEA)
      // Color naranja/oro de la imagen
      doc.setTextColor(234, 88, 12); // #ea580c (Orange-600 aprox)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title.toUpperCase(), 14, y);
      
      // Línea debajo del título
      doc.setDrawColor(234, 88, 12);
      doc.setLineWidth(1); // Más gruesa
      doc.line(14, y + 2, 80, y + 2); // Subrayado parcial estilizado
      doc.setDrawColor(0); // Reset color negro
      doc.setTextColor(0); // Reset texto negro

      y += 5;

      // Tabla de Resultados
      autoTable(doc, {
        startY: y,
        head: [['Descripción del Examen', 'Resultado', 'Unidades', 'Valores de Referencia']],
        body: section.items.map(item => [
          item.description,
          item.result,
          item.units,
          item.referenceValues
        ]),
        theme: 'plain', // Limpio, sin bandas de color por defecto para parecerse a la imagen
        styles: {
          fontSize: 10,
          cellPadding: 3,
          valign: 'middle',
        },
        headStyles: {
          fillColor: [255, 255, 255], // Fondo blanco encabezado
          textColor: [0, 0, 0], // Texto negro
          fontStyle: 'bold',
          lineWidth: { bottom: 1 }, // Solo línea abajo
          lineColor: [0, 0, 0] // Línea negra
        },
        columnStyles: {
          0: { cellWidth: 'auto', fontStyle: 'bold' }, // Descripción
          1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }, // Resultado
          2: { cellWidth: 30, halign: 'center' }, // Unidades
          3: { cellWidth: 40, halign: 'center' }  // Ref
        },
        didParseCell: (data) => {
          // Detectar valores anormales y ponerlos en rojo (Columna Resultado index 1)
          if (data.section === 'body' && data.column.index === 1) {
            const rowItem = section.items[data.row.index];
            if (rowItem.isAbnormal) {
              data.cell.styles.textColor = [220, 38, 38]; // Rojo
            }
          }
        },
        margin: { left: 14, right: 14 }
      });

      // Actualizar Y para la siguiente sección
      // @ts-ignore
      y = doc.lastAutoTable.finalY + 10;
    });

    return doc;
  }

  // Descargar el PDF
  generatePDF(report: LabReport) {
    const doc = this.createDoc(report);
    const filename = `Resultados_${report.header.patientName.replace(/\s+/g, '_')}_${report.header.labOrder}.pdf`;
    doc.save(filename);
  }

  // Abrir el PDF en nueva pestaña (Visualizar)
  viewPDF(report: LabReport) {
    const doc = this.createDoc(report);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
