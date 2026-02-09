import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5000/api/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointment);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  getPatientByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/api/patients/user/${userId}`);
  }
}
