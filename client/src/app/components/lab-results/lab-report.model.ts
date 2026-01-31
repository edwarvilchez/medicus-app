export interface LabReportHeader {
  labOrder: string; // M0018-P25134
  patientName: string;
  ci: string;
  sex: 'Masculino' | 'Femenino';
  age: number;
  entryDate: string;
  entryTime: string;
  address: string;
  phone: string;
  printDate: string;
  agreement?: string; // Convenio (Bancamiga, etc)
  doctor?: string;
}

export interface LabResultItem {
  description: string;
  result: string | number;
  units: string;
  referenceValues: string;
  isAbnormal?: boolean; // Para marcar en rojo
}

export interface LabSection {
  title: string; // HEMATOLOGIA, QUIMICA SANGUINEA, etc.
  items: LabResultItem[];
}

export interface LabReport {
  header: LabReportHeader;
  sections: LabSection[];
}

// Estructura Predeterminada para Hematología Completa (Basada en la imagen)
export const HEMATOLOGY_STRUCTURE: LabResultItem[] = [
  { description: 'GLOBULOS BLANCOS', result: '', units: '10^3/mm3', referenceValues: '4,00 - 10,80' },
  { description: 'GLOBULOS ROJOS', result: '', units: '10^6/mm3', referenceValues: '4,0 - 6,1' },
  { description: 'HEMOGLOBINA', result: '', units: 'g/dL', referenceValues: '13,5 - 16,5' },
  { description: 'HEMATOCRITO', result: '', units: '%', referenceValues: '42,0 - 52,0' },
  { description: 'VCM', result: '', units: 'fL', referenceValues: '80 - 100' },
  { description: 'HCM', result: '', units: 'pg', referenceValues: '27 - 34' },
  { description: 'CHCM', result: '', units: 'g/dL', referenceValues: '31 - 36' },
  { description: 'R.D.W.', result: '', units: '%', referenceValues: '11,5 - 16,0' },
  // Diferencial...
];

export const CHEMISTRY_STRUCTURE: LabResultItem[] = [
  { description: 'GLICEMIA', result: '', units: 'mg/dL', referenceValues: '70,0 - 110,0' },
  { description: 'UREA', result: '', units: 'mg/dL', referenceValues: '10,0 - 50,0' },
  { description: 'CREATININA', result: '', units: 'mg/dL', referenceValues: '0,70 - 1,30' },
  { description: 'COLESTEROL TOTAL', result: '', units: 'mg/dL', referenceValues: '0,0 - 200,0' },
  { description: 'TRIGLICERIDOS', result: '', units: 'mg/dL', referenceValues: '0,0 - 150,0' },
];
