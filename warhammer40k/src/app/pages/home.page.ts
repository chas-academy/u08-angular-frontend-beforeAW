import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="bg-gray-900 text-white font-serif flex flex-col min-h-screen">
      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8 flex-grow max-w-[1400px]">
        <h2 class="text-2xl font-bold text-yellow-500 mb-6">Navigation</h2>
        <nav>
          <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <li><button (click)="go('factions')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Factions</button></li>
            <li><button (click)="go('subfactions')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Subfactions</button></li>
            <li><button (click)="go('figures')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Figures</button></li>
            <li><button (click)="go('units')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Units</button></li>
            <li><button (click)="go('weapons')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Weapons</button></li>
            <li><button (click)="go('weaponsprofiles')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Weapon Profiles</button></li>
            <li><button (click)="go('abilities')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Abilities</button></li>
            <li><button (click)="go('keywords')" class="block w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition">Keywords</button></li>
          </ul>
        </nav>
      </main>

    </div>
  `,
  styles: [],
})
export class HomePage {
  constructor(private router: Router) {}
  go(path: string) {
    this.router.navigateByUrl('/' + path);
  }
}
