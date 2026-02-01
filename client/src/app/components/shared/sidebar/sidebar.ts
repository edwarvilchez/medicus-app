import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(public langService: LanguageService) {}
}
