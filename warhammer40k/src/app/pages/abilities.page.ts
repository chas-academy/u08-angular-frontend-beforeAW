import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbilitiesComponent } from '../components/abilities/abilities.component';
import { ApiCrudService } from '../services/api-crud.service';

export interface Ability {
  _id?: string;
  name: string;
}

@Component({
  selector: 'app-abilities-page',
  standalone: true,
imports: [AbilitiesComponent, CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px] bg-gray-900 text-gray-300 font-serif min-h-screen">
      <button (click)="goBack()" class="mb-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Return</button>
      <h2 class="text-xl font-bold text-yellow-500 mb-4">Abilities</h2>
      <app-abilities></app-abilities>
    </main>
  `
})
export class AbilitiesPage implements OnInit {
  abilities: Ability[] = [];
  constructor(private router: Router, private apiCrud: ApiCrudService) {}
  ngOnInit() {
    this.apiCrud.getAll<Ability>('abilities').subscribe({
      next: (abilities) => this.abilities = abilities,
      error: (err: any) => alert('Failed to load abilities: ' + err.message)
    });
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}
