import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-figures',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Figure</button>
      <div *ngIf="figures.length === 0">No figures found.</div>
      <div *ngFor="let figure of figures" class="p-4 border rounded mb-2">
        <h2>{{ figure.name }}</h2>
        <p>Movement: {{ figure.movement }}"</p>
        <p>Toughness: {{ figure.toughness }}</p>
        <p>Saves: {{ figure.saves }}+</p>
        <p>Wounds: {{ figure.wounds }}</p>
        <p>Leadership: {{ figure.leadership }}</p>
        <p>OC: {{ figure.oc }}</p>
        <p>Invulnerable Save: {{ figure.invurnerableSave > 0 ? figure.invurnerableSave + '+' : 'None' }}</p>
        <p>Weapons:</p>
        <ul>
          <li *ngFor="let w of (figure.weapon || [])">{{ w.name }}</li>
          <li *ngIf="!figure.weapon || figure.weapon.length === 0">No weapons</li>
        </ul>
        <button class="edit-figure-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2"
                (click)="openEditModal(figure)">Edit</button>
        <button class="delete-figure-btn bg-red-700 text-gray-300 px-4 py-2 rounded"
                (click)="deleteFigure(figure)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #figureForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Figure</h2>
        <div class="mb-2">
          <label>Name:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.name" name="name" required />
        </div>
        <div class="mb-2">
          <label>Movement:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.movement" name="movement" required />
        </div>
        <div class="mb-2">
          <label>Toughness:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.toughness" name="toughness" required />
        </div>
        <div class="mb-2">
          <label>Saves:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.saves" name="saves" required />
        </div>
        <div class="mb-2">
          <label>Wounds:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.wounds" name="wounds" required />
        </div>
        <div class="mb-2">
          <label>Leadership:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.leadership" name="leadership" required />
        </div>
        <div class="mb-2">
          <label>OC:</label>
          <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.oc" name="oc" required />
        </div>
        <div class="mb-2">
          <label>Invulnerable Save:</label>
        <input type="number" class="border rounded px-2 py-1 w-full" [(ngModel)]="form.invurnerableSave" name="invurnerableSave" required />
        </div>
        <div class="mb-2">
          <label>Weapon:</label>
          <select class="border rounded px-2 py-1 w-full" [(ngModel)]="form.weaponId" name="weaponId">
            <option value="">None</option>
            <option *ngFor="let w of weapons" [value]="w._id">{{ w.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="figureForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class FiguresComponent implements OnInit {
  figures: Figure[] = [];
  weapons: Weapon[] = [];
  modalOpen = false;
  isEditMode = false;
  currentFigureId: string | null = null;
  form = {
    name: '',
    movement: 0,
    toughness: 0,
    saves: 0,
    wounds: 0,
    leadership: 0,
    oc: 0,
    invurnerableSave: 0,
    weaponId: ''
  };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadFigures();
    this.loadWeapons();
  }

  loadFigures() {
    this.apiCrud.getAll<Figure>('figures').subscribe({
      next: (figures: Figure[]) => this.figures = figures,
      error: (err: any) => alert('Failed to load figures: ' + err.message)
    });
  }

  loadWeapons() {
    this.apiCrud.getAll<Weapon>('weapons').subscribe({
      next: (weapons: Weapon[]) => this.weapons = weapons,
      error: (err: any) => alert('Failed to load weapons: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentFigureId = null;
    this.form = {
      name: '',
      movement: 0,
      toughness: 0,
      saves: 0,
      wounds: 0,
      leadership: 0,
      oc: 0,
      invurnerableSave: 0,
      weaponId: ''
    };
    this.modalOpen = true;
  }

  openEditModal(figure: Figure) {
    this.isEditMode = true;
    this.currentFigureId = figure._id ?? null;
    this.form = {
      name: figure.name,
      movement: figure.movement,
      toughness: figure.toughness,
      saves: figure.saves,
      wounds: figure.wounds,
      leadership: figure.leadership,
      oc: figure.oc,
      invurnerableSave: figure.invurnerableSave,
      weaponId: (figure.weapon && figure.weapon.length > 0) ? figure.weapon[0]._id ?? '' : ''
    };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    // Remove weaponId from payload, only send weapon as string[]
    const { weaponId, ...rest } = this.form;
    const payload = {
      ...rest,
      weapon: weaponId ? [weaponId] : []
    } as Omit<Figure, '_id'> & { weapon: string[] };
    if (this.isEditMode && this.currentFigureId) {
      this.apiCrud.updateOne<Omit<Figure, '_id'> & { weapon: string[] }>(
        'figures',
        this.currentFigureId,
        payload
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadFigures();
        },
        error: (err: any) => alert('Failed to update figure: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Omit<Figure, '_id'> & { weapon: string[] }>('figures', payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadFigures();
        },
        error: (err: any) => alert('Failed to add figure: ' + err.message)
      });
    }
  }

  deleteFigure(figure: Figure) {
    if (confirm(`Are you sure you want to delete the figure "${figure.name}"?`)) {
      this.apiCrud.deleteOne('figures', figure._id ?? '').subscribe({
        next: () => this.loadFigures(),
        error: (err: any) => alert('Failed to delete figure: ' + err.message)
      });
    }
  }
}

export interface Figure {
  _id?: string;
  name: string;
  movement: number;
  toughness: number;
  saves: number;
  wounds: number;
  leadership: number;
  oc: number;
  invurnerableSave: number;
  weapon?: Weapon[];
}

export interface Weapon {
  _id?: string;
  name: string;
}
