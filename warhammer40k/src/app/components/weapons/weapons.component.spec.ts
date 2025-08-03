import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeaponsComponent } from './weapons.component';
import { ApiCrudService } from '../../services/api-crud.service';
import { of } from 'rxjs';

const mockWeapons = [
  {
    _id: '1',
    name: 'Bolter',
    type: 'Rapid Fire',
    range: 24,
    attacks: 2,
    strength: 4,
    ap: 0,
    damage: 1
  },
  {
    _id: '2',
    name: 'Plasma Gun',
    type: 'Assault',
    range: 18,
    attacks: 1,
    strength: 7,
    ap: -3,
    damage: 1
  }
];

class MockApiCrudService {
  getAll<T>() { return of(mockWeapons); }
  postOne<T>() { return of(mockWeapons[0]); }
  updateOne<T>() { return of(mockWeapons[0]); }
  deleteOne<T>() { return of(undefined); }
}

describe('WeaponsComponent', () => {
  let component: WeaponsComponent;
  let fixture: ComponentFixture<WeaponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponsComponent],
      providers: [{ provide: ApiCrudService, useClass: MockApiCrudService }]
    }).compileComponents();
    fixture = TestBed.createComponent(WeaponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load weapons on init', () => {
    expect(component.weapons.length).toBe(2);
    expect(component.weapons[0].name).toBe('Bolter');
  });

  it('should open add modal', () => {
    component.openAddModal();
    expect(component.modalOpen).toBeTrue();
    expect(component.isEditMode).toBeFalse();
  });

  it('should open edit modal', () => {
    component.openEditModal(mockWeapons[0]);
    expect(component.modalOpen).toBeTrue();
    expect(component.isEditMode).toBeTrue();
    expect(component.form.name).toBe('Bolter');
  });
});
