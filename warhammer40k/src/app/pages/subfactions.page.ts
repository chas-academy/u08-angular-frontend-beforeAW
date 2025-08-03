import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubfactionsComponent } from '../components/subfactions/subfactions.component';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../services/api-crud.service';

export interface Subfaction {
  _id?: string;
  name: string;
}

@Component({
  selector: 'app-subfactions-page',
  standalone: true,
imports: [SubfactionsComponent, CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px] bg-gray-900 text-gray-300 font-serif min-h-screen">
      <button (click)="goBack()" class="mb-6 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition">Return</button>
      <h2 class="text-xl font-bold text-yellow-500 mb-4">Subfactions</h2>
      <app-subfactions></app-subfactions>
    </main>
  `
})
export class SubfactionsPage implements OnInit {
  subfactions: Subfaction[] = [];
  constructor(private router: Router, private apiCrud: ApiCrudService) {}
  ngOnInit() {
    this.apiCrud.getAll<Subfaction>('subfactions').subscribe({
      next: (subfactions) => this.subfactions = subfactions,
      error: (err: any) => alert('Failed to load subfactions: ' + err.message)
    });
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}
