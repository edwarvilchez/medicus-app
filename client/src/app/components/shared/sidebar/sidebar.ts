import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(
    public langService: LanguageService,
    public authService: AuthService
  ) {}
}
