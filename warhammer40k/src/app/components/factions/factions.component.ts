import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-factions',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Faction</button>
      <div *ngIf="factions.length === 0">No factions found.</div>
      <div *ngFor="let faction of factions" class="p-4 border rounded mb-2">
        <h2>{{ faction.name }}</h2>
        <button class="edit-faction-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2"
                (click)="openEditModal(faction)">Edit</button>
        <button class="delete-faction-btn bg-red-700 text-gray-300 px-4 py-2 rounded"
                (click)="deleteFaction(faction)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #factionForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Faction</h2>
        <div class="mb-2">
          <label>Name:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.name" name="name" required />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="factionForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class FactionsComponent implements OnInit {
  factions: Faction[] = [];
  modalOpen = false;
  isEditMode = false;
  currentFactionId: string | null = null;
  form: Omit<Faction, '_id'> = { name: '' };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadFactions();
  }

  loadFactions() {
    this.apiCrud.getAll<Faction>('factions').subscribe({
      next: (factions: Faction[]) => this.factions = factions,
      error: (err: any) => alert('Failed to load factions: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentFactionId = null;
    this.form = { name: '' };
    this.modalOpen = true;
  }

  openEditModal(faction: Faction) {
    this.isEditMode = true;
    this.currentFactionId = faction._id ?? null;
    this.form = { name: faction.name };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    if (this.isEditMode && this.currentFactionId) {
      this.apiCrud.updateOne<Omit<Faction, '_id'>>(
        'factions',
        this.currentFactionId,
        this.form
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadFactions();
        },
        error: (err: any) => alert('Failed to update faction: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Omit<Faction, '_id'>>('factions', this.form).subscribe({
        next: () => {
          this.closeModal();
          this.loadFactions();
        },
        error: (err: any) => alert('Failed to add faction: ' + err.message)
      });
    }
  }

  deleteFaction(faction: Faction) {
    if (confirm(`Are you sure you want to delete the faction "${faction.name}"?`)) {
      this.apiCrud.deleteOne('factions', faction._id ?? '').subscribe({
        next: () => this.loadFactions(),
        error: (err: any) => alert('Failed to delete faction: ' + err.message)
      });
    }
  }
}

export interface Faction {
  _id?: string;
  name: string;
}
