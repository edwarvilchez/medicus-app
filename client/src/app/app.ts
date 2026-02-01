import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/shared/navbar/navbar';
import { Sidebar } from './components/shared/sidebar/sidebar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Medicus');
  isSidebarOpen = false;
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Close sidebar on route change (mobile UX)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeSidebar();
    });
  }
  
  // ... methods
  isAuthPage(): boolean {
      const path = window.location.pathname;
      return path.includes('login') 
          || path.includes('register')
          || path.includes('agendar-cita')
          || path.includes('forgot-password')
          || path.includes('reset-password');
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
