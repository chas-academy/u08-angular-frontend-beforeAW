import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
export interface Weapon {
  _id?: string;
  name: string;
  type: string;
  range: number;
  attacks: number;
  strength: number;
  ap: number;
  damage: number;
}
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weapons',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Weapon</button>
      <div *ngIf="weapons.length === 0">No weapons found.</div>
      <div *ngFor="let weapon of weapons" class="p-4 border rounded mb-2">
        <h2>{{ weapon.name }}</h2>
        <p>Type: {{ weapon.type }}</p>
        <p>Range: {{ weapon.range }}</p>
        <p>Attacks: {{ weapon.attacks }}</p>
        <p>Strength: {{ weapon.strength }}</p>
        <p>AP: {{ weapon.ap }}</p>
        <p>Damage: {{ weapon.damage }}</p>
        <button class="edit-weapon-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2" (click)="openEditModal(weapon)">Edit</button>
        <button class="delete-weapon-btn bg-red-700 text-gray-300 px-4 py-2 rounded" (click)="deleteWeapon(weapon)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #weaponForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Weapon</h2>
        <div class="mb-2">
          <label>Name:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.name" name="name" required />
        </div>
        <div class="mb-2">
          <label>Type:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.type" name="type" required />
        </div>
        <div class="mb-2">
          <label>Range:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.range" name="range" required />
        </div>
        <div class="mb-2">
          <label>Attacks:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.attacks" name="attacks" required />
        </div>
        <div class="mb-2">
          <label>Strength:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.strength" name="strength" required />
        </div>
        <div class="mb-2">
          <label>AP:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.ap" name="ap" required />
        </div>
        <div class="mb-2">
          <label>Damage:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.damage" name="damage" required />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="weaponForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class WeaponsComponent implements OnInit {
  weapons: Weapon[] = [];
  modalOpen = false;
  isEditMode = false;
  currentWeaponId: string | null = null;
  form: Weapon = {
    name: '',
    type: '',
    range: 0,
    attacks: 0,
    strength: 0,
    ap: 0,
    damage: 0
  };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadWeapons();
  }

  loadWeapons() {
    this.apiCrud.getAll<Weapon>('weapons').subscribe({
      next: (weapons) => this.weapons = weapons,
      error: (err: any) => alert('Failed to load weapons: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentWeaponId = null;
    this.form = {
      name: '',
      type: '',
      range: 0,
      attacks: 0,
      strength: 0,
      ap: 0,
      damage: 0
    };
    this.modalOpen = true;
  }

  openEditModal(weapon: Weapon) {
    this.isEditMode = true;
    this.currentWeaponId = weapon._id ?? null;
    this.form = {
      name: weapon.name,
      type: weapon.type,
      range: weapon.range,
      attacks: weapon.attacks,
      strength: weapon.strength,
      ap: weapon.ap,
      damage: weapon.damage
    };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    if (this.isEditMode && this.currentWeaponId) {
      this.apiCrud.updateOne<Weapon>('weapons', this.currentWeaponId, this.form).subscribe({
        next: () => {
          this.closeModal();
          this.loadWeapons();
        },
        error: (err: any) => alert('Failed to update weapon: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Weapon>('weapons', this.form).subscribe({
        next: () => {
          this.closeModal();
          this.loadWeapons();
        },
        error: (err: any) => alert('Failed to add weapon: ' + err.message)
      });
    }
  }

  deleteWeapon(weapon: Weapon) {
    if (confirm(`Are you sure you want to delete the weapon "${weapon.name}"?`)) {
      this.apiCrud.deleteOne('weapons', weapon._id ?? '').subscribe({
        next: () => this.loadWeapons(),
        error: (err: any) => alert('Failed to delete weapon: ' + err.message)
      });
    }
  }
}
