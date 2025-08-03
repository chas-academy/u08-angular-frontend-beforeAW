import { Routes } from '@angular/router';
import { FactionsPage } from './pages/factions.page';
import { HomePage } from './pages/home.page';
import { SubfactionsPage } from './pages/subfactions.page';
import { FiguresPage } from './pages/figures.page';
import { UnitsPage } from './pages/units.page';
import { WeaponsPage } from './pages/weapons.page';
import { WeaponsprofilesPage } from './pages/weaponsprofiles.page';
import { AbilitiesPage } from './pages/abilities.page';
import { KeywordsPage } from './pages/keywords.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'factions', component: FactionsPage },
  { path: 'subfactions', component: SubfactionsPage },
  { path: 'figures', component: FiguresPage },
  { path: 'units', component: UnitsPage },
  { path: 'weapons', component: WeaponsPage },
  { path: 'weaponsprofiles', component: WeaponsprofilesPage },
  { path: 'abilities', component: AbilitiesPage },
  { path: 'keywords', component: KeywordsPage },
];
