import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-subfactions',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Subfaction</button>
      <div *ngIf="subfactions.length === 0">No subfactions found.</div>
      <div *ngFor="let subfaction of subfactions" class="p-4 border rounded mb-2">
        <h2>{{ subfaction.name }}</h2>
        <p>Faction: {{ subfaction.faction.name }}</p>
        <button class="edit-subfaction-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2"
                (click)="openEditModal(subfaction)">Edit</button>
        <button class="delete-subfaction-btn bg-red-700 text-gray-300 px-4 py-2 rounded"
                (click)="deleteSubfaction(subfaction)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #subfactionForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Subfaction</h2>
        <div class="mb-2">
          <label>Name:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.name" name="name" required />
        </div>
        <div class="mb-2">
          <label>Faction:</label>
          <select class="border rounded px-2 py-1 w-full" [(ngModel)]="form.faction" name="faction" required>
            <option *ngFor="let f of factions" [value]="f._id">{{ f.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="subfactionForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class SubfactionsComponent implements OnInit {
  subfactions: Subfaction[] = [];
  factions: Faction[] = [];
  modalOpen = false;
  isEditMode = false;
  currentSubfactionId: string | null = null;
  form = { name: '', faction: '' };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadSubfactions();
    this.loadFactions();
  }

  loadSubfactions() {
    this.apiCrud.getAll<Subfaction>('subfactions').subscribe({
      next: (subfactions: Subfaction[]) => this.subfactions = subfactions,
      error: (err: any) => alert('Failed to load subfactions: ' + err.message)
    });
  }

  loadFactions() {
    this.apiCrud.getAll<Faction>('factions').subscribe({
      next: (factions: Faction[]) => this.factions = factions,
      error: (err: any) => alert('Failed to load factions: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentSubfactionId = null;
    this.form = { name: '', faction: '' };
    this.modalOpen = true;
  }

  openEditModal(subfaction: Subfaction) {
    this.isEditMode = true;
    this.currentSubfactionId = subfaction._id ?? null;
    this.form = { name: subfaction.name, faction: subfaction.faction._id ?? '' };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    if (this.isEditMode && this.currentSubfactionId) {
      this.apiCrud.updateOne<Omit<Subfaction, '_id' | 'faction'> & { faction: string }>(
        'subfactions',
        this.currentSubfactionId,
        this.form
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadSubfactions();
        },
        error: (err: any) => alert('Failed to update subfaction: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Omit<Subfaction, '_id' | 'faction'> & { faction: string }>('subfactions', this.form).subscribe({
        next: () => {
          this.closeModal();
          this.loadSubfactions();
        },
        error: (err: any) => alert('Failed to add subfaction: ' + err.message)
      });
    }
  }

  deleteSubfaction(subfaction: Subfaction) {
    if (confirm(`Are you sure you want to delete the subfaction "${subfaction.name}"?`)) {
      this.apiCrud.deleteOne('subfactions', subfaction._id ?? '').subscribe({
        next: () => this.loadSubfactions(),
        error: (err: any) => alert('Failed to delete subfaction: ' + err.message)
      });
    }
  }
}

export interface Subfaction {
  _id?: string;
  name: string;
  faction: Faction;
}

export interface Faction {
  _id?: string;
  name: string;
}
