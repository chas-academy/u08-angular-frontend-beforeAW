import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitsComponent } from '../components/units/units.component';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../services/api-crud.service';

export interface Unit {
  _id?: string;
  name: string;
}

@Component({
  selector: 'app-units-page',
  standalone: true,
imports: [UnitsComponent, CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px] bg-gray-900 text-gray-300 font-serif min-h-screen">
      <button (click)="goBack()" class="mb-6 bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600 transition">Return</button>
      <h2 class="text-xl font-bold text-yellow-500 mb-4">Units</h2>
      <app-units></app-units>
    </main>
  `
})
export class UnitsPage implements OnInit {
  units: Unit[] = [];
  constructor(private router: Router, private apiCrud: ApiCrudService) {}
  ngOnInit() {
    this.apiCrud.getAll<Unit>('units').subscribe({
      next: (units) => this.units = units,
      error: (err: any) => alert('Failed to load units: ' + err.message)
    });
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}
