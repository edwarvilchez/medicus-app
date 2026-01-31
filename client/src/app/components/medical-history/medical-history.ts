import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MedicalService } from '../../services/medical.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './medical-history.html',
  styleUrl: './medical-history.css',
})
export class MedicalHistory implements OnInit {
  patientId = signal<string>('');
  patient = signal<any>(null);
  records = signal<any[]>([]);
  labs = signal<any[]>([]);
  
  showRecordModal = signal(false);
  recordForm: FormGroup;

  patients = signal<any[]>([]);

  constructor(
    private medicalService: MedicalService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.recordForm = this.fb.group({
      diagnosis: ['', Validators.required],
      treatment: [''],
      indications: [''],
      physicalExam: [''],
      patientId: [''],
      doctorId: ['']
    });
  }

  ngOnInit() {
    this.loadPatients();
    this.route.queryParams.subscribe(params => {
        if(params['id']) {
            this.selectPatient(params['id']);
        }
    });
  }

  loadPatients() {
    this.http.get<any[]>('http://localhost:5000/api/patients').subscribe(data => this.patients.set(data));
  }

  selectPatient(id: string) {
    this.patientId.set(id);
    const p = this.patients().find(x => x.id === id);
    if(p) this.patient.set(p);
    this.loadHistory();
  }

  loadHistory() {
    if(!this.patientId()) return;
    this.medicalService.getPatientHistory(this.patientId()).subscribe(data => this.records.set(data));
    this.medicalService.getPatientLabs(this.patientId()).subscribe(data => this.labs.set(data));
  }

  openRecordModal() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.recordForm.patchValue({
        patientId: this.patientId(),
        doctorId: user.id
    });
    this.showRecordModal.set(true);
  }

  submitRecord() {
    if(this.recordForm.valid) {
        this.medicalService.createRecord(this.recordForm.value).subscribe({
            next: () => {
                this.loadHistory();
                this.showRecordModal.set(false);
                this.recordForm.reset();
                Swal.fire('Guardado', 'El informe médico ha sido integrado al historial.', 'success');
            },
            error: () => Swal.fire('Error', 'No se pudo guardar el registro.', 'error')
        });
    }
  }
}
