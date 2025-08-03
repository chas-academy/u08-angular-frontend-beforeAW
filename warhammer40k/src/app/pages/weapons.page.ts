import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../services/api-crud.service';
import { WeaponsComponent } from '../components/weapons/weapons.component';

@Component({
  selector: 'app-weapons-page',
  standalone: true,
  imports: [CommonModule, WeaponsComponent],
  template: `
    <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px] bg-gray-900 text-gray-300 font-serif min-h-screen">
      <button (click)="goBack()" class="mb-6 bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600 transition">Return</button>
      <h2 class="text-xl font-bold text-yellow-500 mb-4">Weapons</h2>
      <app-weapons></app-weapons>
    </main>
  `
})
export class WeaponsPage implements OnInit {
  weapons: Weapon[] = [];
  constructor(private apiCrud: ApiCrudService, private router: Router) {}
  ngOnInit() {
    this.apiCrud.getAll<Weapon>('weapons').subscribe({
      next: (weapons: Weapon[]) => this.weapons = weapons,
      error: (err: any) => alert('Failed to load weapons: ' + err.message)
    });
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}

export interface Weapon {
  _id?: string;
  name: string;
  type?: string;
  range?: number;
  attacks?: number;
  strength?: number;
  ap?: number;
  damage?: number;
}
