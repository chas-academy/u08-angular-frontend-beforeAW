import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FiguresComponent } from '../components/figures/figures.component';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../services/api-crud.service';

export interface Figure {
  _id?: string;
  name: string;
}

@Component({
  selector: 'app-figures-page',
  standalone: true,
imports: [FiguresComponent, CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px] bg-gray-900 text-gray-300 font-serif min-h-screen">
      <button (click)="goBack()" class="mb-6 bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600 transition">Return</button>
      <h2 class="text-xl font-bold text-yellow-500 mb-4">Figures</h2>
      <app-figures></app-figures>
    </main>
  `
})
export class FiguresPage implements OnInit {
  figures: Figure[] = [];
  constructor(private router: Router, private apiCrud: ApiCrudService) {}
  ngOnInit() {
    this.apiCrud.getAll<Figure>('figures').subscribe({
      next: (figures) => this.figures = figures,
      error: (err: any) => alert('Failed to load figures: ' + err.message)
    });
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}
