import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Unit</button>
      <div *ngIf="units.length === 0">No units found.</div>
      <div *ngFor="let unit of units" class="p-4 border rounded mb-2">
        <h2>{{ unit.name }}</h2>
        <p>Faction: {{ unit.faction.name }}</p>
        <p>Subfaction: {{ unit.subfaction.name }}</p>
        <p>Figures:</p>
        <ul>
          <li *ngFor="let f of unit.figure">{{ f.name }}</li>
          <li *ngIf="unit.figure.length === 0">No figures</li>
        </ul>
        <p>Abilities:</p>
        <ul>
          <li *ngFor="let a of unit.abilities">{{ a.name }}</li>
          <li *ngIf="unit.abilities.length === 0">No abilities</li>
        </ul>
        <p>Keywords:</p>
        <ul>
          <li *ngFor="let k of unit.keywords">{{ k.name }}</li>
          <li *ngIf="unit.keywords.length === 0">No keywords</li>
        </ul>
        <button class="edit-unit-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2"
                (click)="openEditModal(unit)">Edit</button>
        <button class="delete-unit-btn bg-red-700 text-gray-300 px-4 py-2 rounded"
                (click)="deleteUnit(unit)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #unitForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Unit</h2>
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
        <div class="mb-2">
          <label>Subfaction:</label>
          <select class="border rounded px-2 py-1 w-full" [(ngModel)]="form.subfaction" name="subfaction" required>
            <option *ngFor="let s of subfactions" [value]="s._id">{{ s.name }}</option>
          </select>
        </div>
        <div class="mb-2">
          <label>Figure:</label>
          <select class="border rounded px-2 py-1 w-full" [(ngModel)]="form.figure" name="figure" required>
            <option *ngFor="let fig of figures" [value]="fig._id">{{ fig.name }}</option>
          </select>
        </div>
        <div class="mb-2">
          <label>Ability:</label>
          <select class="border rounded px-2 py-1 w-full" [(ngModel)]="form.abilities" name="abilities" required>
            <option *ngFor="let a of abilities" [value]="a._id">{{ a.name }}</option>
          </select>
        </div>
        <div class="mb-2">
          <label>Keyword:</label>
          <select class="border rounded px-2 py-1 w-full" [(ngModel)]="form.keywords" name="keywords" required>
            <option *ngFor="let k of keywords" [value]="k._id">{{ k.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="unitForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class UnitsComponent implements OnInit {
  units: Unit[] = [];
  factions: Faction[] = [];
  subfactions: Subfaction[] = [];
  figures: Figure[] = [];
  abilities: Ability[] = [];
  keywords: Keyword[] = [];
  modalOpen = false;
  isEditMode = false;
  currentUnitId: string | null = null;
  form = { name: '', faction: '', subfaction: '', figure: '', abilities: '', keywords: '' };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadUnits();
    this.loadFactions();
    this.loadSubfactions();
    this.loadFigures();
    this.loadAbilities();
    this.loadKeywords();
  }

  loadUnits() {
    this.apiCrud.getAll<Unit>('units').subscribe({
      next: (units: Unit[]) => this.units = units,
      error: (err: any) => alert('Failed to load units: ' + err.message)
    });
  }

  loadFactions() {
    this.apiCrud.getAll<Faction>('factions').subscribe({
      next: (factions: Faction[]) => this.factions = factions,
      error: (err: any) => alert('Failed to load factions: ' + err.message)
    });
  }

  loadSubfactions() {
    this.apiCrud.getAll<Subfaction>('subfactions').subscribe({
      next: (subfactions: Subfaction[]) => this.subfactions = subfactions,
      error: (err: any) => alert('Failed to load subfactions: ' + err.message)
    });
  }

  loadFigures() {
    this.apiCrud.getAll<Figure>('figures').subscribe({
      next: (figures: Figure[]) => this.figures = figures,
      error: (err: any) => alert('Failed to load figures: ' + err.message)
    });
  }

  loadAbilities() {
    this.apiCrud.getAll<Ability>('abilities').subscribe({
      next: (abilities: Ability[]) => this.abilities = abilities,
      error: (err: any) => alert('Failed to load abilities: ' + err.message)
    });
  }

  loadKeywords() {
    this.apiCrud.getAll<Keyword>('keywords').subscribe({
      next: (keywords: Keyword[]) => this.keywords = keywords,
      error: (err: any) => alert('Failed to load keywords: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentUnitId = null;
    this.form = { name: '', faction: '', subfaction: '', figure: '', abilities: '', keywords: '' };
    this.modalOpen = true;
  }

  openEditModal(unit: Unit) {
    this.isEditMode = true;
    this.currentUnitId = unit._id ?? null;
    this.form = {
      name: unit.name,
      faction: unit.faction._id ?? '',
      subfaction: unit.subfaction._id ?? '',
      figure: unit.figure[0]?._id ?? '',
      abilities: unit.abilities[0]?._id ?? '',
      keywords: unit.keywords[0]?._id ?? ''
    };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    const payload = {
      name: this.form.name,
      faction: this.form.faction,
      subfaction: this.form.subfaction,
      figure: [this.form.figure],
      abilities: [this.form.abilities],
      keywords: [this.form.keywords]
    };
    if (this.isEditMode && this.currentUnitId) {
      this.apiCrud.updateOne<Omit<Unit, '_id' | 'faction' | 'subfaction' | 'figure' | 'abilities' | 'keywords'> & {
        faction: string;
        subfaction: string;
        figure: string[];
        abilities: string[];
        keywords: string[];
      }>('units', this.currentUnitId, payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadUnits();
        },
        error: (err: any) => alert('Failed to update unit: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Omit<Unit, '_id' | 'faction' | 'subfaction' | 'figure' | 'abilities' | 'keywords'> & {
        faction: string;
        subfaction: string;
        figure: string[];
        abilities: string[];
        keywords: string[];
      }>('units', payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadUnits();
        },
        error: (err: any) => alert('Failed to add unit: ' + err.message)
      });
    }
  }

  deleteUnit(unit: Unit) {
    if (confirm(`Are you sure you want to delete the unit "${unit.name}"?`)) {
      this.apiCrud.deleteOne('units', unit._id ?? '').subscribe({
        next: () => this.loadUnits(),
        error: (err: any) => alert('Failed to delete unit: ' + err.message)
      });
    }
  }
}

export interface Unit {
  _id?: string;
  name: string;
  faction: Faction;
  subfaction: Subfaction;
  figure: Figure[];
  abilities: Ability[];
  keywords: Keyword[];
}

export interface Faction {
  _id?: string;
  name: string;
}

export interface Subfaction {
  _id?: string;
  name: string;
}

export interface Figure {
  _id?: string;
  name: string;
}

export interface Ability {
  _id?: string;
  name: string;
}

export interface Keyword {
  _id?: string;
  name: string;
}
