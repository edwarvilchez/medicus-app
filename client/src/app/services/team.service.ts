import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  Role: {
    name: string;
  };
  specialtyId?: number;
  licenseNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:5000/api/team';

  // Signals for reactive state
  members = signal<TeamMember[]>([]);

  constructor(private http: HttpClient) {}

  getTeam(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(this.apiUrl).pipe(
      tap(members => this.members.set(members))
    );
  }

  addMember(memberData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, memberData).pipe(
      tap(() => this.getTeam().subscribe()) // Refresh list
    );
  }

  removeMember(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.members.update(current => current.filter(m => m.id !== id));
      })
    );
  }
}
