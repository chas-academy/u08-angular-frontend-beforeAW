import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-keywords',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Keyword</button>
      <div *ngIf="keywords.length === 0">No keywords found.</div>
      <div *ngFor="let keyword of keywords" class="p-4 border rounded mb-2">
        <h2>{{ keyword.name }}</h2>
        <button class="edit-keyword-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2"
                (click)="openEditModal(keyword)">Edit</button>
        <button class="delete-keyword-btn bg-red-700 text-gray-300 px-4 py-2 rounded"
                (click)="deleteKeyword(keyword)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #keywordForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Keyword</h2>
        <div class="mb-2">
          <label>Name:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.name" name="name" required />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="keywordForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class KeywordsComponent implements OnInit {
  keywords: Keyword[] = [];
  modalOpen = false;
  isEditMode = false;
  currentKeywordId: string | null = null;
  form = { name: '' };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadKeywords();
  }

  loadKeywords() {
    this.apiCrud.getAll<Keyword>('keywords').subscribe({
      next: (keywords: Keyword[]) => this.keywords = keywords,
      error: (err: any) => alert('Failed to load keywords: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentKeywordId = null;
    this.form = { name: '' };
    this.modalOpen = true;
  }

  openEditModal(keyword: Keyword) {
    this.isEditMode = true;
    this.currentKeywordId = keyword._id ?? null;
    this.form = { name: keyword.name };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    if (this.isEditMode && this.currentKeywordId) {
      this.apiCrud.updateOne<Omit<Keyword, '_id'>>(
        'keywords',
        this.currentKeywordId,
        this.form
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadKeywords();
        },
        error: (err: any) => alert('Failed to update keyword: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Omit<Keyword, '_id'>>('keywords', this.form).subscribe({
        next: () => {
          this.closeModal();
          this.loadKeywords();
        },
        error: (err: any) => alert('Failed to add keyword: ' + err.message)
      });
    }
  }

  deleteKeyword(keyword: Keyword) {
    if (confirm(`Are you sure you want to delete the keyword "${keyword.name}"?`)) {
      this.apiCrud.deleteOne('keywords', keyword._id ?? '').subscribe({
        next: () => this.loadKeywords(),
        error: (err: any) => alert('Failed to delete keyword: ' + err.message)
      });
    }
  }
}

export interface Keyword {
  _id?: string;
  name: string;
}
