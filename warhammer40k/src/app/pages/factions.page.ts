import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FactionsComponent } from '../components/factions/factions.component';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../services/api-crud.service';

export interface Faction {
  _id?: string;
  name: string;
}

@Component({
  selector: 'app-factions-page',
  standalone: true,
imports: [FactionsComponent, CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px] bg-gray-900 text-gray-300 font-serif min-h-screen">
      <button (click)="goBack()" class="mb-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Return</button>
      <h2 class="text-xl font-bold text-yellow-500 mb-4">Factions</h2>
      <app-factions></app-factions>
    </main>
  `
})
export class FactionsPage implements OnInit {
  factions: Faction[] = [];
  constructor(private router: Router, private apiCrud: ApiCrudService) {}
  ngOnInit() {
    this.apiCrud.getAll<Faction>('factions').subscribe({
      next: (factions) => this.factions = factions,
      error: (err: any) => alert('Failed to load factions: ' + err.message)
    });
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}
