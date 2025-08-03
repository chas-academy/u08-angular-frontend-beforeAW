import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-abilities',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Ability</button>
      <div *ngIf="abilities.length === 0">No abilities found.</div>
      <div *ngFor="let ability of abilities" class="p-4 border rounded mb-2">
        <h2>{{ ability.name }}</h2>
        <p>{{ ability.description }}</p>
        <button class="edit-ability-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2"
                (click)="openEditModal(ability)">Edit</button>
        <button class="delete-ability-btn bg-red-700 text-gray-300 px-4 py-2 rounded"
                (click)="deleteAbility(ability)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #abilityForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Ability</h2>
        <div class="mb-2">
          <label>Name:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.name" name="name" required />
        </div>
        <div class="mb-2">
          <label>Description:</label>
          <textarea class="border rounded px-2 py-1 w-full" [(ngModel)]="form.description" name="description" required></textarea>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="abilityForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class AbilitiesComponent implements OnInit {
  abilities: Ability[] = [];
  modalOpen = false;
  isEditMode = false;
  currentAbilityId: string | null = null;
  form: Omit<Ability, '_id'> = { name: '', description: '' };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadAbilities();
  }

  loadAbilities() {
    this.apiCrud.getAll<Ability>('abilities').subscribe({
      next: (abilities: Ability[]) => this.abilities = abilities,
      error: (err: any) => alert('Failed to load abilities: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentAbilityId = null;
    this.form = { name: '', description: '' };
    this.modalOpen = true;
  }

  openEditModal(ability: Ability) {
    this.isEditMode = true;
    this.currentAbilityId = ability._id ?? null;
    this.form = { name: ability.name, description: ability.description };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    if (this.isEditMode && this.currentAbilityId) {
      this.apiCrud.updateOne<Omit<Ability, '_id'>>(
        'abilities',
        this.currentAbilityId,
        this.form
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadAbilities();
        },
        error: (err: any) => alert('Failed to update ability: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Omit<Ability, '_id'>>('abilities', this.form).subscribe({
        next: () => {
          this.closeModal();
          this.loadAbilities();
        },
        error: (err: any) => alert('Failed to add ability: ' + err.message)
      });
    }
  }

  deleteAbility(ability: Ability) {
    if (confirm(`Are you sure you want to delete the ability "${ability.name}"?`)) {
      this.apiCrud.deleteOne('abilities', ability._id ?? '').subscribe({
        next: () => this.loadAbilities(),
        error: (err: any) => alert('Failed to delete ability: ' + err.message)
      });
    }
  }
}

export interface Ability {
  _id?: string;
  name: string;
  description: string;
}
