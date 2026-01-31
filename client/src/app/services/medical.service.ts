import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalService {
  private recordsUrl = 'http://localhost:5000/api/medical-records';
  private labsUrl = 'http://localhost:5000/api/lab-results';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getPatientHistory(patientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.recordsUrl}/patient/${patientId}`, { headers: this.getHeaders() });
  }

  createRecord(record: any): Observable<any> {
    return this.http.post<any>(this.recordsUrl, record, { headers: this.getHeaders() });
  }

  getPatientLabs(patientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.labsUrl}/patient/${patientId}`, { headers: this.getHeaders() });
  }

  createLabResult(lab: any): Observable<any> {
    return this.http.post<any>(this.labsUrl, lab, { headers: this.getHeaders() });
  }
}
