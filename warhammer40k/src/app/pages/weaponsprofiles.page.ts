import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeaponsProfilesComponent } from '../components/weaponsprofiles/weaponsprofiles.component';
import { Router } from '@angular/router';
import { ApiCrudService } from '../services/api-crud.service';

export interface WeaponsProfile {
  _id?: string;
  name: string;
}

@Component({
  selector: 'app-weaponsprofiles-page',
  standalone: true,
imports: [WeaponsProfilesComponent, CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px] bg-gray-900 text-gray-300 font-serif min-h-screen">
      <button (click)="goBack()" class="mb-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Return</button>
      <h2 class="text-xl font-bold text-yellow-500 mb-4">Weapon Profiles</h2>
      <app-weaponsprofiles></app-weaponsprofiles>
    </main>
  `
})
export class WeaponsprofilesPage implements OnInit {
  weaponsprofiles: WeaponsProfile[] = [];
  constructor(private router: Router, private apiCrud: ApiCrudService) {}
  ngOnInit() {
    this.apiCrud.getAll<WeaponsProfile>('weaponsprofiles').subscribe({
      next: (weaponsprofiles) => this.weaponsprofiles = weaponsprofiles,
      error: (err: any) => alert('Failed to load weapon profiles: ' + err.message)
    });
  }
  goBack() {
    this.router.navigateByUrl('/');
  }
}
