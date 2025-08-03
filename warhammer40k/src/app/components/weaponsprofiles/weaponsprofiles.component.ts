import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCrudService } from '../../services/api-crud.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weaponsprofiles',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <div>
      <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded mb-4" (click)="openAddModal()">Add Weapon Profile</button>
      <div *ngIf="weaponsprofiles.length === 0">No weapon profiles found.</div>
      <div *ngFor="let weaponsprofile of weaponsprofiles" class="p-4 border rounded mb-2">
        <h2>{{ weaponsprofile.name }}</h2>
        <button class="edit-weapon-profile-btn bg-yellow-500 text-gray-900 px-4 py-2 rounded mr-2"
                (click)="openEditModal(weaponsprofile)">Edit</button>
        <button class="delete-weapon-profile-btn bg-red-700 text-gray-300 px-4 py-2 rounded"
                (click)="deleteWeaponProfile(weaponsprofile)">Delete</button>
      </div>
    </div>

    <app-modal [(open)]="modalOpen">
      <form (ngSubmit)="submitForm()" #weaponProfileForm="ngForm">
        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit' : 'Add' }} Weapon Profile</h2>
        <div class="mb-2">
          <label>Name:</label>
          <input class="border rounded px-2 py-1 w-full" [(ngModel)]="form.name" name="name" required />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 rounded bg-gray-300" (click)="closeModal()">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-yellow-500 text-gray-900" [disabled]="weaponProfileForm.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class WeaponsProfilesComponent implements OnInit {
  weaponsprofiles: WeaponProfile[] = [];
  modalOpen = false;
  isEditMode = false;
  currentWeaponProfileId: string | null = null;
  form = { name: '' };

  constructor(private apiCrud: ApiCrudService) {}

  ngOnInit() {
    this.loadWeaponProfiles();
  }

  loadWeaponProfiles() {
    this.apiCrud.getAll<WeaponProfile>('weaponsprofiles').subscribe({
      next: (profiles: WeaponProfile[]) => this.weaponsprofiles = profiles,
      error: (err: any) => alert('Failed to load weapon profiles: ' + err.message)
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentWeaponProfileId = null;
    this.form = { name: '' };
    this.modalOpen = true;
  }

  openEditModal(profile: WeaponProfile) {
    this.isEditMode = true;
    this.currentWeaponProfileId = profile._id ?? null;
    this.form = { name: profile.name };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitForm() {
    if (this.isEditMode && this.currentWeaponProfileId) {
      this.apiCrud.updateOne<Omit<WeaponProfile, '_id'>>(
        'weaponsprofiles',
        this.currentWeaponProfileId,
        this.form
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadWeaponProfiles();
        },
        error: (err: any) => alert('Failed to update weapon profile: ' + err.message)
      });
    } else {
      this.apiCrud.postOne<Omit<WeaponProfile, '_id'>>('weaponsprofiles', this.form).subscribe({
        next: () => {
          this.closeModal();
          this.loadWeaponProfiles();
        },
        error: (err: any) => alert('Failed to add weapon profile: ' + err.message)
      });
    }
  }

  deleteWeaponProfile(profile: WeaponProfile) {
    if (confirm(`Are you sure you want to delete the weapon profile "${profile.name}"?`)) {
      this.apiCrud.deleteOne('weaponsprofiles', profile._id ?? '').subscribe({
        next: () => this.loadWeaponProfiles(),
        error: (err: any) => alert('Failed to delete weapon profile: ' + err.message)
      });
    }
  }
}

export interface WeaponProfile {
  _id?: string;
  name: string;
}
