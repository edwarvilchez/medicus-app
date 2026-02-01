import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<Theme>('light');

  constructor() {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    }
    
    // Efecto para aplicar el tema al HTML
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.currentTheme());
      localStorage.setItem('theme', this.currentTheme());
    });
  }

  get theme() {
    return this.currentTheme.asReadonly();
  }

  toggleTheme() {
    this.currentTheme.update(t => t === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }
}
